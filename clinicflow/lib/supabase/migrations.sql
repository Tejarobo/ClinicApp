-- Create custom types if needed
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'receptionist');

-- PROFILES TABLE (links Supabase auth.users to clinic roles)
-- Automatically created when a user signs up via Google OAuth or Phone OTP
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone VARCHAR,
  role TEXT NOT NULL DEFAULT 'receptionist' CHECK (role IN ('admin', 'doctor', 'receptionist')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on new auth user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'receptionist'  -- Default role; admin can change this later
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE visit_type AS ENUM ('consultation', 'follow-up', 'blood-report', 'procedure');
CREATE TYPE medical_file_type AS ENUM ('prescription', 'previous_record', 'external_report');
CREATE TYPE op_status_type AS ENUM ('active', 'expiring', 'expired');
CREATE TYPE activity_log_type AS ENUM ('registration', 'visit', 'file_upload', 'op_renewal');

-- CLINICS TABLE
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone VARCHAR UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist')),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone VARCHAR NOT NULL,
  specialization TEXT DEFAULT 'Homeopathy' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  file_number VARCHAR UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  phone VARCHAR NOT NULL,
  disease TEXT NOT NULL,
  notes TEXT,
  tags TEXT[] DEFAULT '{}'::text[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_visit TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT
);

-- VISITS TABLE
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  visit_number INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('consultation', 'follow-up', 'blood-report', 'procedure')),
  notes TEXT NOT NULL,
  doctor TEXT NOT NULL,
  complaint TEXT,
  diagnosis TEXT
);

-- MEDICAL FILES TABLE
CREATE TABLE IF NOT EXISTS medical_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('prescription', 'previous_record', 'external_report')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  preview_url TEXT NOT NULL
);

-- OP RECORDS TABLE
CREATE TABLE IF NOT EXISTS op_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  validity_days INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expiring', 'expired'))
);

-- ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('registration', 'visit', 'file_upload', 'op_renewal')),
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_file_number ON patients(file_number);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_files_patient_id ON medical_files(patient_id);
CREATE INDEX IF NOT EXISTS idx_op_records_patient_id ON op_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_patient_id ON activity_logs(patient_id);

-- Insert a default doctor
INSERT INTO doctors (name, phone, specialization, is_active)
VALUES ('Dr. Arjun Mehta', '9876543210', 'Homeopathy', TRUE)
ON CONFLICT DO NOTHING;

-- Insert default users
INSERT INTO users (name, phone, role, is_active) VALUES
('Dr. Arjun Mehta', '9876543210', 'doctor', TRUE),
('Priya Sharma', '9123456789', 'receptionist', TRUE),
('Ramesh Kumar', '9988776655', 'admin', TRUE)
ON CONFLICT DO NOTHING;
