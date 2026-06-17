"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, RotateCcw, ShieldAlert } from "lucide-react";
import { getUserByPhoneAsync } from "@/lib/mock-data";

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
    if (code.length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    
    // Check demo OTP
    if (code !== "123456") {
      setError("Invalid OTP. Use 123456 for testing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Look up user in database/mock by phone
      const user = await getUserByPhoneAsync(phone);
      
      if (!user) {
        setError("This phone number is not registered. Please contact the clinic administrator.");
        setLoading(false);
        return;
      }

      // Save valid session mapping
      const session = {
        phone: user.phone,
        role: user.role,
        name: user.name,
      };

      localStorage.setItem("cf_session", JSON.stringify(session));

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-[#ECFDF5] to-transparent opacity-60 blur-3xl pointer-events-none" />

      {/* Spacing alignment helper */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="relative w-full max-w-[380px]">
          
          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-[#10B981] rounded-[16px] flex items-center justify-center shadow-lg shadow-emerald-100/60 mb-3 select-none">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
                <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ClinicFlow</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6 shadow-sm">
            {step === "phone" ? (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">Welcome back 👋</h2>
                  <p className="text-xs text-gray-400 mt-1">Enter your phone number to continue</p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 h-11 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] px-3.5 focus-within:border-[#10B981] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-50 transition-all duration-150">
                      <span className="text-sm text-gray-400 font-semibold shrink-0 select-none">+91</span>
                      <div className="w-px h-3.5 bg-gray-200" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setError("");
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                        }}
                        placeholder="98765 43210"
                        className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-300 font-medium"
                        autoFocus
                      />
                      <Phone size={14} className="text-gray-300 shrink-0" />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50/75 rounded-xl p-3 border border-red-100">
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full h-11 rounded-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Continue <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                      setError("");
                    }}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-semibold"
                  >
                    <RotateCcw size={11} /> Change number
                  </button>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight mt-3">Verify Identity</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Sent code to <span className="text-gray-600 font-semibold">+91 {phone}</span>
                  </p>
                </div>

                <div className="inline-block text-[11px] text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-1 mb-5 border border-emerald-100 font-semibold select-none">
                  Demo Verification OTP: <strong className="font-bold">123456</strong>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="flex gap-1.5 justify-between">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-emerald-50 transition-all duration-150"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50/75 rounded-xl p-3 border border-red-100">
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className="w-full h-11 rounded-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Verify &amp; Enter</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
          
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="text-center pb-2 select-none z-10">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          ClinicFlow
        </p>
        <p className="text-[11px] text-gray-400 mt-1 font-medium">
          Digital patient records for modern clinics.
        </p>
      </footer>
    </div>
  );
}
