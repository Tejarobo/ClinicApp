"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is my patient data safe?",
    a: "Yes. All patient data is stored securely. When connected to Supabase, data is encrypted in transit and at rest. In offline/demo mode, data is stored locally in your browser.",
  },
  {
    q: "Can multiple staff members use ClinicFlow?",
    a: "Yes. ClinicFlow supports multiple roles — Doctor, Receptionist, and Admin — each with appropriate access. Staff members log in with their registered phone number.",
  },
  {
    q: "What is an OP record?",
    a: "OP (Outpatient) records track a patient's registration validity at the clinic. Patients need to renew their OP every 30 days (configurable). ClinicFlow automatically alerts you before expiry.",
  },
  {
    q: "Can I upload prescriptions and reports?",
    a: "Yes. You can attach prescriptions, blood reports, X-rays, and external documents directly to each patient's profile. All files are accessible from their timeline.",
  },
  {
    q: "Does ClinicFlow work on mobile?",
    a: "Absolutely. ClinicFlow is built mobile-first. The interface works beautifully on a 390px phone screen — perfect for use during consultations.",
  },
  {
    q: "Can I migrate from paper records?",
    a: "Yes. You can register existing patients with their historical file numbers and add past visits manually. Our team can help with bulk data migration on request.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 bg-zinc-100 border border-zinc-200 px-3.5 py-1.5 rounded-full mb-4">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Common questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                open === i
                  ? "border-indigo-200 bg-indigo-50/30"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className={`text-[14.5px] font-semibold leading-snug transition-colors ${
                    open === i ? "text-indigo-700" : "text-zinc-900"
                  }`}
                >
                  {faq.q}
                </span>
                <div
                  className={`shrink-0 ml-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    open === i
                      ? "bg-indigo-100 text-indigo-600 rotate-0"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>

              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  open === i ? "max-h-[500px] border-t border-indigo-100/30" : "max-h-0"
                }`}
              >
                <p className="px-5 py-4 text-sm text-zinc-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
