-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'provider', 'staff', 'viewer')),
  department TEXT,
  license_number TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mrn TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  email TEXT,
  address JSONB,
  emergency_contact JSONB,
  insurance_info JSONB,
  preferred_language TEXT DEFAULT 'english',
  is_active BOOLEAN DEFAULT true,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  assigned_provider_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Episodes table (treatment episodes)
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  provider_id UUID REFERENCES public.users(id) NOT NULL,
  episode_type TEXT NOT NULL CHECK (episode_type IN ('initial', 'continuing', 'crisis', 'followup')),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'discontinued', 'transferred')) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  diagnosis_codes TEXT[],
  treatment_goals TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table (PHQ-9, GAD-7, etc.)
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  episode_id UUID REFERENCES public.episodes(id),
  provider_id UUID REFERENCES public.users(id) NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('phq9', 'gad7', 'pcl5', 'custom')),
  score INTEGER,
  max_score INTEGER,
  responses JSONB NOT NULL,
  interpretation TEXT,
  administered_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  provider_id UUID REFERENCES public.users(id) NOT NULL,
  episode_id UUID REFERENCES public.episodes(id),
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('initial', 'followup', 'crisis', 'group', 'phone')),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crisis events table
CREATE TABLE IF NOT EXISTS public.crisis_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  reported_by_id UUID REFERENCES public.users(id) NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  event_type TEXT NOT NULL CHECK (event_type IN ('suicidal_ideation', 'self_harm', 'substance_abuse', 'psychosis', 'other')),
  description TEXT NOT NULL,
  actions_taken TEXT,
  resolution TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'monitoring', 'resolved')) DEFAULT 'active',
  occurred_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table (clinical notes)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  episode_id UUID REFERENCES public.episodes(id),
  provider_id UUID REFERENCES public.users(id) NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('progress', 'assessment', 'treatment_plan', 'crisis', 'discharge')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table (HIPAA compliance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for patients table
CREATE POLICY "Providers can read assigned patients" ON public.patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role IN ('admin', 'provider') OR assigned_provider_id = auth.uid())
    )
  );

CREATE POLICY "Providers can create patients" ON public.patients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'provider')
    )
  );

CREATE POLICY "Providers can update assigned patients" ON public.patients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'admin' OR assigned_provider_id = auth.uid())
    )
  );

-- Similar policies for other tables...
-- (Additional policies would be added for episodes, assessments, etc.)

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON public.patients(mrn);
CREATE INDEX IF NOT EXISTS idx_patients_provider ON public.patients(assigned_provider_id);
CREATE INDEX IF NOT EXISTS idx_episodes_patient ON public.episodes(patient_id);
CREATE INDEX IF NOT EXISTS idx_episodes_provider ON public.episodes(provider_id);
CREATE INDEX IF NOT EXISTS idx_assessments_patient ON public.assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON public.appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_crisis_events_patient ON public.crisis_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_notes_patient ON public.notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON public.episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crisis_events_updated_at BEFORE UPDATE ON public.crisis_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();