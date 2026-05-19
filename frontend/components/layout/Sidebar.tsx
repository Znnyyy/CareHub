"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Pill,
  ClipboardList,
  FileText,
  BarChart,
  LogOut,
  Activity
} from "lucide-react";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Pasien", path: "/patients", icon: Users },
    { label: "Dokter", path: "/doctors", icon: Stethoscope },
    { label: "Poliklinik", path: "/polyclinic", icon: Building2 },
    { label: "Obat", path: "/medicine", icon: Pill },
    { label: "Rekam Medis", path: "/medical-records", icon: ClipboardList },
    { label: "Resep", path: "/prescriptions", icon: FileText },
    { label: "Laporan", path: "/reports", icon: BarChart },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen">

      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">
          CareHub
        </span>
      </div>


      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-blue-600/10 text-blue-500"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>


      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold uppercase">
              {user?.username?.slice(0, 2) || "??"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || "Pengguna"}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">
              {user?.role || "Akses Terbatas"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
