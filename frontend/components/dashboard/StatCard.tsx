import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  sub: string;
  icon?: ReactNode;
  colorClass: string;
  bgClass: string;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  colorClass,
  bgClass,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-slate-400">{sub}</p>
    </div>
  );
}
