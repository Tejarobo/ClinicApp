"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  AlertTriangle,
  IndianRupee,
  Clock,
  Sparkles,
  ArrowRight,
  BellRing,
  Send,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import {
  getStoredPatients,
  getStoredOPRecords,
  getStoredAppointments,
  getStoredPayments,
  simulateCronJob,
  processNotificationQueue
} from "@/lib/mock-data";
import type { Patient, OPRecord, Appointment, Payment } from "@/types";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [opRecords, setOpRecords] = useState<OPRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [session, setSession] = useState<{ role: string; name: string } | null>(null);

  const [cronAlert, setCronAlert] = useState<string | null>(null);
  const [queueAlert, setQueueAlert] = useState<string | null>(null);

  // Load all data
  function loadAllData() {
    setPatients(getStoredPatients());
    setOpRecords(getStoredOPRecords());
    setAppointments(getStoredAppointments());
    setPayments(getStoredPayments());
    
    const sess = localStorage.getItem("cf_session");
    if (sess) {
      setSession(JSON.parse(sess));
    }
  }

  useEffect(() => {
    loadAllData();
    // Poll data occasionally for reactive sync
    const interval = setInterval(loadAllData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic stats
  const activeOPsCount = opRecords.filter(o => o.status === "active").length;
  const expiringOPsCount = opRecords.filter(o => o.status === "expiring").length;
  const pendingPaymentsSum = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRevenueSum = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  // Filter lists
  const targetDate = "2025-06-17"; // Standardized target demo date
  const todayAppts = appointments.filter(a => a.date === targetDate);
  const expiringOPAlerts = opRecords.filter(op => op.status === "expiring" || op.status === "expired");

  function handleTriggerCron() {
    const addedCount = simulateCronJob();
    loadAllData();
    if (addedCount > 0) {
      setCronAlert(`Successfully generated ${addedCount} pending OP expiry notification(s)!`);
    } else {
      setCronAlert("No new expiring OPs found for notification scheduling.");
    }
    setTimeout(() => setCronAlert(null), 4000);
  }

  function handleProcessQueue() {
    const sentCount = processNotificationQueue();
    loadAllData();
    if (sentCount > 0) {
      setQueueAlert(`Successfully delivered ${sentCount} pending reminder(s) via WhatsApp/SMS!`);
    } else {
      setQueueAlert("All reminders have already been processed.");
    }
    setTimeout(() => setQueueAlert(null), 4000);
  }

  const visitTypeBadge: Record<string, string> = {
    consultation: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "follow-up": "bg-blue-50 text-blue-700 border border-blue-100",
    "blood-report": "bg-amber-50 text-amber-700 border border-amber-100",
    xray: "bg-purple-50 text-purple-700 border border-purple-100",
    scan: "bg-teal-50 text-teal-700 border border-teal-100",
    procedure: "bg-gray-50 text-gray-700 border border-gray-100",
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
          {session?.role !== "receptionist" && (
            <button
              onClick={handleTriggerCron}
              className="flex items-center gap-1.5 h-10 px-4 rounded-full border border-emerald-100 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-emerald-800 text-xs font-bold transition-all shadow-sm shrink-0"
              title="Simulate Cron to schedule notifications"
            >
              <BellRing size={14} />
              <span>Cron Check</span>
            </button>
          )}
          
          <button
            onClick={handleProcessQueue}
            className="flex items-center gap-1.5 h-10 px-4 rounded-full border border-blue-100 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-blue-800 text-xs font-bold transition-all shadow-sm shrink-0"
            title="Process pending notifications"
          >
            <Send size={14} />
            <span>Process Queue</span>
          </button>

          <Link
            href="/patients"
            className="flex items-center gap-1.5 h-10 px-4.5 rounded-full bg-[#10B981] text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 shrink-0"
          >
            + New Patient
          </Link>
        </div>
      </div>

      {/* Alert Banners */}
      {cronAlert && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-semibold animate-fade-in">
          <Sparkles size={14} className="animate-spin" />
          <span>{cronAlert}</span>
        </div>
      )}
      {queueAlert && (
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-2xl text-xs font-semibold animate-fade-in">
          <Send size={14} />
          <span>{queueAlert}</span>
        </div>
      )}

      {/* Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4.5">
        {/* Today's Patients */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today&apos;s Visits</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {todayAppts.length}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2 bg-[#E8F5E9] px-2 py-0.5 rounded-full">
            +12% vs last week
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
            OP valid
          </span>
        </div>

        {/* Expiring OPs */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiring OPs</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center animate-bounce">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {expiringOPsCount}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-2 bg-amber-50 px-2 py-0.5 rounded-full">
            Requires action
          </span>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            ₹{totalRevenueSum.toLocaleString("en-IN")}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2 bg-[#E8F5E9] px-2 py-0.5 rounded-full">
            +8% vs last month
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm hover:border-[#10B981] transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Fee</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            ₹{pendingPaymentsSum.toLocaleString("en-IN")}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-2 bg-rose-50 px-2 py-0.5 rounded-full">
            Owed fee
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6.5">
        {/* Recent Patients */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6EFEA]">
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Patient Directory</h2>
                <p className="text-xs text-gray-400 mt-0.5">Quick access to patient files</p>
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
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors truncate leading-snug">
                      {patient.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      File: <span className="font-medium text-gray-500">{patient.file_no}</span> · {patient.disease}
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 flex-shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200/50">
                      {patient.gender}
                    </span>
                    <span className="text-xs text-gray-400">
                      {patient.last_visit
                        ? new Date(patient.last_visit).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                        : "—"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E6EFEA]">
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Today&apos;s Appointments</h2>
              <p className="text-xs text-gray-400 mt-0.5">June 17 Appointments</p>
            </div>
            {todayAppts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CalendarDays size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 font-medium">No appointments today</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E6EFEA]">
                {todayAppts.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F4F7F5]/20 transition-colors">
                    <div className="flex-shrink-0 text-center bg-gray-50 rounded-xl px-2.5 py-1.5 border border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{apt.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{apt.patient_name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md ${visitTypeBadge[apt.type] || "bg-gray-100 text-gray-600"}`}>
                          {apt.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring OPs / alerts */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EFEA]">
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 leading-tight">OP Expiry Alerts</h2>
                <p className="text-xs text-gray-400 mt-0.5">OP tracking &amp; status</p>
              </div>
              <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
                {expiringOPsCount} alerts
              </span>
            </div>
            {expiringOPAlerts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-gray-400 font-medium">All OPs are active</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E6EFEA]">
                {expiringOPAlerts.slice(0, 3).map((op) => {
                  const patient = patients.find((p) => p.id === op.patient_id);
                  if (!patient) return null;
                  
                  const isExpired = op.status === "expired";
                  
                  return (
                    <Link
                      key={op.id}
                      href={`/patients/${op.patient_id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#F4F7F5]/20 transition-colors"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isExpired ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{patient.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Exp: {op.expiry_date}</p>
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
