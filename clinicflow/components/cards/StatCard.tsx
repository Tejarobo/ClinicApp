import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: "blue" | "green" | "amber" | "red" | "purple";
  suffix?: string;
}

const colorMap = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
  },
  red: {
    icon: "bg-red-50 text-red-600",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
  suffix,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-gray-100 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.icon}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trendUp
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          {suffix && <span className="text-sm font-medium text-gray-500 mr-1">{suffix}</span>}
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
