"use client";

import { useEffect, useState } from "react";
import { User, Bell, Shield, Sparkles, Check } from "lucide-react";

export default function SettingsPage() {
  const [session] = useState<{ name: string; role: string; phone: string } | null>(() => {
    const val = localStorage.getItem("cf_session");
    return val ? JSON.parse(val) : null;
  });
  
  // Settings values
  const [clinicName, setClinicName] = useState("Dr. Arjun Mehta's Clinic");
  const [opValidity, setOpValidity] = useState("30");
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [channelSms, setChannelSms] = useState(true);

  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 pb-12 font-sans max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-[25px] font-extrabold text-gray-900 tracking-tight">Clinical Settings</h1>
        <p className="text-xs text-[#627A70] mt-0.5">Manage operating system preferences and notification triggers</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
          <Check size={14} className="text-[#10B981]" />
          <span>Settings successfully saved!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Clinic Profile */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E6EFEA]">
            <User size={16} className="text-[#10B981]" />
            <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Clinic Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinic Name</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Logged In As</label>
                <div className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500 flex items-center capitalize">
                  {session?.name || "Dr. Arjun Mehta"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Role</label>
                <div className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500 flex items-center capitalize">
                  {session?.role || "doctor"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical OP Parameters */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E6EFEA]">
            <Shield size={16} className="text-[#10B981]" />
            <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Medical OP parameters</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Default OP Validity (Days)</label>
            <select
              value={opValidity}
              onChange={(e) => setOpValidity(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-[#E6EFEA] bg-[#F8FAF9] text-sm text-gray-900 outline-none focus:border-[#10B981] focus:bg-white transition-all"
            >
              <option value="7">7 Days (Short follow-up)</option>
              <option value="15">15 Days (Medium follow-up)</option>
              <option value="30">30 Days (Standard term)</option>
              <option value="90">90 Days (Long chronic term)</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-2 font-medium">New patient files registered will inherit this default OP validity duration.</p>
          </div>
        </div>

        {/* Section 3: Notification Channels Preferences */}
        <div className="bg-white rounded-[24px] border border-[#E6EFEA] p-6.5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E6EFEA]">
            <Bell size={16} className="text-[#10B981]" />
            <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Notification Channels</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-gray-900 leading-snug">WhatsApp Reminders</span>
                <span className="block text-xs text-gray-400 mt-0.5">Send faked reminders to WhatsApp (via Twilio/Meta API)</span>
              </div>
              <input
                type="checkbox"
                checked={channelWhatsapp}
                onChange={(e) => setChannelWhatsapp(e.target.checked)}
                className="w-5 h-5 accent-[#10B981]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#E6EFEA] pt-4">
              <div>
                <span className="block text-sm font-bold text-gray-900 leading-snug">SMS Text Messages</span>
                <span className="block text-xs text-gray-400 mt-0.5">Send faked SMS reminders (via MSG91/Twilio)</span>
              </div>
              <input
                type="checkbox"
                checked={channelSms}
                onChange={(e) => setChannelSms(e.target.checked)}
                className="w-5 h-5 accent-[#10B981]"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex">
          <button
            type="submit"
            className="h-12 px-8 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
