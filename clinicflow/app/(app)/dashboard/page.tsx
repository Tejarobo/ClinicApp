"use client";

import { useEffect, useState } from "react";
import {
  Users,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Activity,
  FileText,
  RotateCw,
  UserPlus,
  Stethoscope,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import {
  getStoredPatients,
  getStoredOPRecords,
  getStoredVisits,
  getStoredActivityLogs
} from "@/lib/mock-data";
import type { Patient, OPRecord, Visit, ActivityLog } from "@/types";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>(() => getStoredPatients());
  const [opRecords, setOpRecords] = useState<OPRecord[]>(() => getStoredOPRecords());
  const [visits, setVisits] = useState<Visit[]>(() => getStoredVisits());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    getStoredActivityLogs().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  const [session, setSession] = useState<{ role: string; name: string } | null>(() => {
    const sess = localStorage.getItem("cf_session");
    return sess ? JSON.parse(sess) : null;
  });

  function loadAllData() {
    setPatients(getStoredPatients());
    setOpRecords(getStoredOPRecords());
    setVisits(getStoredVisits());
    
    // Sort activity logs descending by date
    const logs = getStoredActivityLogs().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setActivityLogs(logs);
    
    const sess = localStorage.getItem("cf_session");
    if (sess) {
      setSession(JSON.parse(sess));
    }
  }

  useEffect(() => {
    const interval = setInterval(loadAllData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const activeOPsCount = opRecords.filter(o => o.status === "active").length;
  const expiringOPsCount = opRecords.filter(o => o.status === "expiring").length;
  
  // Filter today's visits
  const todayStr = new Date().toISOString().split("T")[0];
  const todayVisits = visits.filter(v => v.date.split("T")[0] === todayStr || v.date.startsWith("2025-06-17")); // demo support

  // OP Alerts
  const opAlerts = opRecords.filter(op => op.status === "expiring" || op.status === "expired");

  const activityIconMap: Record<string, LucideIcon> = {
    registration: UserPlus,
    visit: Stethoscope,
    file_upload: FileText,
    op_renewal: RotateCw,
  };

  const activityColorMap: Record<string, string> = {
    registration: "bg-blue-50 text-blue-700 border-blue-100/50",
    visit: "bg-emerald-50 text-[#10B981] border-emerald-100/50",
    file_upload: "bg-purple-50 text-purple-700 border-purple-100/50",
    op_renewal: "bg-amber-50 text-amber-700 border-amber-100/50",
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Banner/Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#627A70] mt-0.5 font-medium">
            Welcome back, {session?.name || "Dr. Arjun Mehta"} · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/patients"
            className="flex items-center gap-1.5 h-10 px-4.5 rounded-full bg-[#10B981] text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 shrink-0"
          >
            + New Patient
          </Link>
        </div>
      </div>

      {/* Tiny Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Visits */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today&apos;s Patients</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {todayVisits.length}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#10B981] font-bold mt-2 bg-emerald-50 px-2 py-0.5 rounded-full">
            Active visits today
          </span>
        </div>

        {/* Active OPs */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active OPs</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {activeOPsCount}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-bold mt-2 bg-blue-50 px-2 py-0.5 rounded-full">
            Files in active validity term
          </span>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiring Soon</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {expiringOPsCount}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-2 bg-amber-50 px-2 py-0.5 rounded-full">
            Requires OP renewal
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Recent Patients & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6EFEA]">
                <div>
                  <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Recent Patients</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Quick access to newly registered directories</p>
                </div>
                <Link
                  href="/patients"
                  className="inline-flex items-center gap-1 text-xs text-[#10B981] font-bold hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
              
              <div className="divide-y divide-[#E6EFEA]">
                {patients.slice(0, 5).map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#F4F7F5]/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors truncate leading-snug">
                        {patient.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        File Number: <span className="font-medium text-gray-500">{patient.file_number}</span> · {patient.disease}
                      </p>
                    </div>
                    <div className="flex items-center gap-3.5 flex-shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200/50">
                        {patient.gender}
                      </span>
                      <span className="text-xs text-gray-400">
                        {patient.last_visit
                          ? new Date(patient.last_visit).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                          : "New"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Unified Recent Activity Timeline */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Recent Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Real-time audit log of clinic events</p>
            </div>

            {activityLogs.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium py-4 text-center">No logs registered yet.</p>
            ) : (
              <div className="relative pl-5 space-y-5 border-l border-emerald-100 ml-2">
                {activityLogs.slice(0, 6).map((log) => {
                  const patient = patients.find(p => p.id === log.patient_id);
                  const patientName = patient ? patient.name : "System";
                  const Icon = activityIconMap[log.type] || Activity;
                  const colorClass = activityColorMap[log.type] || "bg-gray-50 text-gray-500";
                  
                  return (
                    <div key={log.id} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-white border-4 border-[#10B981]" />

                      <div className={`w-7 h-7 rounded-lg ${colorClass} flex items-center justify-center shrink-0 border`}>
                        <Icon size={14} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs font-semibold text-gray-700">
                            {patient ? (
                              <Link href={`/patients/${patient.id}`} className="font-bold text-gray-900 hover:text-[#10B981] hover:underline">
                                {patientName}
                              </Link>
                            ) : (
                              <span className="font-bold text-gray-900">{patientName}</span>
                            )}
                            {" · "}
                            <span className="font-medium text-gray-500">{log.description}</span>
                          </p>
                          <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                            {new Date(log.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: OP Expiry Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EFEA]">
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 leading-tight">OP Expiry Alerts</h2>
                <p className="text-xs text-gray-400 mt-0.5">Active outpatient validity status</p>
              </div>
              <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
                {expiringOPsCount} alerts
              </span>
            </div>
            {opAlerts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-gray-400 font-medium">All patient OPs are active</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E6EFEA]">
                {opAlerts.slice(0, 5).map((op) => {
                  const patient = patients.find((p) => p.id === op.patient_id);
                  if (!patient) return null;
                  
                  const isExpired = op.status === "expired";
                  
                  return (
                    <Link
                      key={op.id}
                      href={`/patients/${op.patient_id}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F4F7F5]/25 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isExpired ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-950 truncate leading-snug">{patient.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Expires: <span className="font-semibold text-gray-500">{op.expiry_date}</span></p>
                      </div>
                      <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${isExpired ? "badge-mint-expired" : "badge-mint-expiring"}`}>
                        {op.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
