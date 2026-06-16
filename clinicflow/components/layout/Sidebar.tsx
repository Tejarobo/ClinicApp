"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Doctors", href: "/doctors", icon: Stethoscope },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [session, setSession] = useState<{ name: string; role: string; phone: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Load session in CSR
    const val = localStorage.getItem("cf_session");
    if (val) {
      setSession(JSON.parse(val));
    } else {
      // Default fallback
      setSession({ name: "Dr. Arjun Mehta", role: "doctor", phone: "9876543210" });
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("cf_session");
    router.push("/login");
  }

  const roleLabelMap: Record<string, string> = {
    doctor: "Doctor",
    receptionist: "Receptionist",
    admin: "Admin User",
  };

  const roleColorMap: Record<string, string> = {
    doctor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    receptionist: "bg-blue-50 text-blue-700 border-blue-100",
    admin: "bg-purple-50 text-purple-700 border-purple-100",
  };

  const nameInitials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#E6EFEA] transition-all duration-300 ease-in-out ${
        collapsed ? "w-[76px]" : "w-[250px]"
      } min-h-screen shrink-0 font-sans`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-[#E6EFEA] ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="flex-shrink-0 w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center shadow-md shadow-emerald-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
            <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-gray-900 tracking-tight">ClinicFlow</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 h-11 px-3.5 rounded-2xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-emerald-50 text-[#10B981] border border-emerald-100/50"
                  : "text-gray-500 hover:text-gray-950 hover:bg-[#F4F7F5]/60 border border-transparent"
              } ${collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  active ? "text-[#10B981]" : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User Details & Collapse */}
      <div className="border-t border-[#E6EFEA] p-3.5 space-y-3">
        {/* User Card */}
        {session && (
          <div className={`flex items-center gap-3 p-1.5 rounded-2xl bg-slate-50/50 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {nameInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{session.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${roleColorMap[session.role] || "bg-gray-100 text-gray-600"}`}>
                    {roleLabelMap[session.role] || session.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-1.5">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center h-9 px-3.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition-all duration-150 text-sm ${
              collapsed ? "justify-center" : "gap-3"
            }`}
            title="Log out"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span className="font-medium">Sign out</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center h-9 px-3.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-[#F4F7F5]/80 transition-all duration-150 text-sm ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            {collapsed ? (
              <ChevronRight size={16} className="shrink-0" />
            ) : (
              <>
                <ChevronLeft size={16} className="shrink-0" />
                <span className="font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
