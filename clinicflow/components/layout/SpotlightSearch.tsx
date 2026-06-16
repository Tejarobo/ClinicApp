"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, Users, ArrowRight, FileText, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStoredPatients, getStoredOPRecords, getStoredMedicalFiles } from "@/lib/mock-data";
import type { Patient, OPRecord } from "@/types";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSelectPatient = useCallback((id: string) => {
    const recents = recentIds.filter(rId => rId !== id);
    recents.unshift(id);
    const updated = recents.slice(0, 5);
    localStorage.setItem("cf_recent_searches", JSON.stringify(updated));
    setRecentIds(updated);

    onClose();
    router.push(`/patients/${id}`);
  }, [recentIds, onClose, router]);

  // Load recent searches on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      const recents = localStorage.getItem("cf_recent_searches");
      if (recents) {
        setRecentIds(JSON.parse(recents));
      }
    }
  }, [isOpen]);

  // Load patients and perform search
  useEffect(() => {
    const patients = getStoredPatients();
    if (!query.trim()) {
      const recentPatients = recentIds
        .map(id => patients.find(p => p.id === id))
        .filter((p): p is Patient => !!p);
      setResults(recentPatients.slice(0, 5));
    } else {
      const q = query.toLowerCase().trim();
      const filtered = patients.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.file_number.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
      setResults(filtered);
      setActiveIndex(0);
    }
  }, [query, recentIds]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIndex]) {
          handleSelectPatient(results[activeIndex].id);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex, handleSelectPatient, onClose]);

  // Global keybind Listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedPatient = results[activeIndex];
  let opStatus: OPRecord | undefined;
  let filesCount = 0;

  if (selectedPatient) {
    opStatus = getStoredOPRecords().find(o => o.patient_id === selectedPatient.id);
    filesCount = getStoredMedicalFiles().filter(f => f.patient_id === selectedPatient.id).length;
  }

  const opStatusBadge: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    expiring: "bg-amber-50 text-amber-700 border border-amber-100",
    expired: "bg-rose-50 text-rose-700 border border-rose-100",
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E26]/20 backdrop-blur-[4px] flex items-start justify-center pt-[12vh] p-4 font-sans">
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-[620px] bg-white rounded-[24px] border border-[#E6EFEA] shadow-2xl overflow-hidden flex flex-col h-[400px] animate-scale-up">
        {/* Search input bar */}
        <div className="flex items-center gap-3 h-14 border-b border-[#E6EFEA] px-4 shrink-0 bg-gray-50/50">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search custom file number, name, phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400"
          />
          <kbd className="h-5 px-1.5 rounded bg-gray-100 border border-gray-200 text-[10px] text-gray-400 font-mono flex items-center justify-center select-none shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Dynamic content split panel */}
        <div className="flex-1 min-h-0 flex divide-x divide-[#E6EFEA]">
          {/* Left Results Column */}
          <div ref={resultsRef} className="flex-1 overflow-y-auto p-3 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3.5 py-1.5">
              {query ? "Search Results" : "Recent Searches"}
            </p>

            {results.length === 0 ? (
              <div className="px-3.5 py-8 text-center text-xs text-gray-400">
                {query ? "No clinical records match query" : "No recent searches found"}
              </div>
            ) : (
              results.map((patient, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center justify-between h-11 px-3.5 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-emerald-50 text-[#10B981] border border-emerald-100/50"
                        : "hover:bg-gray-50 text-gray-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {!query ? (
                        <Clock size={14} className="text-gray-400 shrink-0" />
                      ) : (
                        <Users size={14} className="text-gray-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold truncate leading-none">{patient.name}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-gray-100 border border-gray-200/50 px-1.5 py-0.5 rounded text-gray-400">
                      {patient.file_number}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Spotlight Preview Card Column */}
          <div className="w-[240px] bg-gray-50/40 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
            {selectedPatient ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Patient Card</span>
                    <h4 className="text-xs font-bold text-gray-900 mt-1 leading-tight">{selectedPatient.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{selectedPatient.phone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-gray-400">Age / Gender</span>
                      <span className="block font-bold text-gray-600 mt-0.5">{selectedPatient.age}y / {selectedPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Diagnosis</span>
                      <span className="block font-bold text-gray-600 mt-0.5 truncate">{selectedPatient.disease}</span>
                    </div>
                  </div>

                  {opStatus && (
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-1">OP Status</span>
                      <span className={`inline-block text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full ${opStatusBadge[opStatus.status]}`}>
                        {opStatus.status}
                      </span>
                    </div>
                  )}

                  {/* Dynamic counts */}
                  <div className="pt-2.5 border-t border-[#E6EFEA] space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><FileText size={12}/> Medical Files</span>
                      <span className="font-bold text-gray-700">{filesCount}</span>
                    </div>
                    {opStatus && (
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><CalendarDays size={12}/> OP Expiration</span>
                        <span className="font-bold text-gray-700 truncate">{opStatus.expiry_date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPatient(selectedPatient.id)}
                  className="w-full flex items-center justify-center gap-1 h-9 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-[11px] font-bold transition-all shadow-sm"
                >
                  <span>Open Profile</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-4">
                <Users size={24} className="text-gray-300 mb-1.5" />
                <p className="text-[10px] font-medium leading-normal">Highlight a patient record to view their profile preview card here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
