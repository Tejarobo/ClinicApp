"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, ShieldAlert } from "lucide-react";
import { createClinicAsync } from "@/lib/mock-data";
import Link from "next/link";

type SignupStep = 1 | 2 | 3 | 4;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>(1);
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleNext() {
    if (step === 1 && !clinicName.trim()) {
      setError("Clinic Name is required");
      return;
    }
    if (step === 2 && !doctorName.trim()) {
      setError("Doctor Name is required");
      return;
    }
    setError("");
    setStep((prev) => (prev + 1) as SignupStep);
  }

  function handleBack() {
    setError("");
    setStep((prev) => (prev - 1) as SignupStep);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Create Clinic in database/LocalStorage
      await createClinicAsync({ clinicName, doctorName, phone });
      
      // Auto login
      localStorage.setItem("cf_session", JSON.stringify({
        phone,
        role: "doctor",
        name: doctorName
      }));

      // Go to success step
      setStep(4);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create clinic");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-5 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[14px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-950/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
              <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold text-zinc-900 tracking-tight">ClinicFlow</span>
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-white rounded-3xl border border-zinc-200/80 p-7 shadow-xl shadow-zinc-200/30">
        
        {/* Step indicator */}
        {step < 4 && (
          <div className="flex gap-1 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-indigo-600" : "bg-zinc-100"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Clinic Name */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 leading-tight">Create your clinic</h1>
              <p className="text-zinc-500 text-sm mt-1">Get started by entering your clinic name</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => { setError(""); setClinicName(e.target.value); }}
                  placeholder="e.g. Mehta Homeopathy Care"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:bg-white placeholder-zinc-400 font-semibold"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Continue <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Name */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 leading-tight">Doctor details</h1>
              <p className="text-zinc-500 text-sm mt-1">Who is the primary doctor in this clinic?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => { setError(""); setDoctorName(e.target.value); }}
                  placeholder="e.g. Dr. Arjun Mehta"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:bg-white placeholder-zinc-400 font-semibold"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  className="flex-1 h-11 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-650 text-xs font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Phone Number & Submit */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 leading-tight">Setup access</h1>
              <p className="text-zinc-500 text-sm mt-1">Enter your phone number to access the workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <div className="flex items-center h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 gap-2.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <span className="text-sm text-zinc-400 font-bold shrink-0">+91</span>
                  <div className="w-px h-4 bg-zinc-200" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setError(""); setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); }}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder-zinc-400 font-semibold"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 h-11 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-650 text-xs font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="flex-1 h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Create Clinic"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success state */}
        {step === 4 && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle size={44} className="text-emerald-500 animate-bounce" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900 leading-snug">Clinic Created!</h2>
              <p className="text-zinc-500 text-xs mt-1">Preparing your workspace at <strong className="font-bold text-zinc-750">{clinicName}</strong>...</p>
            </div>
          </div>
        )}

      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-bold">
          ← Back to homepage
        </Link>
        <div className="text-zinc-300">·</div>
        <Link href="/signin" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-bold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
