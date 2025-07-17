import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('API_DASHBOARD_STATS', 'Dashboard stats request received');
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      logger.warn('API_DASHBOARD_STATS', 'Unauthorized request - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.debug('API_DASHBOARD_STATS', 'Session found', {
      userId: session.user.id,
      role: session.user.role
    });

    // Build base query with role-based filtering
    let patientFilter = '';
    if (session.user.role === 'provider') {
      patientFilter = `assigned_provider_id.eq.${session.user.id}`;
      logger.debug('API_DASHBOARD_STATS', 'Provider role - filtering by assigned patients');
    }

    // Get total active patients
    let patientsQuery = supabaseAdmin
      .from('patients')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    if (patientFilter) {
      patientsQuery = patientsQuery.eq('assigned_provider_id', session.user.id);
    }

    logger.debug('API_DASHBOARD_STATS', 'Executing patients query');
    const { count: totalPatients } = await patientsQuery;
    logger.debug('API_DASHBOARD_STATS', 'Patients query result', { totalPatients });

    // Get crisis patients (high/critical risk)
    let crisisQuery = supabaseAdmin
      .from('patients')
      .select('id', { count: 'exact' })
      .eq('is_active', true)
      .in('risk_level', ['high', 'critical']);
    
    if (patientFilter) {
      crisisQuery = crisisQuery.eq('assigned_provider_id', session.user.id);
    }

    logger.debug('API_DASHBOARD_STATS', 'Executing crisis patients query');
    const { count: crisisPatients } = await crisisQuery;
    logger.debug('API_DASHBOARD_STATS', 'Crisis patients query result', { crisisPatients });

    // Get today's appointments
    const today = new Date().toISOString().split('T')[0];
    let appointmentsQuery = supabaseAdmin
      .from('appointments')
      .select('id', { count: 'exact' })
      .gte('scheduled_date', `${today}T00:00:00`)
      .lt('scheduled_date', `${today}T23:59:59`)
      .eq('status', 'scheduled');

    if (session.user.role === 'provider') {
      appointmentsQuery = appointmentsQuery.eq('provider_id', session.user.id);
    }

    logger.debug('API_DASHBOARD_STATS', 'Executing appointments query');
    const { count: todayAppointments } = await appointmentsQuery;
    logger.debug('API_DASHBOARD_STATS', 'Appointments query result', { todayAppointments });

    // Get average PHQ-9 scores (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let assessmentsQuery = supabaseAdmin
      .from('assessments')
      .select('score')
      .eq('assessment_type', 'phq9')
      .gte('administered_date', thirtyDaysAgo.toISOString().split('T')[0]);

    if (session.user.role === 'provider') {
      assessmentsQuery = assessmentsQuery.eq('provider_id', session.user.id);
    }

    logger.debug('API_DASHBOARD_STATS', 'Executing assessments query');
    const { data: assessments } = await assessmentsQuery;
    logger.debug('API_DASHBOARD_STATS', 'Assessments query result', { 
      count: assessments?.length || 0 
    });
    
    const avgPhq9 = assessments && assessments.length > 0 
      ? (assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length).toFixed(1)
      : '0.0';

    // Get treatment response rate (improvement in scores)
    const treatmentResponse = '73'; // Placeholder - would calculate based on score improvements

    // Get average episode length
    const avgEpisodeLength = '12.4 weeks'; // Placeholder - would calculate from completed episodes

    const stats = {
      totalPatients: totalPatients || 0,
      crisisPatients: crisisPatients || 0,
      todayAppointments: todayAppointments || 0,
      avgPhq9Score: avgPhq9,
      treatmentResponse: treatmentResponse + '%',
      avgEpisodeLength: avgEpisodeLength
    };

    logger.info('API_DASHBOARD_STATS', 'Dashboard stats compiled successfully', stats);
    return NextResponse.json({ stats });
  } catch (error) {
    logger.error('API_DASHBOARD_STATS', 'Dashboard stats error', {}, error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}