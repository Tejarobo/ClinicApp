"use client";

import { useEffect, useState } from "react";
import {
  Users,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  getStoredPatientsAsync,
  getStoredOPRecordsAsync,
  getStoredVisitsAsync,
} from "@/lib/mock-data";
import type { Patient, OPRecord, Visit } from "@/types";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [opRecords, setOpRecords] = useState<OPRecord[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [session, setSession] = useState<{ role: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const [patientsData, opRecordsData, visitsData] = await Promise.all([
          getStoredPatientsAsync(),
          getStoredOPRecordsAsync(),
          getStoredVisitsAsync(),
        ]);
        setPatients(patientsData);
        setOpRecords(opRecordsData);
        setVisits(visitsData);

        const s = localStorage.getItem("cf_session");
        if (s) setSession(JSON.parse(s));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
    const interval = setInterval(loadAll, 4000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayVisits = visits.filter((v) => v.date.startsWith(todayStr) || v.date.startsWith("2025-06-17"));
  const activeOPsCount = opRecords.filter((o) => o.status === "active").length;
  const expiringOPsCount = opRecords.filter((o) => o.status === "expiring" || o.status === "expired").length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = session?.name?.split(" ").slice(0, 2).join(" ") || "Doctor";

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* ── Greeting Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-semibold">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Link
          href="/patients"
          className="btn-primary text-sm h-10 px-5 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus size={15} />
          New Patient
        </Link>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Patients */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Today&apos;s Patients
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600">
              <Users size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            {todayVisits.length}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5 px-2.5 py-0.5 rounded-full text-indigo-700 bg-indigo-50">
            Visits today
          </span>
        </div>

        {/* Active OPs */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Active OPs
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            {activeOPsCount}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5 px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50">
            In valid term
          </span>
        </div>

        {/* Expiring OPs */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Expiring OPs
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            {expiringOPsCount}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2.5 px-2.5 py-0.5 rounded-full text-amber-700 bg-amber-50">
            Needs attention
          </span>
        </div>
      </div>

      {/* ── Recent Patients List ──────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-200">
          <div>
            <h2 className="text-[15px] font-bold text-zinc-900">Recent Patients</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Latest registered records</p>
          </div>
          <Link
            href="/patients"
            className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {patients.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-400 font-semibold">
              No patients registered yet.
            </div>
          ) : (
            patients.slice(0, 6).map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/80 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                  {patient.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                    {patient.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">
                    #{patient.file_number} · {patient.disease}
                  </p>
                </div>

                {/* Right info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="hidden sm:block text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {patient.gender}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">
                    {patient.last_visit
                      ? new Date(patient.last_visit).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "New"}
                  </span>
                  <ArrowRight size={13} className="text-zinc-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
