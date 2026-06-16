export type Gender = "male" | "female" | "other";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type VisitType = "consultation" | "follow-up" | "blood-report" | "xray" | "scan" | "procedure";
export type FileType = "prescription" | "blood_report" | "xray" | "scan" | "other";
export type PaymentStatus = "paid" | "pending" | "partial";
export type OPStatus = "active" | "expiring" | "expired";

export interface Patient {
  id: string;
  file_no: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  address: string;
  blood_group: BloodGroup;
  disease: string;
  notes: string;
  tags: string[];
  created_at: string;
  last_visit?: string;
  avatar_url?: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  date: string;
  type: VisitType;
  notes: string;
  doctor: string;
  files?: MedicalFile[];
}

export interface MedicalFile {
  id: string;
  patient_id: string;
  visit_id: string;
  image_url: string;
  type: FileType;
  date: string;
  name: string;
}

export interface OPRecord {
  id: string;
  patient_id: string;
  start_date: string;
  validity_days: number;
  expiry_date: string;
  status: OPStatus;
}

export interface Payment {
  id: string;
  patient_id: string;
  visit_id: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  description: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  file_no: string;
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
  monthly_revenue: number;
  pending_payments: number;
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
  type: "op_expiry" | "appointment" | "token" | "report";
  message: string;
  status: "pending" | "sent" | "failed";
  scheduled_at: string;
  sent_at?: string;
}

