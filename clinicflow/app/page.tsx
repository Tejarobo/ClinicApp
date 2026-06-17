import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-12 font-sans text-center relative overflow-hidden">
      {/* Subtle background blur decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[260px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main container */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-950/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
              <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-zinc-900 tracking-tight">ClinicFlow</span>
        </div>

        {/* Hero Copy */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight sm:text-4xl">
            Never lose a patient&apos;s history again.
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
            Modern, secure, and blazing fast digital records for homeopathy clinics.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/signin"
            className="h-11 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center shadow-md shadow-indigo-100 cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="h-11 px-6 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
          >
            Create Clinic
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-zinc-400 text-[11px] font-semibold">
        ClinicFlow &copy; {new Date().getFullYear()} · All rights reserved.
      </div>
    </main>
  );
}
