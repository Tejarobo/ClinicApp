"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Plus,
  X,
  AlertTriangle,
  RotateCw,
  Eye,
  Trash2,
  Stethoscope,
  Activity,
  UserPlus,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import {
  getStoredPatients,
  getStoredVisits,
  getStoredOPRecords,
  getStoredMedicalFiles,
  getStoredActivityLogs,
  addVisit,
  addMedicalFile,
  updatePatient,
  savePatients
} from "@/lib/mock-data";
import type { Patient, Visit, OPRecord, MedicalFile, ActivityLog, VisitType, FileType } from "@/types";

type TabType = "overview" | "visits" | "files" | "timeline";

function loadPatientSnapshot(patientId: string) {
  const allPatients = getStoredPatients();
  const foundPatient = allPatients.find((p) => p.id === patientId) || null;

  const allVisits = getStoredVisits();
  const allOPs = getStoredOPRecords();
  const allFiles = getStoredMedicalFiles();
  const allLogs = getStoredActivityLogs();

  return {
    patient: foundPatient,
    visits: allVisits.filter((visit) => visit.patient_id === patientId),
    opRecord: allOPs.find((record) => record.patient_id === patientId) || null,
    files: allFiles.filter((file) => file.patient_id === patientId),
    logs: allLogs
      .filter((log) => log.patient_id === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
}

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const initialSnapshot = loadPatientSnapshot(patientId);
  const [patient, setPatient] = useState<Patient | null>(initialSnapshot.patient);
  const [visits, setVisits] = useState<Visit[]>(initialSnapshot.visits);
  const [opRecord, setOpRecord] = useState<OPRecord | null>(initialSnapshot.opRecord);
  const [files, setFiles] = useState<MedicalFile[]>(initialSnapshot.files);
  const [logs, setLogs] = useState<ActivityLog[]>(initialSnapshot.logs);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Modals state
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isFileOpen, setIsFileOpen] = useState(false);
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
  const [fileType, setFileType] = useState<FileType>("prescription");
  const [fileTemplateUrl, setFileTemplateUrl] = useState("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60");
  const [fileError, setFileError] = useState("");

  // Form Fields - OP
  const [opDays, setOpDays] = useState(30);

  const loadPatientData = useCallback(() => {
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

    // Files
    const allFiles = getStoredMedicalFiles();
    setFiles(allFiles.filter(f => f.patient_id === patientId));

    // Logs (Timeline)
    const allLogs = getStoredActivityLogs();
    setLogs(allLogs.filter(l => l.patient_id === patientId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [patientId]);

  useEffect(() => {
    const interval = setInterval(loadPatientData, 2000);
    return () => clearInterval(interval);
  }, [loadPatientData]);

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
      router.push("/patients");
    }
  }

  // Timeline Event Config
  const timelineConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
    registration: { label: "Registered", icon: UserPlus, color: "bg-blue-50 text-blue-700 border border-blue-100" },
    visit: { label: "Visit Logged", icon: Stethoscope, color: "bg-emerald-50 text-[#10B981] border border-emerald-100" },
    file_upload: { label: "Document Upload", icon: FileText, color: "bg-purple-50 text-purple-700 border border-purple-100" },
    op_renewal: { label: "OP Renewal", icon: RotateCw, color: "bg-amber-50 text-amber-700 border border-amber-100" },
  };

  // Files categories
  const categorizedFiles = {
    prescriptions: files.filter(f => f.type === "prescription"),
    previous_records: files.filter(f => f.type === "previous_record"),
    external_reports: files.filter(f => f.type === "external_report"),
  };

  const opRenewalLogsCount = logs.filter(l => l.type === "op_renewal").length;

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
                {patient.file_number}
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
            className="flex items-center gap-1 h-9 px-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>+ Visit</span>
          </button>
          
          <button
            onClick={() => setIsFileOpen(true)}
            className="flex items-center gap-1 h-9 px-3.5 rounded-full border border-[#E6EFEA] bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={13} />
            <span>+ Upload File</span>
          </button>

          <button
            onClick={() => setIsRenewOpen(true)}
            className="flex items-center gap-1 h-9 px-3.5 rounded-full border border-emerald-100 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-emerald-800 text-xs font-bold transition-all shadow-sm"
          >
            <RotateCw size={12} />
            <span>Renew OP</span>
          </button>

          <button
            onClick={handleDeletePatient}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-500 hover:text-red-700 transition-all"
            title="Delete Patient Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Notion style Navigation Tabs */}
      <div className="flex border-b border-[#E6EFEA] -mx-6 px-6 pb-px overflow-x-auto gap-2.5">
        {(["overview", "visits", "files", "timeline"] as TabType[]).map((tab) => (
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
            {/* Patient card details */}
            <div className="md:col-span-1 bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Card</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Name</span>
                  <strong className="text-gray-900 font-bold">{patient.name}</strong>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">File Number</span>
                  <strong className="text-gray-700 font-bold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200/50 text-[10px]">{patient.file_number}</strong>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Age / Gender</span>
                  <strong className="text-gray-700 font-bold">{patient.age} yrs / {patient.gender}</strong>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Phone</span>
                  <strong className="text-gray-700 font-bold">+91 {patient.phone}</strong>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Primary Complaint</span>
                  <strong className="text-[#10B981] font-bold text-right max-w-[160px] truncate" title={patient.disease}>{patient.disease}</strong>
                </div>
                {opRecord && (
                  <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                    <span className="text-gray-400 font-medium">OP Expiration</span>
                    <strong className="text-gray-700 font-bold">{opRecord.expiry_date}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              {/* Visits */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Visits</span>
                <div className="mt-3.5">
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{visits.length}</p>
                  <span className="text-[10px] font-bold text-[#10B981] mt-2 block">Consultations</span>
                </div>
              </div>

              {/* Files */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Uploaded Files</span>
                <div className="mt-3.5">
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{files.length}</p>
                  <span className="text-[10px] font-bold text-purple-600 mt-2 block">Records stored</span>
                </div>
              </div>

              {/* OP Renewals */}
              <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">OP Renewals</span>
                <div className="mt-3.5">
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{opRenewalLogsCount}</p>
                  <span className="text-[10px] font-bold text-amber-600 mt-2 block">Extensions logged</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Timeline Section (Last 5 events) */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900">Recent Activity Timeline</h3>
            
            {logs.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium py-4 text-center">No timeline activity registered yet.</p>
            ) : (
              <div className="relative pl-5.5 space-y-6 border-l border-emerald-100 ml-2.5">
                {logs.slice(0, 5).map((log) => {
                  const cfg = timelineConfig[log.type] || { label: "Event", icon: Activity, color: "bg-gray-50 text-gray-600" };
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

      {/* 2. VISITS TAB */}
      {activeTab === "visits" && (
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4.5 border-b border-[#E6EFEA] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Chief Consultations</h2>
              <p className="text-xs text-gray-400 mt-0.5">Visits progression and notes history</p>
            </div>
            <button
              onClick={() => setIsVisitOpen(true)}
              className="flex items-center gap-1 h-9 px-3.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={13} />
              <span>Record Visit</span>
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
                    <th className="px-6 py-3.5 font-bold">Visit #</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-extrabold">
                        Visit #{v.visit_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{v.doctor}</td>
                      <td className="px-6 py-4">{v.complaint || "Routine follow-up"}</td>
                      <td className="px-6 py-4 text-[#10B981] font-semibold">{v.diagnosis || "Under evaluation"}</td>
                      <td className="px-6 py-4 max-w-[280px] break-words">{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. FILES TAB */}
      {activeTab === "files" && (
        <div className="space-y-6 animate-fade-in">
          {/* Upload dropzone block */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6 shadow-sm flex flex-col items-center justify-center text-center border-dashed border-2 border-[#10B981]/30">
            <FileText size={32} className="text-gray-300 mb-2" />
            <span className="block text-xs font-bold text-gray-700 leading-snug">Drag and drop patient files here</span>
            <span className="block text-[11px] text-gray-400 mt-1">prescriptions, past records, or external reports</span>
            <button
              onClick={() => setIsFileOpen(true)}
              className="mt-3.5 h-8.5 px-4 rounded-full bg-[#10B981]/10 hover:bg-[#10B981]/25 text-[#10B981] text-xs font-bold transition-all"
            >
              Browse files
            </button>
          </div>

          {/* Folders */}
          {([
            { key: "prescriptions", label: "Prescriptions Folder", type: "prescription" },
            { key: "previous_records", label: "Previous Records Folder", type: "previous_record" },
            { key: "external_reports", label: "External Reports Folder", type: "external_report" }
          ] as const).map((cat) => {
            const list = categorizedFiles[cat.key];
            return (
              <div key={cat.key} className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{cat.label}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {list.length} item(s)
                  </span>
                </div>

                {list.length === 0 ? (
                  <p className="text-[11px] text-gray-400 font-medium py-3">No files uploaded in this folder.</p>
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
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

      {/* 4. TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Case Audit Timeline</h2>
            <p className="text-xs text-gray-400 mt-0.5">Unified patient clinical timeline</p>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 font-bold">
              No audit logs captured.
            </div>
          ) : (
            <div className="relative pl-6 space-y-8 border-l border-emerald-100 ml-3.5">
              {logs.map((log) => {
                const cfg = timelineConfig[log.type] || { label: "Event", icon: Activity, color: "bg-gray-50 text-gray-600" };
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

      {/* MODAL DIALOGS */}

      {/* Add Visit Dialog Modal */}
      {isVisitOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Record Case Visit</h3>
                <p className="text-xs text-gray-400">Save clinical progression diagnosis</p>
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
                  placeholder="e.g. Rheumatic joint pain, symptoms worsen at night"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis *</label>
                <input
                  type="text"
                  value={vDiagnosis}
                  onChange={(e) => setVDiagnosis(e.target.value)}
                  placeholder="e.g. Chronic Arthritis progression"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Notes &amp; Advice *</label>
                <textarea
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  placeholder="e.g. Prescribed Rhus Tox 200C - 4 drops twice daily for 7 days."
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
                  <span>Save Visit</span>
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
                <h3 className="text-base font-bold text-gray-900">Upload Case File</h3>
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
                  placeholder="e.g. Previous Prescription June 2024"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Folder *</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as FileType)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white"
                  >
                    <option value="prescription">Prescription</option>
                    <option value="previous_record">Previous Record</option>
                    <option value="external_report">External Report</option>
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
                  <span>Upload File</span>
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
                <p className="text-xs text-gray-400">Extend patient outpatient case validity term</p>
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
                  <span>Renew Case</span>
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
