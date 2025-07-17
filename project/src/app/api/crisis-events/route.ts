import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabaseAdmin
      .from('crisis_events')
      .select(`
        *,
        patient:patients!inner(
          id,
          first_name,
          last_name,
          mrn,
          assigned_provider_id
        ),
        reported_by:users!reported_by_id(full_name)
      `)
      .eq('status', 'active')
      .order('occurred_at', { ascending: false });

    // Role-based filtering
    if (session.user.role === 'provider') {
      query = query.eq('patients.assigned_provider_id', session.user.id);
    }

    const { data: crisisEvents, error } = await query;

    if (error) {
      console.error('Crisis events error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ crisisEvents });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      patient_id,
      severity,
      event_type,
      description,
      actions_taken,
      occurred_at
    } = body;

    if (!patient_id || !severity || !event_type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: crisisEvent, error } = await supabaseAdmin
      .from('crisis_events')
      .insert({
        patient_id,
        reported_by_id: session.user.id,
        severity,
        event_type,
        description,
        actions_taken,
        occurred_at: occurred_at || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create crisis event' }, { status: 500 });
    }

    // Update patient risk level if necessary
    if (severity === 'critical' || severity === 'high') {
      await supabaseAdmin
        .from('patients')
        .update({ risk_level: severity })
        .eq('id', patient_id);
    }

    return NextResponse.json({ crisisEvent }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}