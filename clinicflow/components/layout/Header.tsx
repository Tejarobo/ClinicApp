"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, X } from "lucide-react";
import { getStoredPatients, getStoredNotifications } from "@/lib/mock-data";
import type { Patient } from "@/types";
import Link from "next/link";

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const val = localStorage.getItem("cf_session");
    if (val) {
      setSession(JSON.parse(val));
    }
  }, []);

  useEffect(() => {
    // Dynamic pending notifications count
    const notes = getStoredNotifications();
    setPendingCount(notes.filter((n) => n.status === "pending").length);
    
    const interval = setInterval(() => {
      const latest = getStoredNotifications();
      setPendingCount(latest.filter((n) => n.status === "pending").length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const stored = getStoredPatients();
      const q = query.toLowerCase().trim();
      const filtered = stored.filter(
        (p) =>
          p.file_no.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
      setResults(filtered);
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  const genderBadgeColor: Record<string, string> = {
    male: "bg-blue-50 text-blue-600 border border-blue-100",
    female: "bg-pink-50 text-pink-600 border border-pink-100",
    other: "bg-gray-50 text-gray-600 border border-gray-100",
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-6 bg-white/90 backdrop-blur border-b border-[#E6EFEA] font-sans">
      {/* Search */}
      <div ref={ref} className="relative flex-1 max-w-md">
        <div className="flex items-center gap-3 h-10 rounded-full border border-[#E6EFEA] bg-[#F8FAF9] px-4 focus-within:border-[#10B981] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-50 transition-all duration-150">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search file number or patient..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400"
          />
          {query && (
            <button onClick={() => { setQuery(""); setOpen(false); }}>
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl border border-[#E6EFEA] shadow-xl shadow-gray-200/40 overflow-hidden z-50">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No patients found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul className="py-1.5 max-h-[300px] overflow-y-auto">
                {results.slice(0, 5).map((patient) => (
                  <li key={patient.id}>
                    <Link
                      href={`/patients/${patient.id}`}
                      onClick={() => { setQuery(""); setOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F7F5]/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{patient.name}</p>
                        <p className="text-xs text-gray-400 truncate">{patient.file_no} · {patient.disease}</p>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${genderBadgeColor[patient.gender]}`}>
                        {patient.gender}
                      </span>
                    </Link>
                  </li>
                ))}
                {results.length > 5 && (
                  <li className="px-4 py-2 border-t border-[#E6EFEA] bg-gray-50/50">
                    <Link
                      href={`/patients?q=${encodeURIComponent(query)}`}
                      className="text-xs text-[#10B981] font-semibold hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      See all {results.length} results →
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Notification bell */}
      <Link
        href="/notifications"
        className="relative w-9 h-9 rounded-xl border border-[#E6EFEA] flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-[#F4F7F5]/60 transition-all duration-150"
      >
        <Bell size={16} />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
            {pendingCount}
          </span>
        )}
      </Link>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer shrink-0">
        {initials}
      </div>
    </header>
  );
}
