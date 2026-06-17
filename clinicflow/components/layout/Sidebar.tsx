"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [session, setSession] = useState<{ name: string; role: string; phone: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const val = localStorage.getItem("cf_session");
    if (val) {
      setSession(JSON.parse(val));
    } else {
      setSession({ name: "Dr. Arjun Mehta", role: "doctor", phone: "9876543210" });
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("cf_session");
    router.push("/signin");
  }

  const nameInitials = session?.name
    ? session.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DR";

  return (
    <aside
      className={`relative flex flex-col border-r transition-all duration-200 ease-in-out min-h-screen shrink-0 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--sidebar-border)" }}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-[60px] px-4 border-b ${
          collapsed ? "justify-center" : "gap-2.5"
        }`}
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-900/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" fillOpacity="0.95" />
            <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-[15px] font-bold text-white tracking-tight">
            ClinicFlow
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`sidebar-nav-item ${active ? "active" : ""} ${
                collapsed ? "justify-center px-0 w-10 h-10 mx-auto" : ""
              }`}
            >
              <Icon
                size={17}
                className={`shrink-0 ${active ? "text-indigo-400" : "text-zinc-600"}`}
              />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User + Controls */}
      <div
        className="border-t px-3 py-3 space-y-2"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        {/* User info */}
        {session && !collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
              {nameInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-zinc-200 truncate leading-tight">
                {session.name}
              </p>
              <p className="text-[11px] text-zinc-600 mt-0.5 truncate">
                {session.phone ? `+91 ${session.phone.slice(0, 5)}·····` : "Staff"}
              </p>
            </div>
          </div>
        )}

        {/* User avatar when collapsed */}
        {session && collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
              {nameInitials}
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`w-full flex items-center h-9 px-3 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 text-[13px] font-medium cursor-pointer ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-full flex items-center h-9 px-3 rounded-xl text-zinc-700 hover:text-zinc-300 hover:bg-white/5 transition-all duration-150 text-[13px] font-medium cursor-pointer ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={15} className="shrink-0" />
          ) : (
            <div className="flex items-center gap-2.5">
              <PanelLeftClose size={15} className="shrink-0" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
