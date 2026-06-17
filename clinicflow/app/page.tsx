import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-100 font-sans relative overflow-hidden noise">
      {/* Background radial gradients for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full glass-dark border-b border-zinc-800/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
                <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-base font-bold text-white tracking-tight">ClinicFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="h-8.5 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center"
            >
              Create Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            ✦ Digital Memory for Clinics
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Never lose a patient&apos;s <span className="gradient-text">case history</span> again.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
            The beautiful digital workspace built specifically for homeopathy practices. 
            Track modalities, physical generals, thermal states, and prescribe remedies with zero friction.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              href="/signin"
              className="h-12 px-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              Enter Workspace →
            </Link>
            <Link
              href="/signup"
              className="h-12 px-6 rounded-full border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
            >
              Setup New Clinic
            </Link>
          </div>
        </div>

        {/* Interactive Workspace Mockup SVG/CSS Dashboard Preview */}
        <div className="lg:col-span-6 w-full max-w-xl mx-auto">
          <div className="glass-dark border border-zinc-800 rounded-2xl shadow-2xl shadow-indigo-500/5 overflow-hidden p-4 space-y-4">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="w-44 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <span className="text-[9px] text-zinc-500 font-mono">search: ramesh kumar</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0" />
            </div>

            {/* Mock Dashboard Layout */}
            <div className="grid grid-cols-12 gap-3.5">
              {/* Left Column: Patient Case Sheet */}
              <div className="col-span-7 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-white leading-tight">Ramesh Kumar</h3>
                    <span className="text-[8px] text-zinc-500 font-semibold block mt-0.5">File #A-1001 · 56y</span>
                  </div>
                  <span className="text-[8px] bg-emerald-950/80 border border-emerald-900 text-emerald-400 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                    Active OP
                  </span>
                </div>

                {/* Case Sheet Generals */}
                <div className="space-y-1.5 pt-1.5 border-t border-zinc-800/40">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500 font-medium">Thermal State</span>
                    <strong className="text-sky-400 font-bold">Chilly</strong>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500 font-medium">Thirst</span>
                    <strong className="text-zinc-350">Large quantities</strong>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500 font-medium">Appetite</span>
                    <strong className="text-zinc-350">Feels heavy after meals</strong>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500 font-medium">Sleep</span>
                    <strong className="text-zinc-350">Wakes up at 3 AM</strong>
                  </div>
                </div>

                {/* Modalities tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[8px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                    Agg: Cold Damp Air
                  </span>
                  <span className="text-[8px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                    Amel: Motion, Warmth
                  </span>
                </div>
              </div>

              {/* Right Column: Prescription Slip */}
              <div className="col-span-5 flex flex-col gap-3">
                {/* Prescription slip */}
                <div className="bg-indigo-600/5 border border-dashed border-indigo-500/30 rounded-xl p-3 relative overflow-hidden flex-1 flex flex-col justify-between">
                  <span className="absolute -right-1.5 -bottom-3 text-4xl font-serif text-indigo-500/10 italic select-none font-bold">Rx</span>
                  <div>
                    <span className="text-[8px] text-indigo-400 font-bold block mb-1">CURRENT REMEDY</span>
                    <h4 className="text-[10px] font-bold text-white leading-tight">Rhus Tox</h4>
                    <span className="text-[9px] text-indigo-300 block font-semibold mt-0.5">1M Potency</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 font-semibold border-t border-zinc-800/40 pt-1.5 mt-2">
                    Dosage: 1 dose daily
                  </div>
                </div>

                {/* OP Status indicator */}
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[8px] text-zinc-500 font-bold block uppercase">OP Term</span>
                    <span className="text-[10px] text-amber-400 font-extrabold mt-0.5 block">Expiring in 4d</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 flex items-center justify-center text-[9px] text-amber-400 font-bold">
                    86%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10 border-t border-zinc-900 pt-16">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-white tracking-tight mb-12">
          Designed specifically for patient-centric care.
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Repertory */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 p-5 rounded-2xl space-y-3 card-hover">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white">Physical Generals</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              Track appetite, thirst, sleep disturbances, thermal state, and dreams inside structured patient files.
            </p>
          </div>

          {/* Rx Pad */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 p-5 rounded-2xl space-y-3 card-hover">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white">Remedy Prescriptions</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              Specify remedies, potencies (LM/Centesimal), and dosages. Generate beautiful printable prescription sheets.
            </p>
          </div>

          {/* OP Renew */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 p-5 rounded-2xl space-y-3 card-hover">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white">OP Renewals</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              Never miss expiring outpatient terms. Dashboard follow-up board highlights expired terms with quick contact keys.
            </p>
          </div>

          {/* Fast Search */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 p-5 rounded-2xl space-y-3 card-hover">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white">Cmd+K Spotlight</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              Launch search spotlight anywhere in the app to search patients by custom file number, name, or phone.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 py-6 text-center text-zinc-500 text-[11px] font-semibold relative z-10">
        ClinicFlow &copy; {new Date().getFullYear()} · All rights reserved.
      </footer>
    </main>
  );
}
