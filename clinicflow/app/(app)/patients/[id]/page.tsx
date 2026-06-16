"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  FileText,
  User,
  Phone,
  Heart,
  Plus,
  X,
  AlertTriangle,
  RotateCw,
  Eye,
  Trash2,
  DollarSign,
  TrendingUp,
  Tag,
  Stethoscope,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import {
  getStoredPatients,
  getStoredVisits,
  getStoredOPRecords,
  getStoredPayments,
  getStoredMedicalFiles,
  getStoredActivityLogs,
  addVisit,
  addPayment,
  addMedicalFile,
  updatePatient,
  addActivityLog,
  savePatients
} from "@/lib/mock-data";
import type { Patient, Visit, OPRecord, Payment, MedicalFile, ActivityLog, VisitType } from "@/types";

type TabType = "overview" | "timeline" | "visits" | "files" | "payments" | "settings";

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [opRecord, setOpRecord] = useState<OPRecord | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Modals state
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<MedicalFile | null>(null);

  // Form Fields - Visit
  const [vType, setVType] = useState<VisitType>("consultation");
  const [vDoctor, setVDoctor] = useState("Dr. Arjun Mehta");
  const [vComplaint, setVComplaint] = useState("");
  const [vDiagnosis, setVDiagnosis] = useState("");
  const [vNotes, setVNotes] = useState("");
  const [vError, setVError] = useState("");

  // Form Fields - File
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"prescription" | "report" | "scan" | "xray">("prescription");
  const [fileTemplateUrl, setFileTemplateUrl] = useState("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60");
  const [fileError, setFileError] = useState("");

  // Form Fields - Payment
  const [pAmount, setPAmount] = useState("");
  const [pStatus, setPStatus] = useState<"paid" | "pending">("paid");
  const [pMode, setPMode] = useState<"upi" | "cash" | "card">("upi");
  const [pDesc, setPDesc] = useState("Consultation Charge");
  const [pError, setPError] = useState("");

  // Form Fields - OP
  const [opDays, setOpDays] = useState(30);

  function loadPatientData() {
    const allPatients = getStoredPatients();
    const foundPatient = allPatients.find((p) => p.id === patientId);
    if (!foundPatient) {
      setPatient(null);
      return;
    }
    setPatient(foundPatient);

    // Filter Visits
    const allVisits = getStoredVisits();
    setVisits(allVisits.filter(v => v.patient_id === patientId));

    // OP Record
    const allOPs = getStoredOPRecords();
    setOpRecord(allOPs.find(o => o.patient_id === patientId) || null);

    // Payments
    const allPayments = getStoredPayments();
    setPayments(allPayments.filter(p => p.patient_id === patientId));

    // Files
    const allFiles = getStoredMedicalFiles();
    setFiles(allFiles.filter(f => f.patient_id === patientId));

    // Logs (Timeline)
    const allLogs = getStoredActivityLogs();
    setLogs(allLogs.filter(l => l.patient_id === patientId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  useEffect(() => {
    loadPatientData();
    const interval = setInterval(loadPatientData, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  if (!patient) {
    return (
      <div className="py-16 text-center font-sans">
        <AlertTriangle size={40} className="mx-auto text-amber-500 mb-3" />
        <h2 className="text-base font-bold text-gray-900">Patient File Not Found</h2>
        <p className="text-xs text-gray-400 mt-1">The requested patient record could not be loaded.</p>
        <Link href="/patients" className="inline-flex items-center gap-1.5 mt-5 text-sm text-[#10B981] font-bold hover:underline">
          <ArrowLeft size={14} /> Back to Directory
        </Link>
      </div>
    );
  }

  // OP status calculations
  let daysLeft = 0;
  let opStatusText = "No Record";
  let opStatusColor = "bg-gray-100 text-gray-600";
  
  if (opRecord) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(opRecord.expiry_date);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      opStatusText = `Expired`;
      opStatusColor = "badge-mint-expired";
    } else if (daysLeft <= 3) {
      opStatusText = "Expiring";
      opStatusColor = "badge-mint-expiring";
    } else {
      opStatusText = "Active";
      opStatusColor = "badge-mint-active";
    }
  }

  // Quick Action Submissions
  function handleAddVisitSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vComplaint.trim() || !vDiagnosis.trim() || !vNotes.trim()) {
      setVError("Please fill out all clinical fields");
      return;
    }
    setVError("");

    addVisit({
      patient_id: patientId,
      date: new Date().toISOString(),
      type: vType,
      notes: vNotes.trim(),
      doctor: vDoctor.trim(),
      complaint: vComplaint.trim(),
      diagnosis: vDiagnosis.trim()
    });

    setIsVisitOpen(false);
    setVComplaint("");
    setVDiagnosis("");
    setVNotes("");
    loadPatientData();
  }

  function handleUploadFileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName.trim()) {
      setFileError("File name is required");
      return;
    }
    setFileError("");

    addMedicalFile({
      patient_id: patientId,
      name: fileName.trim() + (fileName.includes(".") ? "" : ".pdf"),
      type: fileType,
      preview_url: fileTemplateUrl
    });

    setIsFileOpen(false);
    setFileName("");
    loadPatientData();
  }

  function handleAddPaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(pAmount);
    if (isNaN(amt) || amt <= 0) {
      setPError("Enter a valid amount");
      return;
    }
    setPError("");

    addPayment({
      patient_id: patientId,
      visit_id: visits[0]?.id || `v_manual_${Date.now()}`,
      amount: amt,
      status: pStatus,
      payment_mode: pMode,
      date: new Date().toISOString().split("T")[0],
      description: pDesc.trim()
    });

    setIsPaymentOpen(false);
    setPAmount("");
    setPDesc("Consultation Charge");
    loadPatientData();
  }

  function handleRenewOP(e: React.FormEvent) {
    e.preventDefault();
    updatePatient(patientId, {
      validityDays: opDays,
      opStatus: "active"
    });
    setIsRenewOpen(false);
    loadPatientData();
  }

  function handleDeletePatient() {
    if (confirm("Confirm permanent deletion of this patient medical record? This action is irreversible.")) {
      const all = getStoredPatients();
      const filtered = all.filter(p => p.id !== patientId);
      savePatients(filtered);
      addActivityLog({
        patient_id: patientId,
        type: "registration",
        description: `Patient file ${patient.file_no} permanently deleted from directories.`,
        date: new Date().toISOString()
      });
      router.push("/patients");
    }
  }

  // Stats Card Calculations
  const totalPaidSum = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalDuesSum = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  // Timeline Event Config
  const timelineConfig: Record<string, { label: string; icon: any; color: string }> = {
    registration: { label: "Registered", icon: User, color: "bg-blue-50 text-blue-700 border border-blue-100" },
    visit: { label: "Consultation visit", icon: Stethoscope, color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
    file_upload: { label: "File uploaded", icon: FileText, color: "bg-purple-50 text-purple-700 border border-purple-100" },
    op_renewal: { label: "OP Renewal log", icon: RotateCw, color: "bg-amber-50 text-amber-700 border border-amber-100" },
    payment: { label: "Payment ledger", icon: DollarSign, color: "bg-teal-50 text-teal-700 border border-teal-100" },
    appointment: { label: "Appointment scheduled", icon: Clock, color: "bg-indigo-50 text-indigo-700 border border-indigo-100" },
    notification: { label: "Alert dispatched", icon: Activity, color: "bg-rose-50 text-rose-700 border border-rose-100" }
  };

  // Files categories
  const categorizedFiles = {
    prescriptions: files.filter(f => f.type === "prescription"),
    reports: files.filter(f => f.type === "report"),
    scans: files.filter(f => f.type === "scan"),
    xrays: files.filter(f => f.type === "xray"),
  };

  const initials = patient.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-6 pb-20 font-sans relative">
      {/* Sticky patient header with actions */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-[#E6EFEA] py-4 px-6 -mx-8 -mt-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-base font-bold shadow-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-gray-900 leading-snug truncate">{patient.name}</h1>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded leading-none shrink-0">
                {patient.file_no}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {patient.age} yrs · {patient.gender} · {patient.disease} · <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 rounded-full ${opStatusColor}`}>{opStatusText}</span>
            </p>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => setIsVisitOpen(true)}
            className="flex items-center gap-1 h-9 px-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>+ Visit</span>
          </button>
          
          <button
            onClick={() => setIsFileOpen(true)}
            className="flex items-center gap-1 h-9 px-3 rounded-full border border-[#E6EFEA] bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>+ Upload</span>
          </button>

          <button
            onClick={() => setIsPaymentOpen(true)}
            className="flex items-center gap-1 h-9 px-3 rounded-full border border-emerald-100 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-emerald-800 text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>+ Payment</span>
          </button>

          <button
            onClick={() => setIsRenewOpen(true)}
            className="flex items-center gap-1 h-9 px-3 rounded-full border border-[#E6EFEA] bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all"
          >
            <RotateCw size={12} />
            <span>Renew OP</span>
          </button>
        </div>
      </div>

      {/* Notion style Navigation Tabs */}
      <div className="flex border-b border-[#E6EFEA] -mx-6 px-6 pb-px overflow-x-auto gap-2.5">
        {(["overview", "timeline", "visits", "files", "payments", "settings"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-9 px-4.5 text-xs font-bold border-b-2 capitalize transition-all select-none whitespace-nowrap ${
              activeTab === tab
                ? "border-[#10B981] text-[#10B981]"
                : "border-transparent text-gray-400 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Panel Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Summary details card */}
            <div className="md:col-span-1 bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinical Metadata</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Phone Number</span>
                  <strong className="text-gray-700 font-semibold">+91 {patient.phone}</strong>
                </div>
                <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Age / Gender</span>
                  <strong className="text-gray-700 font-semibold">{patient.age}y / {patient.gender}</strong>
                </div>
                <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Blood Group</span>
                  <strong className="text-gray-700 font-semibold">{patient.blood_group}</strong>
                </div>
                <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Diagnosis</span>
                  <strong className="text-[#10B981] font-bold">{patient.disease}</strong>
                </div>
                {opRecord && (
                  <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                    <span className="text-gray-400">OP Expiration</span>
                    <strong className="text-gray-700 font-semibold">{opRecord.expiry_date}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {/* Visits */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5.5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Consultation Visits</span>
                <div className="mt-3.5 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{visits.length}</p>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Visits logged</span>
                </div>
              </div>

              {/* Files */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5.5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Medical Files</span>
                <div className="mt-3.5 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{files.length}</p>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Files registered</span>
                </div>
              </div>

              {/* Payments Paid */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5.5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Fees Paid</span>
                <div className="mt-3.5 flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">₹{totalPaidSum.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-[#E8F5E9] px-2 py-0.5 rounded-full">Collected</span>
                </div>
              </div>

              {/* Dues Pending */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5.5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dues Pending</span>
                <div className="mt-3.5 flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">₹{totalDuesSum.toLocaleString("en-IN")}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${totalDuesSum > 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-gray-100 text-gray-400"}`}>
                    {totalDuesSum > 0 ? "Owed" : "Cleared"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Timeline Section (Last 5 events) */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900">Recent Profile Activity</h3>
            
            {logs.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium py-4 text-center">No timeline activity registered yet.</p>
            ) : (
              <div className="relative pl-5.5 space-y-6 border-l border-emerald-100 ml-2.5">
                {logs.slice(0, 5).map((log) => {
                  const cfg = timelineConfig[log.type] || { label: "Event", icon: Activity, color: "bg-gray-50 text-gray-600" };
                  const Icon = cfg.icon;
                  return (
                    <div key={log.id} className="relative group flex items-start gap-4">
                      {/* marker dot */}
                      <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full bg-white border-4 border-[#10B981] flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-700 mt-1.5">{log.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TIMELINE TAB (Unified Full feed) */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Clinical Audit Feed</h2>
            <p className="text-xs text-gray-400 mt-0.5">Comprehensive profile activity timeline</p>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 font-bold">
              No audit logs captured.
            </div>
          ) : (
            <div className="relative pl-6 space-y-8 border-l border-emerald-100 ml-3.5">
              {logs.map((log) => {
                const cfg = timelineConfig[log.type] || { label: "Event", icon: Activity, color: "bg-gray-50 text-gray-600" };
                const Icon = cfg.icon;
                return (
                  <div key={log.id} className="relative group flex items-start gap-4">
                    {/* marker dot */}
                    <div className="absolute -left-[32px] top-1 w-4 h-4 rounded-full bg-white border-4 border-[#10B981] flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      
                      <div className="bg-[#F8FAF9]/80 border border-[#E6EFEA]/60 p-3.5 rounded-2xl">
                        <p className="text-xs font-semibold text-gray-700">{log.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. VISITS TAB (Detailed Table) */}
      {activeTab === "visits" && (
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4.5 border-b border-[#E6EFEA] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Physician Consultations</h2>
              <p className="text-xs text-gray-400 mt-0.5">Visits history ledger</p>
            </div>
            <button
              onClick={() => setIsVisitOpen(true)}
              className="flex items-center gap-1 h-9 px-3.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={13} />
              <span>Record Consultation</span>
            </button>
          </div>

          {visits.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <AlertTriangle size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-bold">No consultations registered</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-[#E6EFEA] text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    <th className="px-6 py-3.5 font-bold">Date</th>
                    <th className="px-6 py-3.5 font-bold">Doctor</th>
                    <th className="px-6 py-3.5 font-bold">Chief Complaint</th>
                    <th className="px-6 py-3.5 font-bold">Diagnosis</th>
                    <th className="px-6 py-3.5 font-bold">Prescription &amp; Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EFEA] text-xs text-gray-600 font-medium">
                  {visits.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/20">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{v.doctor}</td>
                      <td className="px-6 py-4">{v.complaint || "Routine follow-up"}</td>
                      <td className="px-6 py-4 text-emerald-800 font-semibold">{v.diagnosis || "Under evaluation"}</td>
                      <td className="px-6 py-4 max-w-[280px] break-words">{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. FILES TAB (Categorized Grid) */}
      {activeTab === "files" && (
        <div className="space-y-6 animate-fade-in">
          {/* Upload Dropzone Header */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6 shadow-sm flex flex-col items-center justify-center text-center border-dashed border-2 border-[#10B981]/30">
            <FileText size={32} className="text-gray-300 mb-2" />
            <span className="block text-xs font-bold text-gray-700 leading-snug">Drop patient files here</span>
            <span className="block text-[11px] text-gray-400 mt-1">prescriptions, scans, ECGs, blood reports</span>
            <button
              onClick={() => setIsFileOpen(true)}
              className="mt-3.5 h-8.5 px-4 rounded-full bg-[#10B981]/10 hover:bg-[#10B981]/25 text-[#10B981] text-xs font-bold transition-all"
            >
              Browse files
            </button>
          </div>

          {/* Folder Categories */}
          {(["prescriptions", "reports", "scans", "xrays"] as const).map((cat) => {
            const list = categorizedFiles[cat];
            return (
              <div key={cat} className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider capitalize">{cat}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {list.length} item(s)
                  </span>
                </div>

                {list.length === 0 ? (
                  <p className="text-[11px] text-gray-400 font-medium py-3">No documents uploaded under this category.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {list.map((file) => (
                      <div
                        key={file.id}
                        className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-[#10B981] transition-all bg-gray-50/50 flex flex-col justify-between"
                      >
                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file.preview_url}
                            alt={file.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="w-7 h-7 rounded-lg bg-white/90 shadow flex items-center justify-center text-gray-700 hover:text-[#10B981] transition-colors"
                              title="Preview document file"
                            >
                              <Eye size={13} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-3 text-[10px]">
                          <p className="font-bold text-gray-800 truncate leading-snug" title={file.name}>
                            {file.name}
                          </p>
                          <span className="block text-gray-400 mt-1 font-semibold">
                            {new Date(file.uploaded_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. PAYMENTS TAB (UPI/Cash/Card Ledger) */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4.5 border-b border-[#E6EFEA] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Billing History</h2>
              <p className="text-xs text-gray-400 mt-0.5">Consultation dues ledger log</p>
            </div>
            
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={13} />
              <span>Record Fee Receipt</span>
            </button>
          </div>

          <div className="grid grid-cols-2 border-b border-[#E6EFEA] bg-gray-50/30 text-center py-4 divide-x divide-gray-100">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Fees Collected</span>
              <span className="text-lg font-bold text-emerald-600 mt-1 block">₹{totalPaidSum}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dues Pending</span>
              <span className="text-lg font-bold text-rose-600 mt-1 block">₹{totalDuesSum}</span>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs text-gray-400">
              No payments captured.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-[#E6EFEA] text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    <th className="px-6 py-3 font-bold">Date</th>
                    <th className="px-6 py-3 font-bold">Description</th>
                    <th className="px-6 py-3 font-bold">Payment Mode</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EFEA] text-xs text-gray-600 font-medium">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/20">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {p.date}
                      </td>
                      <td className="px-6 py-4">{p.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap uppercase text-gray-500 font-semibold">{p.payment_mode || "UPI"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${p.status === "paid" ? "badge-mint-active" : "badge-mint-expired"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">₹{p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-6 animate-fade-in max-w-xl">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Configure File</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage patient administrative configurations</p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Renew OP */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-gray-900">Renew Medical File Term</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">Extend outpatient validity date count</span>
              </div>
              <button
                onClick={() => setIsRenewOpen(true)}
                className="h-9 px-4.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                Renew Validity
              </button>
            </div>

            {/* Delete Patient */}
            <div className="p-4 bg-red-50/30 border border-red-50 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-red-800">Archive &amp; Delete File</span>
                <span className="block text-[10px] text-red-500/70 mt-0.5">Permanently remove this medical registry record</span>
              </div>
              <button
                onClick={handleDeletePatient}
                className="h-9 px-4.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOGS */}

      {/* Add Visit Dialog Modal */}
      {isVisitOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Record Consultation Visit</h3>
                <p className="text-xs text-gray-400">Save clinical diagnosis details</p>
              </div>
              <button
                onClick={() => setIsVisitOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddVisitSubmit} className="space-y-4">
              {vError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">{vError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Visit Type *</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as VisitType)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-Up</option>
                    <option value="blood-report">Blood Test</option>
                    <option value="xray">X-Ray Scan</option>
                    <option value="scan">CT/MRI Scan</option>
                    <option value="procedure">Procedure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor Name *</label>
                  <input
                    type="text"
                    value={vDoctor}
                    onChange={(e) => setVDoctor(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Chief Complaint *</label>
                <input
                  type="text"
                  value={vComplaint}
                  onChange={(e) => setVComplaint(e.target.value)}
                  placeholder="e.g. Chronic cough for 3 weeks"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis *</label>
                <input
                  type="text"
                  value={vDiagnosis}
                  onChange={(e) => setVDiagnosis(e.target.value)}
                  placeholder="e.g. Bronchial Asthma"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Notes &amp; Prescription *</label>
                <textarea
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  placeholder="Prescription dose advice..."
                  rows={3}
                  className="w-full p-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVisitOpen(false)}
                  className="flex-1 h-11 rounded-full border border-gray-200 text-gray-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-50"
                >
                  <Plus size={14} />
                  <span>Add Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Dialog Modal */}
      {isFileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Upload Document Metadata</h3>
                <p className="text-xs text-gray-400">Pointers to clinical documents</p>
              </div>
              <button
                onClick={() => setIsFileOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleUploadFileSubmit} className="space-y-4">
              {fileError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">{fileError}</div>}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">File Name *</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Blood Test Page 1"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  >
                    <option value="prescription">Prescription</option>
                    <option value="report">Blood Report</option>
                    <option value="scan">ECG / MRI Scan</option>
                    <option value="xray">X-Ray Plate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preview template *</label>
                  <select
                    value={fileTemplateUrl}
                    onChange={(e) => setFileTemplateUrl(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  >
                    <option value="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60">Prescription Sheet</option>
                    <option value="https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=60">Laboratory Report</option>
                    <option value="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=60">Radiology X-Ray</option>
                    <option value="https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=60">ECG Scans</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFileOpen(false)}
                  className="flex-1 h-11 rounded-full border border-gray-200 text-gray-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-50"
                >
                  <Plus size={14} />
                  <span>Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Dialog Modal */}
      {isPaymentOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Record Fee Payment</h3>
                <p className="text-xs text-gray-400">Save billing transaction receipt</p>
              </div>
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
              {pError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">{pError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount (₹) *</label>
                  <input
                    type="number"
                    value={pAmount}
                    onChange={(e) => setPAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Receipt Status *</label>
                  <select
                    value={pStatus}
                    onChange={(e) => setPStatus(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Mode *</label>
                  <select
                    value={pMode}
                    onChange={(e) => setPMode(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  >
                    <option value="upi">UPI (GPay/PhonePe)</option>
                    <option value="cash">Cash In Hand</option>
                    <option value="card">Card Swipe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description *</label>
                  <input
                    type="text"
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="flex-1 h-11 rounded-full border border-gray-200 text-gray-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-50"
                >
                  <Plus size={14} />
                  <span>Add Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renew OP Dialog Modal */}
      {isRenewOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Renew OP Validity</h3>
                <p className="text-xs text-gray-400">Extend outpatient validity term</p>
              </div>
              <button
                onClick={() => setIsRenewOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleRenewOP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Renewal Term Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setOpDays(days)}
                      className={`h-10 rounded-xl border text-xs font-bold transition-all ${opDays === days ? "border-[#10B981] bg-emerald-50/60 text-[#10B981]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRenewOpen(false)}
                  className="flex-1 h-11 rounded-full border border-gray-200 text-gray-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                >
                  <RotateCw size={13} />
                  <span>Renew File</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Preview Dialog */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[640px] bg-white rounded-3xl border border-[#E6EFEA] p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-gray-900">{previewFile.name}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Uploaded at {new Date(previewFile.uploaded_at).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400"
              >
                <X size={13} />
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[4/3] relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewFile.preview_url}
                alt={previewFile.name}
                className="object-contain w-full h-full max-h-[420px]"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="h-10 px-6 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-all shadow"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
