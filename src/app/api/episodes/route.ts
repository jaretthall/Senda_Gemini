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
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('episodes')
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
      .order('start_date', { ascending: false });

    // Apply filters
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Role-based access control
    if (session.user.role === 'provider') {
      query = query.eq('patients.assigned_provider_id', session.user.id);
    }

    const { data: episodes, error } = await query;

    if (error) {
      logger.error('API_EPISODES', 'Database error', { error: error.message }, error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    logger.info('API_EPISODES', 'Episodes fetched successfully', {
      count: episodes?.length || 0,
      patientId,
      status
    });

    return NextResponse.json({ episodes });
  } catch (error) {
    logger.error('API_EPISODES', 'API error', {}, error as Error);
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
      episode_type,
      start_date,
      end_date,
      diagnosis_codes,
      treatment_goals,
      notes
    } = body;

    // Validate required fields
    if (!patient_id || !episode_type || !start_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate episode type
    if (!['initial', 'continuing', 'crisis', 'followup'].includes(episode_type)) {
      return NextResponse.json({ error: 'Invalid episode type' }, { status: 400 });
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

    // Validate dates
    if (end_date && new Date(end_date) < new Date(start_date)) {
      return NextResponse.json({ error: 'End date cannot be before start date' }, { status: 400 });
    }

    const { data: episode, error } = await supabaseAdmin
      .from('episodes')
      .insert({
        patient_id,
        provider_id: session.user.id,
        episode_type,
        start_date,
        end_date: end_date || null,
        diagnosis_codes: diagnosis_codes || [],
        treatment_goals: treatment_goals || [],
        notes: notes || ''
      })
      .select()
      .single();

    if (error) {
      logger.error('API_EPISODES', 'Failed to create episode', { 
        error: error.message,
        patient_id,
        episode_type 
      }, error);
      return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
    }

    logger.info('API_EPISODES', 'Episode created successfully', {
      episodeId: episode.id,
      patient_id,
      episode_type
    });

    return NextResponse.json({ episode }, { status: 201 });
  } catch (error) {
    logger.error('API_EPISODES', 'API error', {}, error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}