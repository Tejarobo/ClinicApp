"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, RotateCcw } from "lucide-react";

type Step = "phone" | "otp";

export default function LoginPage() {
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
    }, 700);
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    if (code !== "123456") {
      setError("Invalid OTP. Use 123456 for demo.");
      return;
    }

    setError("");
    setLoading(true);

    // Save mock session based on role mapping
    let session = { phone, role: "doctor", name: "Dr. Arjun Mehta" };
    if (phone === "9876543210") {
      session = { phone, role: "doctor", name: "Dr. Arjun Mehta" };
    } else if (phone === "9123456789") {
      session = { phone, role: "receptionist", name: "Priya Sharma" };
    } else if (phone === "9988776655") {
      session = { phone, role: "admin", name: "Ramesh Kumar" };
    } else {
      session = { phone, role: "doctor", name: `Dr. Demo (${phone.slice(-4)})` };
    }

    localStorage.setItem("cf_session", JSON.stringify(session));

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  function handleQuickLogin(num: string) {
    setPhone(num);
    setStep("otp");
  }

  function handleGoogle() {
    setLoading(true);
    const session = { phone: "9876543210", role: "doctor", name: "Dr. Arjun Mehta (Google)" };
    localStorage.setItem("cf_session", JSON.stringify(session));
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Mint green soft blobs */}
      <div className="absolute -top-48 -right-48 w-[640px] h-[640px] rounded-full bg-emerald-50/70 opacity-70 blur-3xl" />
      <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-teal-50/60 opacity-60 blur-3xl" />

      <div className="relative w-full max-w-[420px]">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#10B981] rounded-2xl mb-4 shadow-lg shadow-emerald-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
              <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ClinicFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Smart medical records operating system.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] border border-[#E6EFEA] p-8 shadow-sm">
          {step === "phone" && (
            <>
              <p className="text-xl font-bold text-gray-900 mb-1">Welcome back</p>
              <p className="text-sm text-gray-400 mb-6">Enter your phone number to sign in</p>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all duration-150 mb-5 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100"/>
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100"/>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="flex items-center gap-2 h-12 rounded-2xl border border-[#E6EFEA] bg-[#F8FAF9] px-4 focus-within:border-[#10B981] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-50 transition-all duration-150">
                    <span className="text-sm text-gray-500 font-medium shrink-0">+91</span>
                    <div className="w-px h-4 bg-gray-200"/>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                      placeholder="98765 43210"
                      className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400"
                      autoFocus
                    />
                    <Phone size={15} className="text-gray-300 shrink-0"/>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full h-12 rounded-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    : <>Send OTP <ArrowRight size={15}/></>}
                </button>
              </form>

              {/* Demo quick roles */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Demo Quick Roles</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickLogin("9876543210")}
                    className="px-2 py-1.5 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-emerald-700 text-xs font-medium rounded-xl border border-emerald-100 text-center transition-colors"
                  >
                    Doctor
                  </button>
                  <button
                    onClick={() => handleQuickLogin("9123456789")}
                    className="px-2 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-blue-700 text-xs font-medium rounded-xl border border-blue-100 text-center transition-colors"
                  >
                    Receptionist
                  </button>
                  <button
                    onClick={() => handleQuickLogin("9988776655")}
                    className="px-2 py-1.5 bg-[#FAF5FF] hover:bg-[#F3E8FF] text-purple-700 text-xs font-medium rounded-xl border border-purple-100 text-center transition-colors"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <button
                onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setError(""); }}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-5"
              >
                <RotateCcw size={12}/> Change number
              </button>
              <p className="text-xl font-bold text-gray-900 mb-1">Verify OTP</p>
              <p className="text-sm text-gray-400 mb-1">
                Sent to <span className="text-gray-700 font-medium">+91 {phone}</span>
              </p>
              <span className="inline-block text-xs text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1 mb-6 border border-emerald-100 font-medium">
                Demo OTP: <strong>123456</strong>
              </span>

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g,""))}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-emerald-50 transition-all duration-150"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full h-12 rounded-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    : <>Verify &amp; Enter <ArrowRight size={15}/></>}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in you agree to ClinicFlow&apos;s Terms of Service.
        </p>
      </div>
    </div>
  );
}
