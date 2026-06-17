"use client";

import { UserPlus, Stethoscope, FileText, Bell, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Register Patient",
    description:
      "Add a new patient with their file number, age, condition, and tags. OP record is auto-created instantly.",
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    borderColor: "border-indigo-500/20",
  },
  {
    icon: Stethoscope,
    number: "02",
    title: "Log Consultations",
    description:
      "Each visit is timestamped and added to the patient's timeline. Complaint, diagnosis, and notes — all in one place.",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: FileText,
    number: "03",
    title: "Upload Prescriptions",
    description:
      "Attach prescriptions, blood reports, X-rays, or any external documents directly to the patient's profile.",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    borderColor: "border-purple-500/20",
  },
  {
    icon: Bell,
    number: "04",
    title: "Auto OP Renewal Alerts",
    description:
      "ClinicFlow tracks OP validity and automatically flags patients whose records are expiring — no manual tracking needed.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    borderColor: "border-amber-500/20",
  },
];

export default function WorkflowSection() {
  return (
    <section id="features" className="bg-zinc-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full mb-4">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            A clinic workflow that actually works
          </h2>
          <p className="mt-3 text-zinc-500 text-base max-w-lg mx-auto">
            From first registration to OP renewal — ClinicFlow handles the entire patient lifecycle in one place.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Step number */}
                <span className="absolute top-5 right-5 text-[11px] font-bold text-zinc-300 font-mono">
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${step.color}`}>
                  <Icon size={20} />
                </div>

                <h3 className="text-[15px] font-bold text-zinc-900 leading-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow connector (all except last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-zinc-200 rounded-full items-center justify-center shadow-sm z-10">
                    <ArrowRight size={12} className="text-zinc-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
