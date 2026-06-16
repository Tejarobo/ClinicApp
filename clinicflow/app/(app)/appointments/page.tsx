"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="py-16 text-center font-sans max-w-md mx-auto space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
        <Calendar size={20} />
      </div>
      <div>
        <h1 className="text-base font-bold text-gray-900">Appointments Module Deactivated</h1>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          ClinicFlow is currently configured in lightweight homeopathy file cabinet mode. Consultation scheduling is managed physically at the reception desk.
        </p>
      </div>
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#10B981] font-bold hover:underline">
          <ArrowLeft size={13} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
