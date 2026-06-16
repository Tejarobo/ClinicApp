"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { getStoredNotifications } from "@/lib/mock-data";
import SpotlightSearch from "@/components/layout/SpotlightSearch";
import Link from "next/link";

export default function Header() {
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem("cf_session");
    if (val) {
      setSession(JSON.parse(val));
    }
  }, []);

  useEffect(() => {
    // Dynamic pending notifications count
    const notes = getStoredNotifications();
    setPendingCount(notes.filter((n) => n.status === "pending").length);
    
    const interval = setInterval(() => {
      const latest = getStoredNotifications();
      setPendingCount(latest.filter((n) => n.status === "pending").length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-6 bg-white/90 backdrop-blur border-b border-[#E6EFEA] font-sans">
        {/* Spotlight Trigger Search Bar */}
        <div 
          onClick={() => setIsSpotlightOpen(true)}
          className="flex-1 max-w-md cursor-pointer"
        >
          <div className="flex items-center gap-3 h-10 rounded-full border border-[#E6EFEA] bg-[#F8FAF9] px-4 hover:border-[#10B981] hover:bg-white transition-all duration-150">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-400 select-none">
              Search file number, name, phone...
            </span>
            <kbd className="h-5 px-1.5 rounded bg-gray-100 border border-gray-200 text-[10px] text-gray-400 font-mono flex items-center justify-center select-none shadow-sm shrink-0">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex-1" />

        {/* Notification bell */}
        <Link
          href="/notifications"
          className="relative w-9 h-9 rounded-xl border border-[#E6EFEA] flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-[#F4F7F5]/60 transition-all duration-150"
        >
          <Bell size={16} />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
              {pendingCount}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer shrink-0">
          {initials}
        </div>
      </header>

      {/* Spotlight Command Modal */}
      <SpotlightSearch 
        isOpen={isSpotlightOpen} 
        onClose={() => setIsSpotlightOpen(false)} 
      />
    </>
  );
}
