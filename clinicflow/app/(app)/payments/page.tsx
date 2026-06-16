"use client";

import { useEffect, useState } from "react";
import { CreditCard, IndianRupee, Clock, CheckCircle, Search } from "lucide-react";
import { getStoredPayments, getStoredPatients } from "@/lib/mock-data";
import type { Payment, Patient } from "@/types";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");

  function loadData() {
    setPayments(getStoredPayments());
    setPatients(getStoredPatients());
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter(p => {
    const patient = patients.find(pat => pat.id === p.patient_id);
    const pName = patient ? patient.name.toLowerCase() : "";
    const pFile = patient ? patient.file_no.toLowerCase() : "";
    
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      pName.includes(q) ||
      pFile.includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Billing &amp; Payments</h1>
        <p className="text-xs text-[#627A70] mt-0.5">Review patient consultation fees and financial analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fees Collected</span>
            <p className="text-2xl font-bold text-gray-900 leading-tight">₹{totalPaid.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Patient Dues</span>
            <p className="text-2xl font-bold text-gray-900 leading-tight font-sans">₹{totalPending.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search ledger by patient name, file number, description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E6EFEA] bg-white text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-400"
        />
        <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
      </div>

      {/* Payments Ledger */}
      <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CreditCard size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400 font-bold">No payment logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E6EFEA]">
            {filtered.map((item) => {
              const patient = patients.find(pat => pat.id === item.patient_id);
              const name = patient ? patient.name : "Unknown Patient";
              const fileNo = patient ? patient.file_no : "—";
              
              const isPaid = item.status === "paid";
              
              return (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-[#F4F7F5]/25 transition-colors">
                  <div className="flex items-center gap-4.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                      <IndianRupee size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 leading-snug">{name}</span>
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded">
                          {fileNo}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.description} · <span className="font-semibold">{item.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0 shrink-0">
                    <p className="text-base font-bold text-gray-900">₹{item.amount}</p>
                    <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
