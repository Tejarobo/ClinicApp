export type Gender = "male" | "female" | "other";
export type VisitType = "consultation" | "follow-up" | "blood-report" | "procedure";
export type FileType = "prescription" | "previous_record" | "external_report";
export type OPStatus = "active" | "expiring" | "expired";

export interface Clinic {
  id: string;
  name: string;
  created_at: string;
}

export interface Patient {
  id: string;
  clinic_id?: string;
  file_number: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  disease: string;
  notes: string;
  tags: string[];
  created_at: string;
  last_visit?: string;
  avatar_url?: string;
}

export interface Doctor {
  id: string;
  clinic_id?: string;
  name: string;
  phone: string;
  specialization: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  clinic_id?: string;
  name: string;
  phone: string;
  role: "doctor" | "receptionist" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  visit_number: number;
  date: string;
  type: VisitType;
  notes: string;
  doctor: string;
  complaint?: string;
  diagnosis?: string;
  files?: MedicalFile[];
}

export interface MedicalFile {
  id: string;
  patient_id: string;
  name: string;
  type: FileType;
  uploaded_at: string;
  preview_url: string;
}

export interface OPRecord {
  id: string;
  patient_id: string;
  start_date: string;
  validity_days: number;
  expiry_date: string;
  status: OPStatus;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  file_number: string;
  date: string;
  time: string;
  type: VisitType;
  doctor: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
}

export interface DashboardStats {
  today_patients: number;
  today_appointments: number;
  expiring_ops: number;
}

export interface UserSession {
  phone: string;
  role: "doctor" | "receptionist" | "admin";
  name: string;
}

export interface Notification {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  type: "op_expiry" | "appointment" | "report";
  message: string;
  status: "pending" | "sent" | "failed";
  scheduled_at: string;
  sent_at?: string;
}

export interface ActivityLog {
  id: string;
  patient_id: string;
  type: "registration" | "visit" | "file_upload" | "op_renewal";
  description: string;
  date: string;
}


