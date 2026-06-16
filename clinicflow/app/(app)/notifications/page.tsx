"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Send,
  RotateCcw,
  Clock,
  Sparkles,
  Search,
  MessageSquare,
  Smartphone,
  Trash2
} from "lucide-react";
import {
  getStoredNotifications,
  simulateCronJob,
  processNotificationQueue,
  saveNotifications,
  defaultNotifications
} from "@/lib/mock-data";
import type { Notification } from "@/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "sent" | "failed">("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function loadData() {
    setNotifications(getStoredNotifications());
  }

  useEffect(() => {
    loadData();
    // Poll data occasionally for reactive updates
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  function handleTriggerCron() {
    const count = simulateCronJob();
    loadData();
    if (count > 0) {
      showToast(`Background Cron Executed: Queued ${count} new OP Expiry reminder(s).`);
    } else {
      showToast("Background Cron Executed: No new expiring OPs found today.");
    }
  }

  function handleProcessQueue() {
    const count = processNotificationQueue();
    loadData();
    if (count > 0) {
      showToast(`Processed Queue: Delivered ${count} SMS/WhatsApp reminder(s) successfully!`);
    } else {
      showToast("Processed Queue: No pending reminders to send.");
    }
  }

  function handleResetLogs() {
    if (confirm("Reset notifications back to default demo state?")) {
      saveNotifications(defaultNotifications);
      loadData();
      showToast("Notifications reset to default demo logs.");
    }
  }

  function handleClearAll() {
    if (confirm("Clear all notification logs permanently?")) {
      saveNotifications([]);
      loadData();
      showToast("Cleared all notification records.");
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  // Filter list
  const filtered = notifications.filter((n) => {
    // Tab match
    if (activeTab === "pending" && n.status !== "pending") return false;
    if (activeTab === "sent" && n.status !== "sent") return false;
    if (activeTab === "failed" && n.status !== "failed") return false;
    
    // Keyword match
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      n.patient_name.toLowerCase().includes(q) ||
      n.patient_phone.includes(q) ||
      n.message.toLowerCase().includes(q)
    );
  });

  const typeIconMap: Record<string, React.ElementType> = {
    op_expiry: Bell,
    appointment: MessageSquare,
    token: Smartphone,
    report: MessageSquare
  };

  const typeLabelMap: Record<string, string> = {
    op_expiry: "OP Expiry Alert",
    appointment: "Appointment SMS",
    token: "Token Queue",
    report: "Report Ready"
  };

  const typeColorMap: Record<string, string> = {
    op_expiry: "bg-amber-50 text-amber-700 border-amber-100",
    appointment: "bg-blue-50 text-blue-700 border-blue-100",
    token: "bg-purple-50 text-purple-700 border-purple-100",
    report: "bg-teal-50 text-teal-700 border-teal-100",
  };

  const statusBadgeColor: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    sent: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    failed: "bg-red-50 text-red-500 border border-red-200",
  };

  const statusLabelMap: Record<string, string> = {
    pending: "Queued",
    sent: "Delivered",
    failed: "Failed",
  };

  return (
    <div className="space-y-6 pb-12 font-sans relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-semibold shadow-lg border border-gray-800 animate-fade-in">
          <Sparkles size={14} className="text-[#10B981] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Notification Logs</h1>
          <p className="text-xs text-[#627A70] mt-0.5">Track faked WhatsApp &amp; SMS clinical reminders queue</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTriggerCron}
            className="flex items-center gap-1.5 h-10 px-4 rounded-full border border-emerald-100 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-emerald-800 text-xs font-bold transition-all shadow-sm"
            title="Scan active OPs and queue tomorrow's reminders"
          >
            <Clock size={13} />
            <span>Simulate Cron Job</span>
          </button>
          
          <button
            onClick={handleProcessQueue}
            className="flex items-center gap-1.5 h-10 px-4 rounded-full border border-blue-100 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-blue-800 text-xs font-bold transition-all shadow-sm"
            title="Process pending reminders queue"
          >
            <Send size={13} />
            <span>Process Queue</span>
          </button>

          <button
            onClick={handleResetLogs}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700"
            title="Reset to default demo logs"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={handleClearAll}
            className="w-9 h-9 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700"
            title="Clear all notification records"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Tabs and search query */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100/80 rounded-full border border-gray-200/50 max-w-sm">
          {(["all", "pending", "sent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 h-8 px-4 rounded-full text-xs font-bold transition-all capitalize ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab === "sent" ? "Delivered" : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search reminders..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-full border border-[#E6EFEA] bg-white text-xs text-gray-900 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-400"
          />
          <Search size={13} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Logs list */}
      <div className="bg-white rounded-[24px] border border-[#E6EFEA] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400 font-bold">No reminders scheduled</p>
            <p className="text-xs text-gray-400 mt-1">
              {query ? "No logs match the current search keyword." : "Click 'Simulate Cron Job' to generate reminders automatically."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E6EFEA]">
            {filtered.map((item) => {
              const Icon = typeIconMap[item.type] || Bell;
              
              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-start justify-between gap-4 px-6 py-4.5 hover:bg-[#F4F7F5]/25 transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${typeColorMap[item.type] || "bg-gray-100 text-gray-600"}`}>
                      <Icon size={16} />
                    </div>
                    
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 leading-snug">
                          {item.patient_name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          +91 {item.patient_phone}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-300"/>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${typeColorMap[item.type]}`}>
                          {typeLabelMap[item.type]}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 border border-gray-100 p-3 rounded-2xl font-medium">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 flex-shrink-0 border-t md:border-0 pt-2 md:pt-0">
                    <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full ${statusBadgeColor[item.status]}`}>
                      {statusLabelMap[item.status]}
                    </span>
                    
                    <div className="text-right text-[10px] text-gray-400">
                      <span className="block">Scheduled: {new Date(item.scheduled_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
                      {item.sent_at && (
                        <span className="block text-emerald-600 font-medium mt-0.5">Delivered: {new Date(item.sent_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
