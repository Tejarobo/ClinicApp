"use client";

import { useEffect, useState, startTransition } from "react";
import { Search, UserPlus, Edit3, Trash2, ArrowUpDown, ChevronRight, X, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import {
  getStoredPatientsAsync,
  getStoredOPRecordsAsync,
  addPatientAsync,
  updatePatientAsync,
  deletePatientAsync
} from "@/lib/mock-data";
import type { Patient, OPRecord, Gender } from "@/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [opRecords, setOpRecords] = useState<OPRecord[]>([]);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "file_number" | "last_visit">("file_number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  // Drawer / Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // Form Fields
  const [fileNumber, setFileNumber] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [phone, setPhone] = useState("");
  const [disease, setDisease] = useState("");
  const [notes, setNotes] = useState("");
  const [validityDays, setValidityDays] = useState(30);

  // Homeopathy Specific Case Sheet
  const [appetite, setAppetite] = useState("");
  const [thirst, setThirst] = useState("");
  const [sleep, setSleep] = useState("");
  const [dreams, setDreams] = useState("");
  const [thermalState, setThermalState] = useState("Ambi-thermal");
  const [mindSymptoms, setMindSymptoms] = useState("");
  const [modalities, setModalities] = useState("");
  const [desiresAversions, setDesiresAversions] = useState("");

  // Errors
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [patientsData, opRecordsData] = await Promise.all([
        getStoredPatientsAsync(),
        getStoredOPRecordsAsync()
      ]);
      setPatients(patientsData);
      setOpRecords(opRecordsData);
    } catch (err) {
      console.error("Error loading patients list:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  function handleOpenAdd() {
    setEditingPatient(null);
    setFileNumber("");
    setName("");
    setAge("");
    setGender("male");
    setPhone("");
    setDisease("");
    setNotes("");
    setValidityDays(30);
    setAppetite("");
    setThirst("");
    setSleep("");
    setDreams("");
    setThermalState("Ambi-thermal");
    setMindSymptoms("");
    setModalities("");
    setDesiresAversions("");
    setError("");
    setIsOpen(true);
  }

  function handleOpenEdit(p: Patient) {
    const op = opRecords.find(o => o.patient_id === p.id);
    setEditingPatient(p);
    setFileNumber(p.file_number);
    setName(p.name);
    setAge(p.age.toString());
    setGender(p.gender);
    setPhone(p.phone);
    setDisease(p.disease);
    setNotes(p.notes);
    setValidityDays(op ? op.validity_days : 30);
    setAppetite(p.appetite || "");
    setThirst(p.thirst || "");
    setSleep(p.sleep || "");
    setDreams(p.dreams || "");
    setThermalState(p.thermal_state || "Ambi-thermal");
    setMindSymptoms(p.mind_symptoms || "");
    setModalities(p.modalities || "");
    setDesiresAversions(p.desires_aversions || "");
    setError("");
    setIsOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this patient record?")) {
      try {
        await deletePatientAsync(id);
        await loadData();
      } catch (err) {
        console.error("Error deleting patient:", err);
      }
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileNumber.trim()) { setError("File number is required"); return; }
    if (!name.trim()) { setError("Name is required"); return; }
    if (!age || isNaN(Number(age)) || Number(age) <= 0) { setError("Enter a valid age"); return; }
    if (!phone || phone.length < 10) { setError("Enter a valid 10-digit phone number"); return; }
    if (!disease.trim()) { setError("Chief complaint/disease is required"); return; }

    // Unique file number check
    const duplicate = patients.some(
      p =>
        p.file_number.toLowerCase().trim() === fileNumber.toLowerCase().trim() &&
        (!editingPatient || p.id !== editingPatient.id)
    );
    if (duplicate) {
      setError(`File number "${fileNumber}" is already registered.`);
      return;
    }

    setError("");

    const patientDetails = {
      file_number: fileNumber.trim(),
      name: name.trim(),
      age: parseInt(age),
      gender,
      phone: phone.trim(),
      disease: disease.trim(),
      notes: notes.trim(),
      tags: editingPatient ? editingPatient.tags : [],
      appetite: appetite.trim(),
      thirst: thirst.trim(),
      sleep: sleep.trim(),
      dreams: dreams.trim(),
      thermal_state: thermalState,
      mind_symptoms: mindSymptoms.trim(),
      modalities: modalities.trim(),
      desires_aversions: desiresAversions.trim(),
    };

    try {
      if (editingPatient) {
        const op = opRecords.find(o => o.patient_id === editingPatient.id);
        await updatePatientAsync(editingPatient.id, {
          ...patientDetails,
          validityDays,
          opStatus: op ? op.status as any : "active"
        });
      } else {
        await addPatientAsync({
          ...patientDetails,
          validityDays,
        });
      }

      setIsOpen(false);
      await loadData();
    } catch (err) {
      setError((err as Error).message || "An error occurred saving records.");
    }
  }

  // Sort and Filter patients
  const filteredPatients = patients.filter(p => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.file_number.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "file_number") {
      comparison = a.file_number.localeCompare(b.file_number);
    } else if (sortField === "last_visit") {
      const dateA = a.last_visit ? new Date(a.last_visit).getTime() : 0;
      const dateB = b.last_visit ? new Date(b.last_visit).getTime() : 0;
      comparison = dateA - dateB;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  function toggleSort(field: "name" | "file_number" | "last_visit") {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  }

  const opBadgeColor: Record<string, string> = {
    active: "badge-mint-active",
    expiring: "badge-mint-expiring",
    expired: "badge-mint-expired",
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-[#627A70] mt-0.5">Manage and search clinical case files</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 h-11 px-4.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-100 cursor-pointer"
        >
          <UserPlus size={15} />
          <span>New Patient</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by file number, name, or phone..."
            value={query}
            onChange={(e) => startTransition(() => setQuery(e.target.value))}
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E6EFEA] bg-white text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-400"
          />
          <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>
        
        {/* Sorting controls */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort("file_number")}
            className={`flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E6EFEA] text-xs font-semibold bg-white transition-all hover:bg-gray-50 cursor-pointer ${sortField === "file_number" ? "border-[#10B981] text-[#10B981]" : "text-gray-500"}`}
          >
            <span>File Number</span>
            <ArrowUpDown size={12} />
          </button>
          <button
            onClick={() => toggleSort("name")}
            className={`flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E6EFEA] text-xs font-semibold bg-white transition-all hover:bg-gray-50 cursor-pointer ${sortField === "name" ? "border-[#10B981] text-[#10B981]" : "text-gray-500"}`}
          >
            <span>Name</span>
            <ArrowUpDown size={12} />
          </button>
          <button
            onClick={() => toggleSort("last_visit")}
            className={`flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E6EFEA] text-xs font-semibold bg-white transition-all hover:bg-gray-50 cursor-pointer ${sortField === "last_visit" ? "border-[#10B981] text-[#10B981]" : "text-gray-500"}`}
          >
            <span>Last Visit</span>
            <ArrowUpDown size={12} />
          </button>
        </div>
      </div>

      {/* Directory List */}
      <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
        {sortedPatients.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Search size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400 font-bold">No patients found</p>
            <p className="text-xs text-gray-400 mt-1">Try searching by File Number, Name, or Phone, or register a new record.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E6EFEA]">
            {sortedPatients.map((p) => {
              const op = opRecords.find((o) => o.patient_id === p.id);
              const initials = p.name.charAt(0).toUpperCase();
              
              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4.5 hover:bg-[#F4F7F5]/25 transition-colors group"
                >
                  <Link href={`/patients/${p.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-[#10B981] transition-colors leading-snug">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded">
                          {p.file_number}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {p.age} yrs · {p.gender} · {p.phone} · <span className="text-[#10B981] font-bold">{p.disease}</span>
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between sm:justify-end gap-3.5 flex-shrink-0 border-t sm:border-0 pt-2 sm:pt-0">
                    {op && (
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${opBadgeColor[op.status] || "bg-gray-100 text-gray-600"}`}>
                          {op.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Expires: <span className="font-semibold text-gray-500">{op.expiry_date}</span>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 ml-4">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                        title="Edit Patient details"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 rounded-lg border border-red-50 bg-red-50/50 hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="Delete Patient record"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Link
                        href={`/patients/${p.id}`}
                        className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 transition-opacity flex justify-end">
          {/* Drawer Container */}
          <div className="w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden p-6 font-sans">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPatient ? "Edit Patient File" : "Register New Patient"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingPatient ? `Modify details for ${editingPatient.file_number}` : "Create a new medical file entry"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Drawer Content Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>{error}</span>
                </div>
              )}

              {/* File Number */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">File Number (Custom) *</label>
                <input
                  type="text"
                  value={fileNumber}
                  onChange={(e) => setFileNumber(e.target.value)}
                  placeholder="e.g. OP-102 or B-54"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 uppercase font-semibold"
                  disabled={!!editingPatient}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Grid Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Age (Years) *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 56"
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all font-semibold"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                  placeholder="e.g. 9876543210"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                />
              </div>

              {/* OP Validity duration */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">OP Record Validity (Days) *</label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 15, 30, 90].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setValidityDays(days)}
                      className={`h-9 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${validityDays === days ? "border-[#10B981] bg-emerald-50/60 text-[#10B981]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Complaint / Disease */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Disease / Chief Complaint *</label>
                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="e.g. Chronic Asthma, Eczema"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Case History Section divider */}
              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Homeopathic Case Sheet (Generals)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Thermal State */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Thermal State</label>
                    <select
                      value={thermalState}
                      onChange={(e) => setThermalState(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all font-semibold"
                    >
                      <option value="Ambi-thermal">Ambi-thermal</option>
                      <option value="Chilly">Chilly</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>
                  {/* Thirst */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Thirst</label>
                    <input
                      type="text"
                      value={thirst}
                      onChange={(e) => setThirst(e.target.value)}
                      placeholder="e.g. Large quantities, thirstless"
                      className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Appetite */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Appetite</label>
                    <input
                      type="text"
                      value={appetite}
                      onChange={(e) => setAppetite(e.target.value)}
                      placeholder="e.g. Normal, ravenous"
                      className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                    />
                  </div>
                  {/* Sleep */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sleep</label>
                    <input
                      type="text"
                      value={sleep}
                      onChange={(e) => setSleep(e.target.value)}
                      placeholder="e.g. Restless sleep"
                      className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Dreams */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dreams</label>
                    <input
                      type="text"
                      value={dreams}
                      onChange={(e) => setDreams(e.target.value)}
                      placeholder="e.g. Falling, snakes, water"
                      className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                    />
                  </div>
                  {/* Desires & Aversions */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Desires / Aversions</label>
                    <input
                      type="text"
                      value={desiresAversions}
                      onChange={(e) => setDesiresAversions(e.target.value)}
                      placeholder="e.g. Desires sweets, spicy"
                      className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mental State & Mind Symptoms</label>
                  <input
                    type="text"
                    value={mindSymptoms}
                    onChange={(e) => setMindSymptoms(e.target.value)}
                    placeholder="e.g. Irritable, seeks consolation, anxious"
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Modalities (Worse / Better factors)</label>
                  <input
                    type="text"
                    value={modalities}
                    onChange={(e) => setModalities(e.target.value)}
                    placeholder="e.g. Worse at night, better warm bath"
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-xs text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 font-semibold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Notes &amp; History</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Symptoms aggravate during winter. Has family history of diabetes."
                  rows={3}
                  className="w-full p-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-zinc-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 resize-none font-semibold"
                />
              </div>
            </form>

            {/* Drawer Actions Footer */}
            <div className="border-t border-gray-100 pt-4 flex gap-3.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="flex-1 h-12 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-100 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>{editingPatient ? "Save Changes" : "Create File"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
