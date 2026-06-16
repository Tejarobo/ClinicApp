import type { Patient, Visit, OPRecord, Payment, Appointment, DashboardStats, Notification, MedicalFile, ActivityLog } from "@/types";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    file_no: "A-1001",
    name: "Ramesh Kumar",
    age: 56,
    gender: "male",
    phone: "9876543210",
    address: "12, MG Road, Chennai",
    blood_group: "B+",
    disease: "Type 2 Diabetes",
    notes: "On Metformin 500mg. Review HbA1c every 3 months.",
    tags: ["Diabetes", "Hypertension"],
    created_at: "2024-01-05T09:00:00Z",
    last_visit: "2025-04-09T10:00:00Z",
  },
  {
    id: "p2",
    file_no: "A-1002",
    name: "Priya Sharma",
    age: 34,
    gender: "female",
    phone: "9123456789",
    address: "45, Anna Nagar, Chennai",
    blood_group: "O+",
    disease: "Thyroid",
    notes: "Hypothyroidism. TSH levels to be monitored.",
    tags: ["Thyroid"],
    created_at: "2024-02-10T09:00:00Z",
    last_visit: "2025-03-15T11:00:00Z",
  },
  {
    id: "p3",
    file_no: "A-1003",
    name: "Mohammed Farooq",
    age: 62,
    gender: "male",
    phone: "9988776655",
    address: "78, Triplicane, Chennai",
    blood_group: "A+",
    disease: "Hypertension, Kidney Disease",
    notes: "CKD Stage 2. Restrict salt intake. Monthly creatinine check.",
    tags: ["Hypertension", "Kidney", "CKD"],
    created_at: "2024-03-01T09:00:00Z",
    last_visit: "2025-05-20T09:30:00Z",
  },
  {
    id: "p4",
    file_no: "A-1004",
    name: "Lakshmi Devi",
    age: 48,
    gender: "female",
    phone: "9654321098",
    address: "23, T Nagar, Chennai",
    blood_group: "AB+",
    disease: "Arthritis",
    notes: "Rheumatoid arthritis. On DMARDs.",
    tags: ["Arthritis"],
    created_at: "2024-04-12T09:00:00Z",
    last_visit: "2025-04-30T14:00:00Z",
  },
  {
    id: "p5",
    file_no: "A-1005",
    name: "Suresh Babu",
    age: 41,
    gender: "male",
    phone: "9765432109",
    address: "56, Velachery, Chennai",
    blood_group: "B-",
    disease: "Asthma",
    notes: "Moderate persistent asthma. Salbutamol inhaler PRN.",
    tags: ["Asthma", "Allergy"],
    created_at: "2024-05-20T09:00:00Z",
    last_visit: "2025-05-01T10:00:00Z",
  },
  {
    id: "p6",
    file_no: "A-1006",
    name: "Ananya Krishnan",
    age: 28,
    gender: "female",
    phone: "9543210987",
    address: "88, Adyar, Chennai",
    blood_group: "O-",
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
    date: "2025-01-05T10:00:00Z",
    type: "consultation",
    notes: "Started Metformin 500mg twice daily. Diet counseling done.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v2",
    patient_id: "p1",
    date: "2025-02-12T10:00:00Z",
    type: "blood-report",
    notes: "HbA1c: 7.8%. Slightly elevated. Continuing medication.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v3",
    patient_id: "p1",
    date: "2025-03-02T10:00:00Z",
    type: "follow-up",
    notes: "Metformin increased to 1000mg. Patient tolerating well.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v4",
    patient_id: "p1",
    date: "2025-04-09T10:00:00Z",
    type: "follow-up",
    notes: "HbA1c improved to 7.1%. Good progress.",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: "v5",
    patient_id: "p2",
    date: "2025-03-15T11:00:00Z",
    type: "consultation",
    notes: "TSH: 8.2 mIU/L. Started Levothyroxine 50mcg.",
    doctor: "Dr. Priya Nair",
  },
  {
    id: "v6",
    patient_id: "p3",
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

export const mockPayments: Payment[] = [
  {
    id: "pay1",
    patient_id: "p1",
    visit_id: "v4",
    amount: 500,
    status: "paid",
    date: "2025-04-09",
    description: "Consultation fee",
  },
  {
    id: "pay2",
    patient_id: "p2",
    visit_id: "v5",
    amount: 800,
    status: "paid",
    date: "2025-03-15",
    description: "Consultation + Blood tests",
  },
  {
    id: "pay3",
    patient_id: "p3",
    visit_id: "v6",
    amount: 1200,
    status: "pending",
    date: "2025-05-20",
    description: "Monthly follow-up + Labs",
  },
  {
    id: "pay4",
    patient_id: "p4",
    visit_id: "v1",
    amount: 600,
    status: "pending",
    date: "2025-04-30",
    description: "Consultation fee",
  },
  {
    id: "pay5",
    patient_id: "p5",
    visit_id: "v3",
    amount: 450,
    status: "paid",
    date: "2025-05-01",
    description: "Follow-up",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    patient_id: "p1",
    patient_name: "Ramesh Kumar",
    file_no: "A-1001",
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
    file_no: "A-1002",
    date: "2025-06-17",
    time: "11:00",
    type: "blood-report",
    doctor: "Dr. Priya Nair",
    status: "scheduled",
  },
  {
    id: "apt3",
    patient_id: "p3",
    patient_name: "Mohammed Farooq",
    file_no: "A-1003",
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
    file_no: "A-1006",
    date: "2025-06-18",
    time: "09:30",
    type: "follow-up",
    doctor: "Dr. Priya Nair",
    status: "scheduled",
  },
];

export const mockDashboardStats: DashboardStats = {
  today_patients: 3,
  today_appointments: 3,
  expiring_ops: 2,
  monthly_revenue: 18450,
  pending_payments: 1800,
};

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id);
}

export function getVisitsByPatientId(patientId: string): Visit[] {
  return mockVisits
    .filter((v) => v.patient_id === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getOPByPatientId(patientId: string): OPRecord | undefined {
  return mockOPRecords.find((op) => op.patient_id === patientId);
}

export function getPaymentsByPatientId(patientId: string): Payment[] {
  return mockPayments.filter((p) => p.patient_id === patientId);
}

export function searchPatients(query: string): Patient[] {
  const q = query.toLowerCase().trim();
  if (!q) return mockPatients;
  return mockPatients.filter(
    (p) =>
      p.file_no.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q)
  );
}

export function getTodayAppointments(): Appointment[] {
  const today = new Date().toISOString().split("T")[0];
  return mockAppointments.filter((a) => a.date === today);
}

// Default Notifications
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
    message: "Hello Priya Sharma. Your OP validity expires tomorrow (2025-06-18). Please contact Dr. Priya Nair's Clinic for follow-up. Thank you.",
    status: "pending",
    scheduled_at: "2025-06-17T08:00:00"
  },
  {
    id: "n3",
    patient_id: "p3",
    patient_name: "Mohammed Farooq",
    patient_phone: "9988776655",
    type: "appointment",
    message: "Appointment Reminder: You have an appointment tomorrow at 12:00 PM with Dr. Arjun Mehta. ClinicFlow.",
    status: "sent",
    scheduled_at: "2025-06-16T18:00:00",
    sent_at: "2025-06-16T18:02:00"
  }
];

// Default Medical Files
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
    type: "report",
    uploaded_at: "2025-02-12T11:00:00Z",
    preview_url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "f3",
    patient_id: "p1",
    name: "Chest XRay Scan.jpg",
    type: "xray",
    uploaded_at: "2025-03-02T10:30:00Z",
    preview_url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=60"
  }
];

// Default Activity Logs (Timeline Events)
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
    description: "Consultation visit with Dr. Arjun Mehta. Complaint: Polyuria and weight loss. Diagnosis: Type 2 Diabetes.",
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
    description: "Blood report analysis. HbA1c checked (7.8%).",
    date: "2025-02-12T10:00:00Z"
  },
  {
    id: "a5",
    patient_id: "p1",
    type: "file_upload",
    description: "Report file HbA1c Blood Report Feb.png uploaded",
    date: "2025-02-12T11:00:00Z"
  },
  {
    id: "a6",
    patient_id: "p1",
    type: "visit",
    description: "Follow-up visit with Dr. Arjun Mehta. Dosage increased.",
    date: "2025-03-02T10:00:00Z"
  },
  {
    id: "a7",
    patient_id: "p1",
    type: "file_upload",
    description: "X-ray file Chest XRay Scan.jpg uploaded",
    date: "2025-03-02T10:30:00Z"
  },
  {
    id: "a8",
    patient_id: "p1",
    type: "payment",
    description: "Consultation fee payment of ₹500 received via UPI",
    date: "2025-04-09T10:05:00Z"
  },
  {
    id: "a9",
    patient_id: "p1",
    type: "op_renewal",
    description: "OP validity extended for 30 days by Admin Ramesh Kumar",
    date: "2025-04-09T10:10:00Z"
  }
];

// Helper to check if window is defined
const isClient = typeof window !== "undefined";

// Safe LocalStorage helpers
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

export function getStoredPayments(): Payment[] {
  if (!isClient) return mockPayments;
  const val = localStorage.getItem("cf_payments");
  if (!val) {
    localStorage.setItem("cf_payments", JSON.stringify(mockPayments));
    return mockPayments;
  }
  return JSON.parse(val);
}

export function savePayments(payments: Payment[]) {
  if (isClient) {
    localStorage.setItem("cf_payments", JSON.stringify(payments));
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

// CRUD actions
export function addActivityLog(logData: Omit<ActivityLog, "id">): ActivityLog {
  const logs = getStoredActivityLogs();
  const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const newLog: ActivityLog = { ...logData, id };
  logs.unshift(newLog);
  saveActivityLogs(logs);
  return newLog;
}

export function addPatient(patientData: Omit<Patient, "id" | "created_at" | "file_no"> & { validityDays?: number }): Patient {
  const patients = getStoredPatients();
  const ops = getStoredOPRecords();
  
  const lastFileNo = patients.reduce((max, p) => {
    const num = parseInt(p.file_no.split("-")[1] || "1000");
    return num > max ? num : max;
  }, 1000);
  
  const fileNo = `A-${lastFileNo + 1}`;
  const id = `p_${Date.now()}`;
  
  const newPatient: Patient = {
    ...patientData,
    id,
    file_no: fileNo,
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
    description: `Patient registered by Receptionist. Default OP validity set to ${validity} days.`,
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

  // Handle OP Record updates if provided
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
        
        // Log OP renewal activity
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

export function addVisit(visitData: Omit<Visit, "id">): Visit {
  const visits = getStoredVisits();
  const id = `v_${Date.now()}`;
  const newVisit: Visit = { ...visitData, id };
  visits.unshift(newVisit);
  saveVisits(visits);

  // Also update patient last_visit
  const patients = getStoredPatients();
  const patientIdx = patients.findIndex(p => p.id === visitData.patient_id);
  if (patientIdx !== -1) {
    patients[patientIdx].last_visit = visitData.date;
    savePatients(patients);
  }

  // Auto create payment records (mock)
  const payments = getStoredPayments();
  const amount = visitData.type === "consultation" ? 500 : 300;
  const newPay: Payment = {
    id: `pay_${Date.now()}`,
    patient_id: visitData.patient_id,
    visit_id: id,
    amount,
    status: "paid",
    date: visitData.date.split("T")[0],
    description: `${visitData.type.toUpperCase()} Fee`,
    payment_mode: "upi"
  };
  payments.unshift(newPay);
  savePayments(payments);

  // Log activities
  addActivityLog({
    patient_id: visitData.patient_id,
    type: "visit",
    description: `Consultation visit logged with ${visitData.doctor}. Complaint: ${visitData.complaint || "Routine review"}. Diagnosis: ${visitData.diagnosis || "Under evaluation"}.`,
    date: visitData.date
  });

  addActivityLog({
    patient_id: visitData.patient_id,
    type: "payment",
    description: `Consultation fee of ₹${amount} received via UPI`,
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

  // Log activity
  addActivityLog({
    patient_id: apptData.patient_id,
    type: "appointment",
    description: `Appointment scheduled for ${apptData.date} at ${apptData.time} with ${apptData.doctor}`,
    date: new Date().toISOString()
  });

  return newAppt;
}

export function addPayment(payData: Omit<Payment, "id" | "status"> & { status: "paid" | "pending" }): Payment {
  const payments = getStoredPayments();
  const id = `pay_${Date.now()}`;
  const newPay: Payment = { ...payData, id };
  payments.unshift(newPay);
  savePayments(payments);

  // Log activity
  addActivityLog({
    patient_id: payData.patient_id,
    type: "payment",
    description: `Fee of ₹${payData.amount} registered as ${payData.status} via ${payData.payment_mode || "cash"}.`,
    date: new Date().toISOString()
  });

  return newPay;
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

  // Log activity
  addActivityLog({
    patient_id: fileData.patient_id,
    type: "file_upload",
    description: `${fileData.type.toUpperCase()} file uploaded: ${fileData.name}`,
    date: new Date().toISOString()
  });

  return newFile;
}

// Background Cron Jobs Simulation
export function simulateCronJob(): number {
  const ops = getStoredOPRecords();
  const patients = getStoredPatients();
  const notifications = getStoredNotifications();
  let count = 0;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  ops.forEach(op => {
    const isTargetExpiring = op.expiry_date === "2025-06-18" || op.expiry_date === "2025-06-21" || op.expiry_date === tomorrowStr;
    const patient = patients.find(p => p.id === op.patient_id);
    
    if (isTargetExpiring && patient && op.status === "expiring") {
      const exists = notifications.some(n => n.patient_id === patient.id && n.type === "op_expiry" && n.status === "pending");
      if (!exists) {
        const message = `Hello ${patient.name}. Your OP validity expires tomorrow (${op.expiry_date}). Please contact Dr. Arjun Mehta's Clinic for follow-up. Thank you.`;
        notifications.unshift({
          id: `n_${Date.now()}_${count}`,
          patient_id: patient.id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          type: "op_expiry",
          message,
          status: "pending",
          scheduled_at: new Date().toISOString(),
        });

        // Log notification activity
        addActivityLog({
          patient_id: patient.id,
          type: "notification",
          description: `WhatsApp OP expiry reminder queued for delivery.`,
          date: new Date().toISOString()
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

      // Log notification activity
      addActivityLog({
        patient_id: n.patient_id,
        type: "notification",
        description: `WhatsApp reminder successfully sent to +91 ${n.patient_phone}`,
        date: new Date().toISOString()
      });

      count++;
    }
  });

  if (count > 0) {
    saveNotifications(notifications);
  }
  return count;
}

