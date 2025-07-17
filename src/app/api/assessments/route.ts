import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const assessmentType = searchParams.get('type');

    let query = supabaseAdmin
      .from('assessments')
      .select(`
        *,
        patient:patients!inner(
          id,
          first_name,
          last_name,
          mrn,
          assigned_provider_id
        ),
        provider:users!provider_id(full_name)
      `)
      .order('administered_date', { ascending: false });

    // Apply filters
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    if (assessmentType) {
      query = query.eq('assessment_type', assessmentType);
    }

    // Role-based access control
    if (session.user.role === 'provider') {
      query = query.eq('patients.assigned_provider_id', session.user.id);
    }

    const { data: assessments, error } = await query;

    if (error) {
      logger.error('API_ASSESSMENTS', 'Database error', { error: error.message }, error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    logger.info('API_ASSESSMENTS', 'Assessments fetched successfully', {
      count: assessments?.length || 0,
      patientId,
      assessmentType
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    logger.error('API_ASSESSMENTS', 'API error', {}, error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'provider'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      patient_id,
      assessment_type,
      score,
      max_score,
      responses,
      interpretation,
      administered_date
    } = body;

    // Validate required fields
    if (!patient_id || !assessment_type || score === undefined || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate assessment type
    if (!['phq9', 'gad7', 'pcl5', 'edinburgh', 'custom'].includes(assessment_type)) {
      return NextResponse.json({ error: 'Invalid assessment type' }, { status: 400 });
    }

    // Check if user has access to this patient
    if (session.user.role === 'provider') {
      const { data: patient } = await supabaseAdmin
        .from('patients')
        .select('assigned_provider_id')
        .eq('id', patient_id)
        .single();

      if (!patient || patient.assigned_provider_id !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    const { data: assessment, error } = await supabaseAdmin
      .from('assessments')
      .insert({
        patient_id,
        provider_id: session.user.id,
        assessment_type,
        score,
        max_score,
        responses,
        interpretation,
        administered_date: administered_date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) {
      logger.error('API_ASSESSMENTS', 'Failed to create assessment', { 
        error: error.message,
        patient_id,
        assessment_type 
      }, error);
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
    }

    // Update patient risk level if assessment indicates high risk
    if (assessment_type === 'phq9' && score >= 15) {
      await supabaseAdmin
        .from('patients')
        .update({ risk_level: score >= 20 ? 'critical' : 'high' })
        .eq('id', patient_id);
    } else if (assessment_type === 'gad7' && score >= 15) {
      await supabaseAdmin
        .from('patients')
        .update({ risk_level: 'high' })
        .eq('id', patient_id);
    }

    logger.info('API_ASSESSMENTS', 'Assessment created successfully', {
      assessmentId: assessment.id,
      patient_id,
      assessment_type,
      score
    });

    return NextResponse.json({ assessment }, { status: 201 });
  } catch (error) {
    logger.error('API_ASSESSMENTS', 'API error', {}, error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}