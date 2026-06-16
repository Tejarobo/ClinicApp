"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  FileText,
  User,
  Phone,
  MapPin,
  Heart,
  Plus,
  X,
  AlertTriangle,
  RotateCw
} from "lucide-react";
import Link from "next/link";
import {
  getStoredPatients,
  getStoredVisits,
  getStoredOPRecords,
  addVisit,
  updatePatient
} from "@/lib/mock-data";
import type { Patient, Visit, OPRecord, VisitType } from "@/types";

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [opRecord, setOpRecord] = useState<OPRecord | null>(null);

  // Dialog State
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);

  // Add Visit Fields
  const [visitType, setVisitType] = useState<VisitType>("consultation");
  const [visitNotes, setVisitNotes] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Arjun Mehta");
  const [visitError, setVisitError] = useState("");

  // Renew Fields
  const [renewDays, setRenewDays] = useState(30);

  function loadPatientData() {
    const allPatients = getStoredPatients();
    const foundPatient = allPatients.find((p) => p.id === patientId);
    if (!foundPatient) {
      setPatient(null);
      return;
    }

    setPatient(foundPatient);

    // Filter visits
    const allVisits = getStoredVisits();
    const filteredVisits = allVisits
      .filter((v) => v.patient_id === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setVisits(filteredVisits);

    // OP Record
    const allOPs = getStoredOPRecords();
    const foundOP = allOPs.find((o) => o.patient_id === patientId);
    setOpRecord(foundOP || null);

  }

  useEffect(() => {
    loadPatientData();
    // Poll data occasionally for reactive sync
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

  // Calculate OP Expiry Days remaining dynamically
  let daysLeft = 0;
  let opStatusText = "Unknown";
  let opStatusColor = "bg-gray-100 text-gray-600";
  
  if (opRecord) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(opRecord.expiry_date);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      opStatusText = `Expired ${Math.abs(daysLeft)} days ago`;
      opStatusColor = "badge-mint-expired";
    } else if (daysLeft === 0) {
      opStatusText = "Expires Today";
      opStatusColor = "badge-mint-expiring bg-amber-500 text-white";
    } else if (daysLeft === 1) {
      opStatusText = "Expires Tomorrow";
      opStatusColor = "badge-mint-expiring";
    } else if (daysLeft <= 3) {
      opStatusText = `${daysLeft} days remaining`;
      opStatusColor = "badge-mint-expiring";
    } else {
      opStatusText = `${daysLeft} days left`;
      opStatusColor = "badge-mint-active";
    }
  }

  function handleAddVisitSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!visitNotes.trim()) {
      setVisitError("Clinical notes are required");
      return;
    }
    setVisitError("");

    addVisit({
      patient_id: patientId,
      date: new Date().toISOString(),
      type: visitType,
      notes: visitNotes.trim(),
      doctor: doctorName
    });

    setIsVisitOpen(false);
    setVisitNotes("");
    loadPatientData();
  }

  function handleRenewSubmit(e: React.FormEvent) {
    e.preventDefault();

    updatePatient(patientId, {
      validityDays: renewDays,
      opStatus: "active"
    });

    setIsRenewOpen(false);
    loadPatientData();
  }

  const initials = patient.name.charAt(0).toUpperCase();

  const visitLabelMap: Record<string, string> = {
    consultation: "Consultation",
    "follow-up": "Follow-Up",
    "blood-report": "Blood Test",
    xray: "X-Ray Scan",
    scan: "MRI/CT Scan",
    procedure: "Procedure Log",
  };

  const visitBadgeColor: Record<string, string> = {
    consultation: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "follow-up": "bg-blue-50 text-blue-700 border border-blue-100",
    "blood-report": "bg-amber-50 text-amber-700 border border-amber-100",
    xray: "bg-purple-50 text-purple-700 border border-purple-100",
    scan: "bg-teal-50 text-teal-700 border border-teal-100",
    procedure: "bg-rose-50 text-rose-700 border border-rose-100",
  };

  return (
    <div className="space-y-6 pb-16 font-sans relative">
      {/* Back to patients directory */}
      <Link href="/patients" className="inline-flex items-center gap-1.5 text-xs text-[#627A70] hover:text-gray-950 font-bold transition-colors">
        <ArrowLeft size={14} /> Back to Directory
      </Link>

      {/* Patient Header Details */}
      <div className="bg-white rounded-[28px] border border-[#E6EFEA] p-6.5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-4.5 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight truncate">{patient.name}</h1>
              <span className="text-[10px] font-bold text-[#627A70] bg-[#F4F7F5] border border-[#E6EFEA] px-2 py-0.5 rounded-md shrink-0">
                {patient.file_no}
              </span>
            </div>
            
            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-3.5 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1 shrink-0"><User size={13}/> {patient.age} years · {patient.gender}</span>
              <div className="w-1 h-1 rounded-full bg-gray-300"/>
              <span className="flex items-center gap-1 shrink-0"><Heart size={13} className="text-red-500"/> Blood Group: <strong className="text-gray-600 font-semibold">{patient.blood_group}</strong></span>
              <div className="w-1 h-1 rounded-full bg-gray-300"/>
              <span className="flex items-center gap-1 shrink-0"><Phone size={13}/> +91 {patient.phone}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {patient.tags.map(t => (
                <span key={t} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-200/50">
                  {t}
                </span>
              ))}
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                {patient.disease}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0 md:pl-6 md:border-l border-[#E6EFEA]">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Address</span>
          <p className="text-xs text-gray-600 mt-1 font-medium max-w-[200px] md:text-right leading-relaxed flex items-center gap-1">
            <MapPin size={12} className="text-gray-400 shrink-0"/> {patient.address || "No address log"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: OP Expiry Card & Details */}
        <div className="space-y-6">
          {/* OP Expiry Card */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Outpatient Validity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Clinic OP duration tracker</p>
            </div>

            {opRecord ? (
              <div className="space-y-4.5">
                <div className="flex items-center justify-between border-b border-[#E6EFEA] pb-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-400">Status</p>
                    <span className={`inline-block text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border mt-1.5 ${opStatusColor}`}>
                      {opStatusText}
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-xs text-gray-400">Validity</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{opRecord.validity_days} Days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-gray-400">Start Date</span>
                    <span className="block font-bold text-gray-700 mt-1">{opRecord.start_date}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-400">Expiry Date</span>
                    <span className="block font-bold text-gray-700 mt-1">{opRecord.expiry_date}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsRenewOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 h-10 rounded-full border border-emerald-100 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-emerald-800 text-xs font-bold transition-all shadow-sm"
                >
                  <RotateCw size={13} />
                  <span>Renew OP Validity</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-gray-400">
                No active OP Record found
              </div>
            )}
          </div>

          {/* Clinical Notes Card */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm space-y-3">
            <h2 className="text-[15px] font-bold text-gray-900">Clinical Summary</h2>
            <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#E6EFEA]/80 font-medium">
              {patient.notes || "No general clinical notes registered for this patient record."}
            </p>
          </div>
        </div>

        {/* Right Column: WhatsApp-style Visit Timeline */}
        <div className="md:col-span-2 bg-white rounded-[28px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Consultation History</h2>
              <p className="text-xs text-gray-400 mt-0.5">Chronological timeline logs</p>
            </div>
            
            <button
              onClick={() => setIsVisitOpen(true)}
              className="flex items-center gap-1 h-9 px-3.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-50"
            >
              <Plus size={14} />
              <span>Add Visit</span>
            </button>
          </div>

          {/* Timeline */}
          {visits.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-bold">No visit entries registered</p>
              <p className="text-xs text-gray-400 mt-1">Register a doctor visit log to build history.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-8 border-l border-emerald-100 ml-3.5">
              {visits.map((visit) => (
                <div key={visit.id} className="relative group">
                  {/* Outer circle marker */}
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white border-4 border-[#10B981] flex-shrink-0 group-hover:scale-125 transition-transform" />
                  
                  {/* Visit details card */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${visitBadgeColor[visit.type] || "bg-gray-100 text-gray-600"}`}>
                          {visitLabelMap[visit.type] || visit.type}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">{visit.doctor}</span>
                      </div>
                      <span className="text-[10px] text-[#627A70] font-semibold bg-[#F4F7F5] border border-[#E6EFEA] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        <Clock size={11} className="text-[#10B981]"/>
                        {new Date(visit.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed font-medium bg-[#F8FAF9]/80 border border-[#E6EFEA]/60 p-4 rounded-2xl">
                      {visitNotes && visit.notes.includes("\n")
                        ? visit.notes.split("\n").map((line, idx) => <span key={idx} className="block">{line}</span>)
                        : visit.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Visit Dialog Modal */}
      {isVisitOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Add Visit Entry</h3>
                <p className="text-xs text-gray-400">Record diagnostic clinical notes</p>
              </div>
              <button
                onClick={() => setIsVisitOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddVisitSubmit} className="space-y-4">
              {visitError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                  {visitError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Visit Type *</label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value as VisitType)}
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-Up</option>
                  <option value="blood-report">Blood Test Report</option>
                  <option value="xray">X-Ray Scan</option>
                  <option value="scan">MRI / CT Scan</option>
                  <option value="procedure">Clinical Procedure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Physician / Doctor Name *</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Arjun Mehta"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Notes &amp; Prescription *</label>
                <textarea
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="Enter diagnosis, medicine advice, dosage, and review schedule..."
                  rows={4}
                  className="w-full p-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVisitOpen(false)}
                  className="flex-1 h-11 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                >
                  <Plus size={14} />
                  <span>Add Log</span>
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
                <h3 className="text-base font-bold text-gray-900">Renew OP validity</h3>
                <p className="text-xs text-gray-400">Extend outpatient validity term</p>
              </div>
              <button
                onClick={() => setIsRenewOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Renewal Term Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setRenewDays(days)}
                      className={`h-10 rounded-xl border text-xs font-bold transition-all ${renewDays === days ? "border-[#10B981] bg-emerald-50/60 text-[#10B981]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
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
                  className="flex-1 h-11 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                >
                  <RotateCw size={13} />
                  <span>Renew File</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
