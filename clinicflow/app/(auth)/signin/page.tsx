"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, RotateCcw, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getUserByPhoneAsync } from "@/lib/mock-data";
import Link from "next/link";

type Step = "phone" | "otp";

function SignInContent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 600);
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter the 6-digit OTP"); return; }
    if (code !== "123456") { setError("Invalid OTP. Use 123456 for testing."); return; }

    setError("");
    setLoading(true);

    try {
      const user = await getUserByPhoneAsync(phone);
      if (!user) {
        setError("This phone number is not registered. Please contact the clinic administrator.");
        setLoading(false);
        return;
      }
      localStorage.setItem("cf_session", JSON.stringify({
        phone: user.phone, role: user.role, name: user.name,
      }));
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-5 relative overflow-hidden font-sans">
      {/* Subtle top background decoration */}
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
        <AnimatePresence mode="wait">

          {/* ── Phone Step ────────────────────────────────────────── */}
          {step === "phone" && (
            <motion.div key="phone"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22 }}
            >
              <div className="mb-6">
                <h1 className="text-xl font-bold text-zinc-900 leading-tight">Welcome back</h1>
                <p className="text-zinc-500 text-sm mt-1">Sign in using your registered phone number</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 gap-2.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <span className="text-sm text-zinc-400 font-bold shrink-0">+91</span>
                    <div className="w-px h-4 bg-zinc-200" />
                    <input type="tel" value={phone}
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

                <button type="submit" disabled={loading || phone.length < 10}
                  className="w-full h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 cursor-pointer">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send OTP <ArrowRight size={15} /></>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── OTP Step ──────────────────────────────────────────── */}
          {step === "otp" && (
            <motion.div key="otp"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
            >
              <button onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setError(""); }}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 transition-colors mb-5 font-bold cursor-pointer">
                <RotateCcw size={11} /> Change number
              </button>

              <div className="mb-5">
                <h2 className="text-xl font-bold text-zinc-900 leading-tight">Verify identity</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Code sent to <span className="text-zinc-800 font-bold">+91 {phone}</span>
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg px-3 py-1.5 mb-5 border border-emerald-100 font-bold">
                Demo OTP: <strong className="font-bold text-emerald-600">123456</strong>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 text-center text-lg font-bold rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all duration-150"
                      style={{ height: "52px" }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading || otp.join("").length < 6}
                  className="w-full h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-indigo-100 cursor-pointer">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Verify & Enter →"}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-bold">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
