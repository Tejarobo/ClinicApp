import type { Patient, Visit, OPRecord, Appointment, Notification, MedicalFile, ActivityLog, Doctor, User } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase/client";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    file_number: "A-1001",
    name: "Ramesh Kumar",
    age: 56,
    gender: "male",
    phone: "9876543210",
    disease: "Type 2 Diabetes",
    notes: "On Metformin 500mg. Review HbA1c every 3 months.",
    tags: ["Diabetes", "Hypertension"],
    created_at: "2024-01-05T09:00:00Z",
    last_visit: "2025-04-09T10:00:00Z",
  },
  {
    id: "p2",
    file_number: "A-1002",
    name: "Priya Sharma",
    age: 34,
    gender: "female",
    phone: "9123456789",
    disease: "Thyroid",
    notes: "Hypothyroidism. TSH levels to be monitored.",
    tags: ["Thyroid"],
    created_at: "2024-02-10T09:00:00Z",
    last_visit: "2025-03-15T11:00:00Z",
  },
  {
    id: "p3",
    file_number: "A-1003",
    name: "Mohammed Farooq",
    age: 62,
    gender: "male",
    phone: "9988776655",
    disease: "Hypertension, Kidney Disease",
    notes: "CKD Stage 2. Restrict salt intake. Monthly creatinine check.",
    tags: ["Hypertension", "Kidney", "CKD"],
    created_at: "2024-03-01T09:00:00Z",
    last_visit: "2025-05-20T09:30:00Z",
  },
  {
    id: "p4",
    file_number: "A-1004",
    name: "Lakshmi Devi",
    age: 48,
    gender: "female",
    phone: "9654321098",
    disease: "Arthritis",
    notes: "Rheumatoid arthritis. On DMARDs.",
    tags: ["Arthritis"],
    created_at: "2024-04-12T09:00:00Z",
    last_visit: "2025-04-30T14:00:00Z",
  },
  {
    id: "p5",
    file_number: "A-1005",
    name: "Suresh Babu",
    age: 41,
    gender: "male",
    phone: "9765432109",
    disease: "Asthma",
    notes: "Moderate persistent asthma. Salbutamol inhaler PRN.",
    tags: ["Asthma", "Allergy"],
    created_at: "2024-05-20T09:00:00Z",
    last_visit: "2025-05-01T10:00:00Z",
  },
  {
    id: "p6",
    file_number: "A-1006",
    name: "Ananya Krishnan",
    age: 28,
    gender: "female",
    phone: "9543210987",
    disease: "PCOD",
    notes: "PCOD with irregular cycles. On hormonal therapy.",
    tags: ["PCOD", "Hormonal"],
    created_at: "2024-06-08T09:00:00Z",
    last_visit: "2025-05-18T11:00:00Z",
  },
];

export const mockVisits: Visit[] = [
  {
    id: "v1",
    patient_id: "p1",
    visit_number: 1,
    date: "2025-01-05T10:00:00Z",
    type: "consultation",
    notes: "Started Metformin 500mg twice daily. Diet counseling done.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v2",
    patient_id: "p1",
    visit_number: 2,
    date: "2025-02-12T10:00:00Z",
    type: "consultation",
    notes: "HbA1c: 7.8%. Slightly elevated. Continuing medication.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v3",
    patient_id: "p1",
    visit_number: 3,
    date: "2025-03-02T10:00:00Z",
    type: "follow-up",
    notes: "Metformin increased to 1000mg. Patient tolerating well.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v4",
    patient_id: "p1",
    visit_number: 4,
    date: "2025-04-09T10:00:00Z",
    type: "follow-up",
    notes: "HbA1c improved to 7.1%. Good progress.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v5",
    patient_id: "p2",
    visit_number: 1,
    date: "2025-03-15T11:00:00Z",
    type: "consultation",
    notes: "TSH: 8.2 mIU/L. Started Levothyroxine 50mcg.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v6",
    patient_id: "p3",
    visit_number: 1,
    date: "2025-05-20T09:30:00Z",
    type: "follow-up",
    notes: "Creatinine: 1.6 mg/dL. Stable. Continue low-protein diet.",
    doctor: "Dr. Arjun Mehta",
  },
];

export const mockOPRecords: OPRecord[] = [
  {
    id: "op1",
    patient_id: "p1",
    start_date: "2025-04-09",
    validity_days: 30,
    expiry_date: "2025-05-09",
    status: "expired",
  },
  {
    id: "op2",
    patient_id: "p2",
    start_date: "2025-05-20",
    validity_days: 30,
    expiry_date: "2025-06-19",
    status: "expiring",
  },
  {
    id: "op3",
    patient_id: "p3",
    start_date: "2025-05-30",
    validity_days: 30,
    expiry_date: "2025-06-29",
    status: "active",
  },
  {
    id: "op4",
    patient_id: "p4",
    start_date: "2025-06-01",
    validity_days: 30,
    expiry_date: "2025-07-01",
    status: "active",
  },
  {
    id: "op5",
    patient_id: "p5",
    start_date: "2025-06-14",
    validity_days: 7,
    expiry_date: "2025-06-21",
    status: "expiring",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    patient_id: "p1",
    patient_name: "Ramesh Kumar",
    file_number: "A-1001",
    date: "2025-06-17",
    time: "10:00",
    type: "follow-up",
    doctor: "Dr. Arjun Mehta",
    status: "scheduled",
  },
  {
    id: "apt2",
    patient_id: "p2",
    patient_name: "Priya Sharma",
    file_number: "A-1002",
    date: "2025-06-17",
    time: "11:00",
    type: "consultation",
    doctor: "Dr. Arjun Mehta",
    status: "scheduled",
  },
  {
    id: "apt3",
    patient_id: "p3",
    patient_name: "Mohammed Farooq",
    file_number: "A-1003",
    date: "2025-06-17",
    time: "12:00",
    type: "consultation",
    doctor: "Dr. Arjun Mehta",
    status: "scheduled",
  },
  {
    id: "apt4",
    patient_id: "p6",
    patient_name: "Ananya Krishnan",
    file_number: "A-1006",
    date: "2025-06-18",
    time: "09:30",
    type: "follow-up",
    doctor: "Dr. Arjun Mehta",
    status: "scheduled",
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Arjun Mehta",
    phone: "9876543210",
    specialization: "Homeopathy",
    is_active: true,
    created_at: "2024-01-01T09:00:00Z"
  }
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Dr. Arjun Mehta",
    phone: "9876543210",
    role: "doctor",
    is_active: true,
    created_at: "2024-01-01T09:00:00Z"
  },
  {
    id: "u2",
    name: "Priya Sharma",
    phone: "9123456789",
    role: "receptionist",
    is_active: true,
    created_at: "2024-01-02T09:00:00Z"
  },
  {
    id: "u3",
    name: "Ramesh Kumar",
    phone: "9988776655",
    role: "admin",
    is_active: true,
    created_at: "2024-01-03T09:00:00Z"
  }
];

export const defaultNotifications: Notification[] = [
  {
    id: "n1",
    patient_id: "p1",
    patient_name: "Ramesh Kumar",
    patient_phone: "9876543210",
    type: "op_expiry",
    message: "Hello Ramesh Kumar. Your OP validity expired on 2025-05-09. Please contact Dr. Arjun Mehta's Clinic for follow-up. Thank you.",
    status: "sent",
    scheduled_at: "2025-05-08T08:00:00",
    sent_at: "2025-05-08T08:05:00"
  },
  {
    id: "n2",
    patient_id: "p2",
    patient_name: "Priya Sharma",
    patient_phone: "9123456789",
    type: "op_expiry",
    message: "Hello Priya Sharma. Your OP validity expires tomorrow (2025-06-18). Please contact Dr. Arjun Mehta's Clinic for follow-up. Thank you.",
    status: "pending",
    scheduled_at: "2025-06-17T08:00:00"
  }
];

export const defaultMedicalFiles: MedicalFile[] = [
  {
    id: "f1",
    patient_id: "p1",
    name: "Metformin Prescription Jan.pdf",
    type: "prescription",
    uploaded_at: "2025-01-05T10:15:00Z",
    preview_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "f2",
    patient_id: "p1",
    name: "HbA1c Blood Report Feb.png",
    type: "previous_record",
    uploaded_at: "2025-02-12T11:00:00Z",
    preview_url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "f3",
    patient_id: "p1",
    name: "Chest XRay Scan.jpg",
    type: "external_report",
    uploaded_at: "2025-03-02T10:30:00Z",
    preview_url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=60"
  }
];

export const defaultActivityLogs: ActivityLog[] = [
  {
    id: "a1",
    patient_id: "p1",
    type: "registration",
    description: "Patient registered in system by Receptionist Priya Sharma",
    date: "2024-01-05T09:00:00Z"
  },
  {
    id: "a2",
    patient_id: "p1",
    type: "visit",
    description: "Consultation visit #1 with Dr. Arjun Mehta. Complaint: Polyuria and weight loss. Diagnosis: Type 2 Diabetes.",
    date: "2025-01-05T10:00:00Z"
  },
  {
    id: "a3",
    patient_id: "p1",
    type: "file_upload",
    description: "Prescription file Metformin Prescription Jan.pdf uploaded",
    date: "2025-01-05T10:15:00Z"
  },
  {
    id: "a4",
    patient_id: "p1",
    type: "visit",
    description: "Consultation visit #2. HbA1c checked (7.8%).",
    date: "2025-02-12T10:00:00Z"
  },
  {
    id: "a5",
    patient_id: "p1",
    type: "file_upload",
    description: "Previous Record file HbA1c Blood Report Feb.png uploaded",
    date: "2025-02-12T11:00:00Z"
  },
  {
    id: "a6",
    patient_id: "p1",
    type: "visit",
    description: "Consultation visit #3 with Dr. Arjun Mehta. Dosage increased.",
    date: "2025-03-02T10:00:00Z"
  },
  {
    id: "a7",
    patient_id: "p1",
    type: "file_upload",
    description: "External Report file Chest XRay Scan.jpg uploaded",
    date: "2025-03-02T10:30:00Z"
  },
  {
    id: "a9",
    patient_id: "p1",
    type: "op_renewal",
    description: "OP validity extended for 30 days by Admin Ramesh Kumar",
    date: "2025-04-09T10:10:00Z"
  }
];

const isClient = typeof window !== "undefined";

// Synchronous Safe LocalStorage getters/setters
export function getStoredPatients(): Patient[] {
  if (!isClient) return mockPatients;
  const val = localStorage.getItem("cf_patients");
  if (!val) {
    localStorage.setItem("cf_patients", JSON.stringify(mockPatients));
    return mockPatients;
  }
  return JSON.parse(val);
}

export function savePatients(patients: Patient[]) {
  if (isClient) {
    localStorage.setItem("cf_patients", JSON.stringify(patients));
  }
}

export function getStoredVisits(): Visit[] {
  if (!isClient) return mockVisits;
  const val = localStorage.getItem("cf_visits");
  if (!val) {
    localStorage.setItem("cf_visits", JSON.stringify(mockVisits));
    return mockVisits;
  }
  return JSON.parse(val);
}

export function saveVisits(visits: Visit[]) {
  if (isClient) {
    localStorage.setItem("cf_visits", JSON.stringify(visits));
  }
}

export function getStoredOPRecords(): OPRecord[] {
  if (!isClient) return mockOPRecords;
  const val = localStorage.getItem("cf_op_records");
  if (!val) {
    localStorage.setItem("cf_op_records", JSON.stringify(mockOPRecords));
    return mockOPRecords;
  }
  return JSON.parse(val);
}

export function saveOPRecords(records: OPRecord[]) {
  if (isClient) {
    localStorage.setItem("cf_op_records", JSON.stringify(records));
  }
}

export function getStoredAppointments(): Appointment[] {
  if (!isClient) return mockAppointments;
  const val = localStorage.getItem("cf_appointments");
  if (!val) {
    localStorage.setItem("cf_appointments", JSON.stringify(mockAppointments));
    return mockAppointments;
  }
  return JSON.parse(val);
}

export function saveAppointments(appts: Appointment[]) {
  if (isClient) {
    localStorage.setItem("cf_appointments", JSON.stringify(appts));
  }
}

export function getStoredNotifications(): Notification[] {
  if (!isClient) return defaultNotifications;
  const val = localStorage.getItem("cf_notifications");
  if (!val) {
    localStorage.setItem("cf_notifications", JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }
  return JSON.parse(val);
}

export function saveNotifications(notes: Notification[]) {
  if (isClient) {
    localStorage.setItem("cf_notifications", JSON.stringify(notes));
  }
}

export function getStoredMedicalFiles(): MedicalFile[] {
  if (!isClient) return defaultMedicalFiles;
  const val = localStorage.getItem("cf_medical_files");
  if (!val) {
    localStorage.setItem("cf_medical_files", JSON.stringify(defaultMedicalFiles));
    return defaultMedicalFiles;
  }
  return JSON.parse(val);
}

export function saveMedicalFiles(files: MedicalFile[]) {
  if (isClient) {
    localStorage.setItem("cf_medical_files", JSON.stringify(files));
  }
}

export function getStoredActivityLogs(): ActivityLog[] {
  if (!isClient) return defaultActivityLogs;
  const val = localStorage.getItem("cf_activity_logs");
  if (!val) {
    localStorage.setItem("cf_activity_logs", JSON.stringify(defaultActivityLogs));
    return defaultActivityLogs;
  }
  return JSON.parse(val);
}

export function saveActivityLogs(logs: ActivityLog[]) {
  if (isClient) {
    localStorage.setItem("cf_activity_logs", JSON.stringify(logs));
  }
}

export function getStoredDoctors(): Doctor[] {
  if (!isClient) return mockDoctors;
  const val = localStorage.getItem("cf_doctors");
  if (!val) {
    localStorage.setItem("cf_doctors", JSON.stringify(mockDoctors));
    return mockDoctors;
  }
  return JSON.parse(val);
}

export function saveDoctors(doctors: Doctor[]) {
  if (isClient) {
    localStorage.setItem("cf_doctors", JSON.stringify(doctors));
  }
}

export function getStoredUsers(): User[] {
  if (!isClient) return mockUsers;
  const val = localStorage.getItem("cf_users");
  if (!val) {
    localStorage.setItem("cf_users", JSON.stringify(mockUsers));
    return mockUsers;
  }
  return JSON.parse(val);
}

export function saveUsers(users: User[]) {
  if (isClient) {
    localStorage.setItem("cf_users", JSON.stringify(users));
  }
}

// Mutators & Helpers
export function addActivityLog(logData: Omit<ActivityLog, "id">): ActivityLog {
  const logs = getStoredActivityLogs();
  const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const newLog: ActivityLog = { ...logData, id };
  logs.unshift(newLog);
  saveActivityLogs(logs);
  return newLog;
}

export function addPatient(patientData: Omit<Patient, "id" | "created_at"> & { validityDays?: number }): Patient {
  const patients = getStoredPatients();
  const ops = getStoredOPRecords();
  
  const fileNum = patientData.file_number.trim();
  const exists = patients.some(p => p.file_number.toLowerCase() === fileNum.toLowerCase());
  if (exists) {
    throw new Error(`File number "${fileNum}" already exists.`);
  }
  
  const id = `p_${Date.now()}`;
  const newPatient: Patient = {
    ...patientData,
    id,
    file_number: fileNum,
    created_at: new Date().toISOString(),
    tags: patientData.tags || [],
  };
  
  patients.unshift(newPatient);
  savePatients(patients);

  // Auto create OP Record
  const validity = patientData.validityDays || 30;
  const startDate = new Date().toISOString().split("T")[0];
  const exp = new Date();
  exp.setDate(exp.getDate() + validity);
  const expiryDate = exp.toISOString().split("T")[0];

  const newOP: OPRecord = {
    id: `op_${Date.now()}`,
    patient_id: id,
    start_date: startDate,
    validity_days: validity,
    expiry_date: expiryDate,
    status: "active",
  };
  ops.unshift(newOP);
  saveOPRecords(ops);

  // Log activity
  addActivityLog({
    patient_id: id,
    type: "registration",
    description: `Patient registered with Custom File Number: ${fileNum}. OP validity set to ${validity} days.`,
    date: new Date().toISOString()
  });
  
  return newPatient;
}

export function updatePatient(id: string, updates: Partial<Patient> & { validityDays?: number; opStatus?: "active" | "expiring" | "expired" }) {
  const patients = getStoredPatients();
  const idx = patients.findIndex(p => p.id === id);
  if (idx !== -1) {
    patients[idx] = { ...patients[idx], ...updates };
    savePatients(patients);
  }

  if (updates.validityDays !== undefined || updates.opStatus !== undefined) {
    const ops = getStoredOPRecords();
    const opIdx = ops.findIndex(o => o.patient_id === id);
    if (opIdx !== -1) {
      if (updates.validityDays !== undefined) {
        ops[opIdx].validity_days = updates.validityDays;
        const start = new Date();
        start.setDate(start.getDate() + updates.validityDays);
        ops[opIdx].expiry_date = start.toISOString().split("T")[0];
        ops[opIdx].start_date = new Date().toISOString().split("T")[0];
        
        addActivityLog({
          patient_id: id,
          type: "op_renewal",
          description: `OP validity renewed for ${updates.validityDays} days. Status set to active.`,
          date: new Date().toISOString()
        });
      }
      if (updates.opStatus !== undefined) {
        ops[opIdx].status = updates.opStatus;
      }
      saveOPRecords(ops);
    }
  }
}

export function addVisit(visitData: Omit<Visit, "id" | "visit_number">): Visit {
  const visits = getStoredVisits();
  const patientVisits = visits.filter(v => v.patient_id === visitData.patient_id);
  const nextVisitNumber = patientVisits.length + 1;
  const id = `v_${Date.now()}`;
  const newVisit: Visit = { ...visitData, id, visit_number: nextVisitNumber };
  visits.unshift(newVisit);
  saveVisits(visits);

  const patients = getStoredPatients();
  const patientIdx = patients.findIndex(p => p.id === visitData.patient_id);
  if (patientIdx !== -1) {
    patients[patientIdx].last_visit = visitData.date;
    savePatients(patients);
  }

  addActivityLog({
    patient_id: visitData.patient_id,
    type: "visit",
    description: `Consultation visit #${nextVisitNumber} logged with ${visitData.doctor}. Complaint: ${visitData.complaint || "Routine review"}. Diagnosis: ${visitData.diagnosis || "Under evaluation"}.`,
    date: visitData.date
  });

  return newVisit;
}

export function addAppointment(apptData: Omit<Appointment, "id" | "status">): Appointment {
  const appts = getStoredAppointments();
  const id = `apt_${Date.now()}`;
  const newAppt: Appointment = { ...apptData, id, status: "scheduled" };
  appts.unshift(newAppt);
  saveAppointments(appts);
  return newAppt;
}

export function addMedicalFile(fileData: Omit<MedicalFile, "id" | "uploaded_at">): MedicalFile {
  const files = getStoredMedicalFiles();
  const id = `file_${Date.now()}`;
  const newFile: MedicalFile = {
    ...fileData,
    id,
    uploaded_at: new Date().toISOString()
  };
  files.unshift(newFile);
  saveMedicalFiles(files);

  addActivityLog({
    patient_id: fileData.patient_id,
    type: "file_upload",
    description: `${fileData.type.replace(/_/g, " ").toUpperCase()} file uploaded: ${fileData.name}`,
    date: new Date().toISOString()
  });

  return newFile;
}

export function getPatientById(id: string): Patient | undefined {
  return getStoredPatients().find((p) => p.id === id);
}

export function getVisitsByPatientId(patientId: string): Visit[] {
  return getStoredVisits()
    .filter((v) => v.patient_id === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getOPByPatientId(patientId: string): OPRecord | undefined {
  return getStoredOPRecords().find((op) => op.patient_id === patientId);
}

export function searchPatients(query: string): Patient[] {
  const q = query.toLowerCase().trim();
  const patients = getStoredPatients();
  if (!q) return patients;
  
  // Sort priority: File Number matching, then Name matching, then Phone matching
  const byFileNumber = patients.filter(p => p.file_number.toLowerCase().includes(q));
  const byName = patients.filter(p => p.name.toLowerCase().includes(q) && !byFileNumber.some(x => x.id === p.id));
  const byPhone = patients.filter(p => p.phone.includes(q) && !byFileNumber.some(x => x.id === p.id) && !byName.some(x => x.id === p.id));

  return [...byFileNumber, ...byName, ...byPhone];
}

export function getTodayAppointments(): Appointment[] {
  const today = new Date().toISOString().split("T")[0];
  return getStoredAppointments().filter((a) => a.date === today);
}

// Background Simulated Jobs
export function simulateCronJob(): number {
  const ops = getStoredOPRecords();
  const patients = getStoredPatients();
  const notifications = getStoredNotifications();
  let count = 0;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  ops.forEach(op => {
    const isTargetExpiring = op.expiry_date === tomorrowStr;
    const patient = patients.find(p => p.id === op.patient_id);
    
    if (isTargetExpiring && patient && op.status === "expiring") {
      const exists = notifications.some(n => n.patient_id === patient.id && n.type === "op_expiry" && n.status === "pending");
      if (!exists) {
        notifications.unshift({
          id: `n_${Date.now()}_${count}`,
          patient_id: patient.id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          type: "op_expiry",
          message: `Hello ${patient.name}. Your OP validity expires tomorrow (${op.expiry_date}). Please contact Dr. Arjun Mehta's Clinic for follow-up. Thank you.`,
          status: "pending",
          scheduled_at: new Date().toISOString(),
        });
        count++;
      }
    }
  });

  if (count > 0) {
    saveNotifications(notifications);
  }
  return count;
}

export function processNotificationQueue(): number {
  const notifications = getStoredNotifications();
  let count = 0;
  
  notifications.forEach(n => {
    if (n.status === "pending") {
      n.status = "sent";
      n.sent_at = new Date().toISOString();
      count++;
    }
  });

  if (count > 0) {
    saveNotifications(notifications);
  }
  return count;
}

// -------------------------------------------------------------
// ASYNCHRONOUS DATABASE HOOKS (SUPABASE CLIENT INTEGRATIONS)
// -------------------------------------------------------------
export async function getStoredPatientsAsync(): Promise<Patient[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (!error && data) return data as Patient[];
  }
  return getStoredPatients();
}

export async function addPatientAsync(patientData: Omit<Patient, "id" | "created_at"> & { validityDays?: number }): Promise<Patient> {
  const fileNum = patientData.file_number.trim();
  if (isSupabaseConfigured && supabase) {
    const { data: existing } = await supabase.from("patients").select("id").eq("file_number", fileNum).maybeSingle();
    if (existing) {
      throw new Error(`File number "${fileNum}" already exists.`);
    }

    const { data, error } = await supabase.from("patients").insert({
      file_number: fileNum,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      phone: patientData.phone,
      disease: patientData.disease,
      notes: patientData.notes,
      tags: patientData.tags || [],
    }).select().single();

    if (error) throw new Error(error.message);

    const validity = patientData.validityDays || 30;
    const startDate = new Date().toISOString().split("T")[0];
    const exp = new Date();
    exp.setDate(exp.getDate() + validity);
    const expiryDate = exp.toISOString().split("T")[0];

    await supabase.from("op_records").insert({
      patient_id: data.id,
      start_date: startDate,
      validity_days: validity,
      expiry_date: expiryDate,
      status: "active"
    });

    await supabase.from("activity_logs").insert({
      patient_id: data.id,
      type: "registration",
      description: `Patient registered with Custom File Number: ${fileNum}. OP validity set to ${validity} days.`,
    });

    return data as Patient;
  }
  return addPatient(patientData);
}

export async function updatePatientAsync(id: string, updates: Partial<Patient> & { validityDays?: number; opStatus?: "active" | "expiring" | "expired" }) {
  if (isSupabaseConfigured && supabase) {
    const patientFields: Partial<Patient> = {
      name: updates.name,
      age: updates.age,
      gender: updates.gender,
      phone: updates.phone,
      disease: updates.disease,
      notes: updates.notes,
      tags: updates.tags
    };
    // Clean undefined fields
    (Object.keys(patientFields) as Array<keyof Patient>).forEach(key => {
      if (patientFields[key] === undefined) {
        delete patientFields[key];
      }
    });
    
    if (Object.keys(patientFields).length > 0) {
      await supabase.from("patients").update(patientFields).eq("id", id);
    }

    if (updates.validityDays !== undefined || updates.opStatus !== undefined) {
      const { data: op } = await supabase.from("op_records").select("*").eq("patient_id", id).maybeSingle();
      if (op) {
        const opFields: Partial<OPRecord> = {};
        if (updates.validityDays !== undefined) {
          opFields.validity_days = updates.validityDays;
          const start = new Date();
          opFields.start_date = new Date().toISOString().split("T")[0];
          start.setDate(start.getDate() + updates.validityDays);
          opFields.expiry_date = start.toISOString().split("T")[0];

          await supabase.from("activity_logs").insert({
            patient_id: id,
            type: "op_renewal",
            description: `OP validity renewed for ${updates.validityDays} days. Status set to active.`,
          });
        }
        if (updates.opStatus !== undefined) {
          opFields.status = updates.opStatus;
        }
        await supabase.from("op_records").update(opFields).eq("patient_id", id);
      }
    }
    return;
  }
  return updatePatient(id, updates);
}

export async function getVisitsByPatientIdAsync(patientId: string): Promise<Visit[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("visits").select("*").eq("patient_id", patientId).order("date", { ascending: false });
    if (!error && data) return data as Visit[];
  }
  return getVisitsByPatientId(patientId);
}

export async function addVisitAsync(visitData: Omit<Visit, "id" | "visit_number">): Promise<Visit> {
  if (isSupabaseConfigured && supabase) {
    const { data: existingVisits } = await supabase.from("visits").select("id").eq("patient_id", visitData.patient_id);
    const visitNumber = (existingVisits?.length || 0) + 1;

    const { data, error } = await supabase.from("visits").insert({
      patient_id: visitData.patient_id,
      visit_number: visitNumber,
      date: visitData.date,
      type: visitData.type,
      notes: visitData.notes,
      doctor: visitData.doctor,
      complaint: visitData.complaint,
      diagnosis: visitData.diagnosis,
    }).select().single();

    if (error) throw new Error(error.message);

    await supabase.from("patients").update({ last_visit: visitData.date }).eq("id", visitData.patient_id);

    await supabase.from("activity_logs").insert({
      patient_id: visitData.patient_id,
      type: "visit",
      description: `Consultation visit #${visitNumber} logged with ${visitData.doctor}. Complaint: ${visitData.complaint || "Routine review"}. Diagnosis: ${visitData.diagnosis || "Under evaluation"}.`,
    });

    return data as Visit;
  }
  return addVisit(visitData);
}

export async function getMedicalFilesByPatientIdAsync(patientId: string): Promise<MedicalFile[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("medical_files").select("*").eq("patient_id", patientId).order("uploaded_at", { ascending: false });
    if (!error && data) return data as MedicalFile[];
  }
  return getStoredMedicalFiles().filter(f => f.patient_id === patientId);
}

export async function addMedicalFileAsync(fileData: Omit<MedicalFile, "id" | "uploaded_at">): Promise<MedicalFile> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("medical_files").insert({
      patient_id: fileData.patient_id,
      name: fileData.name,
      type: fileData.type,
      preview_url: fileData.preview_url
    }).select().single();

    if (error) throw new Error(error.message);

    await supabase.from("activity_logs").insert({
      patient_id: fileData.patient_id,
      type: "file_upload",
      description: `${fileData.type.replace(/_/g, " ").toUpperCase()} file uploaded: ${fileData.name}`,
    });

    return data as MedicalFile;
  }
  return addMedicalFile(fileData);
}

export async function getActivityLogsByPatientIdAsync(patientId: string): Promise<ActivityLog[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("activity_logs").select("*").eq("patient_id", patientId).order("date", { ascending: false });
    if (!error && data) return data as ActivityLog[];
  }
  const allLogs = getStoredActivityLogs();
  return allLogs.filter(l => l.patient_id === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getDoctorsAsync(): Promise<Doctor[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("doctors").select("*").order("name", { ascending: true });
    if (!error && data) return data as Doctor[];
  }
  return getStoredDoctors();
}
