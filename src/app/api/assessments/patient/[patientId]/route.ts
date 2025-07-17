import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentType = searchParams.get('type');

    let query = supabaseAdmin
      .from('assessments')
      .select(`
        *,
        provider:users!provider_id(full_name)
      `)
      .eq('patient_id', params.patientId)
      .order('administered_date', { ascending: false });

    if (assessmentType) {
      query = query.eq('assessment_type', assessmentType);
    }

    // Role-based access control
    if (session.user.role === 'provider') {
      // Verify provider has access to this patient
      const { data: patient } = await supabaseAdmin
        .from('patients')
        .select('assigned_provider_id')
        .eq('id', params.patientId)
        .single();

      if (!patient || patient.assigned_provider_id !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    const { data: assessments, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}