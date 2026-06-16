"use client";

import { useState } from "react";
import { Stethoscope, Phone, Shield, Plus } from "lucide-react";
import { getStoredDoctors } from "@/lib/mock-data";
import type { Doctor } from "@/types";

export default function DoctorsPage() {
  const [doctors] = useState<Doctor[]>(() => getStoredDoctors());

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Physicians Directory</h1>
          <p className="text-xs text-[#627A70] mt-0.5">Manage doctor credentials and specialization tags</p>
        </div>
        <button
          className="flex items-center gap-1.5 h-11 px-4.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-100 opacity-60 cursor-not-allowed"
          disabled
          title="Adding doctors is disabled in Single Clinic v1"
        >
          <Plus size={15} />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Info notice */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-start gap-3">
        <Shield size={16} className="text-[#10B981] mt-0.5 shrink-0" />
        <div className="text-xs text-[#627A70] leading-normal font-semibold">
          <strong className="text-emerald-950 font-bold">Single-Clinic Mode Active:</strong> Currently optimized for a single dedicated homeopathy practitioner. Future updates will support multi-practitioner scheduling.
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const initials = doc.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={doc.id}
              className="bg-white rounded-[24px] border border-[#E6EFEA] p-6 shadow-sm hover:border-[#10B981] transition-all relative overflow-hidden group"
            >
              {/* Soft decorative background shape */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-emerald-50/40 group-hover:scale-110 transition-transform duration-300" />

              <div className="flex items-start gap-4 relative z-10">
                {/* Doctor Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-base font-bold shadow-sm">
                  {initials}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#10B981] transition-colors">
                      {doc.name}
                    </h3>
                    {doc.is_active ? (
                      <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        Active
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <Stethoscope size={12} />
                    <span>{doc.specialization} Practitioner</span>
                  </p>
                </div>
              </div>

              {/* Contact / Footer details */}
              <div className="mt-6 pt-4 border-t border-[#E6EFEA] flex items-center justify-between text-[11px] text-gray-400 font-semibold relative z-10">
                <div className="flex items-center gap-1">
                  <Phone size={12} className="text-gray-400" />
                  <span>+91 {doc.phone}</span>
                </div>
                <span>Joined Jan 2024</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
