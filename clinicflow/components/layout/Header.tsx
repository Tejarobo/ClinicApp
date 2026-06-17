"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import SpotlightSearch from "@/components/layout/SpotlightSearch";

export default function Header() {
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem("cf_session");
    if (val) setSession(JSON.parse(val));
  }, []);

  // Cmd+K / Ctrl+K to open spotlight
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const initials = session?.name
    ? session.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DR";

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 h-[60px] px-4 sm:px-6 bg-white/90 backdrop-blur-xl border-b border-zinc-200/60">
        {/* Search — always full-width on left */}
        <button
          onClick={() => setIsSpotlightOpen(true)}
          className="flex-1 max-w-xl flex items-center gap-3 h-9 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 hover:border-zinc-300 hover:bg-white transition-all duration-150 cursor-pointer text-left"
        >
          <Search size={14} className="text-zinc-400 flex-shrink-0" />
          <span className="flex-1 text-[13px] text-zinc-400 select-none">
            Search patients, files, visits...
          </span>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="h-5 min-w-[20px] px-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-400 font-mono flex items-center justify-center">
              ⌘
            </kbd>
            <kbd className="h-5 min-w-[20px] px-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-400 font-mono flex items-center justify-center">
              K
            </kbd>
          </div>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[13px] font-bold shadow-sm cursor-pointer shrink-0">
          {initials}
        </div>
      </header>

      {/* Spotlight modal */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />
    </>
  );
}
