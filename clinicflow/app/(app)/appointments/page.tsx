"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Search, Plus, X } from "lucide-react";
import { getStoredAppointments, getStoredPatients, addAppointment } from "@/lib/mock-data";
import type { Appointment, Patient, VisitType } from "@/types";

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Form Fields
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("2025-06-17");
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState<VisitType>("consultation");
  const [doctor, setDoctor] = useState("Dr. Arjun Mehta");
  const [error, setError] = useState("");

  function loadData() {
    setAppts(getStoredAppointments());
    setPatients(getStoredPatients());
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  function handleOpenForm() {
    if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
    setDate("2025-06-17");
    setTime("09:00");
    setType("consultation");
    setDoctor("Dr. Arjun Mehta");
    setError("");
    setIsOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId) {
      setError("Please select a patient file");
      return;
    }
    setError("");

    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    addAppointment({
      patient_id: patientId,
      patient_name: patient.name,
      file_no: patient.file_no,
      date,
      time,
      type,
      doctor
    });

    setIsOpen(false);
    loadData();
  }

  const filtered = appts.filter(a => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.patient_name.toLowerCase().includes(q) ||
      a.file_no.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q)
    );
  });

  const visitTypeBadge: Record<string, string> = {
    consultation: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "follow-up": "bg-blue-50 text-blue-700 border border-blue-100",
    "blood-report": "bg-amber-50 text-amber-700 border border-amber-100",
    xray: "bg-purple-50 text-purple-700 border border-purple-100",
    scan: "bg-teal-50 text-teal-700 border border-teal-100",
    procedure: "bg-rose-50 text-rose-700 border border-rose-100",
  };

  return (
    <div className="space-y-6 pb-12 font-sans relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Appointments Calendar</h1>
          <p className="text-xs text-[#627A70] mt-0.5">Schedule and review patient appointments</p>
        </div>
        <button
          onClick={handleOpenForm}
          className="flex items-center gap-1.5 h-11 px-4.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-100"
        >
          <Plus size={15} />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filter */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search appointments by name, file number, doctor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E6EFEA] bg-white text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-400"
        />
        <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
      </div>

      {/* List */}
      <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Calendar size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400 font-bold">No appointments scheduled</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E6EFEA]">
            {filtered.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4.5 hover:bg-[#F4F7F5]/25 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-extrabold text-emerald-700">June</span>
                    <span className="text-sm font-bold text-gray-800 leading-none">{item.date.split("-")[2] || "17"}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 leading-snug">{item.patient_name}</span>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded">
                        {item.file_no}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"/>
                      <span>Dr: <strong className="text-gray-500 font-semibold">{item.doctor}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0">
                  <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${visitTypeBadge[item.type] || "bg-gray-100 text-gray-600"}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Drawer Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white rounded-3xl border border-[#E6EFEA] p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Add Appointment</h3>
                <p className="text-xs text-gray-400">Schedule clinical session</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                  {error}
                </div>
              )}

              {/* Patient select */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Patient File *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                >
                  <option value="" disabled>-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.file_no})</option>
                  ))}
                </select>
              </div>

              {/* Grid Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time *</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Grid Type & Doctor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Visit Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as VisitType)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="blood-report">Blood Test</option>
                    <option value="xray">X-ray Scan</option>
                    <option value="scan">CT/MRI Scan</option>
                    <option value="procedure">Procedure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor *</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Arjun Mehta"
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-11 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                >
                  <Plus size={14} />
                  <span>Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
