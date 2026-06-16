"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus, Edit3, Trash2, ArrowUpDown, ChevronRight, X, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getStoredPatients, getStoredOPRecords, addPatient, updatePatient, savePatients } from "@/lib/mock-data";
import type { Patient, OPRecord, Gender, BloodGroup } from "@/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [opRecords, setOpRecords] = useState<OPRecord[]>([]);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "file_no" | "last_visit">("file_no");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Drawer / Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // Form Fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("B+");
  const [disease, setDisease] = useState("");
  const [notes, setNotes] = useState("");
  const [validityDays, setValidityDays] = useState(30);

  // Errors
  const [error, setError] = useState("");

  function loadData() {
    setPatients(getStoredPatients());
    setOpRecords(getStoredOPRecords());
  }

  useEffect(() => {
    loadData();
    // Poll data occasionally for reactive sync
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  function handleOpenAdd() {
    setEditingPatient(null);
    setName("");
    setAge("");
    setGender("male");
    setPhone("");
    setAddress("");
    setBloodGroup("B+");
    setDisease("");
    setNotes("");
    setValidityDays(30);
    setError("");
    setIsOpen(true);
  }

  function handleOpenEdit(p: Patient) {
    const op = opRecords.find(o => o.patient_id === p.id);
    setEditingPatient(p);
    setName(p.name);
    setAge(p.age.toString());
    setGender(p.gender);
    setPhone(p.phone);
    setAddress(p.address);
    setBloodGroup(p.blood_group);
    setDisease(p.disease);
    setNotes(p.notes);
    setValidityDays(op ? op.validity_days : 30);
    setError("");
    setIsOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this patient record?")) {
      const stored = getStoredPatients();
      const updated = stored.filter(p => p.id !== id);
      savePatients(updated);
      loadData();
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    if (!age || isNaN(Number(age)) || Number(age) <= 0) { setError("Enter a valid age"); return; }
    if (!phone || phone.length < 10) { setError("Enter a valid 10-digit phone number"); return; }
    if (!disease.trim()) { setError("Primary disease/complaint is required"); return; }

    setError("");

    const patientDetails = {
      name: name.trim(),
      age: parseInt(age),
      gender,
      phone: phone.trim(),
      address: address.trim(),
      blood_group: bloodGroup,
      disease: disease.trim(),
      notes: notes.trim(),
      tags: editingPatient ? editingPatient.tags : [],
    };

    if (editingPatient) {
      // Find current OP and status
      const op = opRecords.find(o => o.patient_id === editingPatient.id);
      updatePatient(editingPatient.id, {
        ...patientDetails,
        validityDays,
        opStatus: op ? op.status : "active"
      });
    } else {
      addPatient({
        ...patientDetails,
        validityDays,
      });
    }

    setIsOpen(false);
    loadData();
  }

  // Sort and Filter patients
  const filteredPatients = patients.filter(p => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.file_no.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "file_no") {
      comparison = a.file_no.localeCompare(b.file_no);
    } else if (sortField === "last_visit") {
      const dateA = a.last_visit ? new Date(a.last_visit).getTime() : 0;
      const dateB = b.last_visit ? new Date(b.last_visit).getTime() : 0;
      comparison = dateA - dateB;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  function toggleSort(field: "name" | "file_no" | "last_visit") {
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

  return (
    <div className="space-y-6 pb-12 font-sans relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-[#627A70] mt-0.5">Manage and track your active patient OP logs</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 h-11 px-4.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-100"
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
            placeholder="Search by name, file number, or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E6EFEA] bg-white text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-400"
          />
          <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>
        
        {/* Sorting controls */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort("file_no")}
            className={`flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E6EFEA] text-xs font-semibold bg-white transition-all hover:bg-gray-50 ${sortField === "file_no" ? "border-[#10B981] text-[#10B981]" : "text-gray-500"}`}
          >
            <span>File No</span>
            <ArrowUpDown size={12} />
          </button>
          <button
            onClick={() => toggleSort("name")}
            className={`flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E6EFEA] text-xs font-semibold bg-white transition-all hover:bg-gray-50 ${sortField === "name" ? "border-[#10B981] text-[#10B981]" : "text-gray-500"}`}
          >
            <span>Name</span>
            <ArrowUpDown size={12} />
          </button>
          <button
            onClick={() => toggleSort("last_visit")}
            className={`flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E6EFEA] text-xs font-semibold bg-white transition-all hover:bg-gray-50 ${sortField === "last_visit" ? "border-[#10B981] text-[#10B981]" : "text-gray-500"}`}
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
            <p className="text-xs text-gray-400 mt-1">Try refining your search keyword or create a new patient record.</p>
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-[#10B981] transition-colors leading-snug">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded">
                          {p.file_no}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {p.age} yrs · {p.gender} · {p.phone} · <span className="text-gray-500 font-medium">{p.disease}</span>
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
                        className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                        title="Edit Patient details"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 rounded-lg border border-red-50 bg-red-50/50 hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 transition-opacity animate-fade-in flex justify-end">
          {/* Drawer Container */}
          <div className="w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in p-6 font-sans">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPatient ? "Edit Patient File" : "Register New Patient"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingPatient ? `Modify details for ${editingPatient.file_no}` : "Create a new medical file number"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700"
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

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400"
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
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Grid Phone & Blood Group */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                    placeholder="e.g. 9876543210"
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
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
                      className={`h-9 rounded-xl border text-xs font-semibold transition-all ${validityDays === days ? "border-[#10B981] bg-emerald-50/60 text-[#10B981]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Complaint / Disease */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Diagnosis / Disease *</label>
                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Hypertension"
                  className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 12, MG Road, Chennai"
                  rows={2}
                  className="w-full p-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Notes &amp; History</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. On Metformin 500mg. Monitor creatinine level."
                  rows={3}
                  className="w-full p-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all placeholder-gray-400 resize-none"
                />
              </div>
            </form>

            {/* Drawer Actions Footer */}
            <div className="border-t border-gray-100 pt-4 flex gap-3.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="flex-1 h-12 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-100"
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
