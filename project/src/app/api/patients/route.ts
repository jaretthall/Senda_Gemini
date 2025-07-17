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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const riskLevel = searchParams.get('riskLevel');
    const providerId = searchParams.get('providerId');

    let query = supabaseAdmin
      .from('patients')
      .select(`
        *,
        assigned_provider:users!assigned_provider_id(full_name),
        episodes!inner(
          id,
          status,
          start_date,
          end_date
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,mrn.ilike.%${search}%`);
    }

    if (riskLevel) {
      query = query.eq('risk_level', riskLevel);
    }

    if (providerId) {
      query = query.eq('assigned_provider_id', providerId);
    }

    // Role-based access control
    if (session.user.role === 'provider') {
      query = query.eq('assigned_provider_id', session.user.id);
    }

    const { data: patients, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('API error:', error);
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
      mrn,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      preferred_language = 'english',
      assigned_provider_id
    } = body;

    // Validate required fields
    if (!mrn || !first_name || !last_name || !date_of_birth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .insert({
        mrn,
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        preferred_language,
        assigned_provider_id: assigned_provider_id || session.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
    }

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}