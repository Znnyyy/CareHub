"use client";

import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-8 md:p-16 font-sans select-none">
      {/* Header Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-600/25">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 text-sm tracking-tight">CareHub</span>
      </div>

      {/* Main Content */}
      <div className="max-w-xl my-auto py-12">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Status Error // 404</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 leading-tight">
          Halaman Belum Diaktifkan
        </h1>
        <p className="text-slate-500 text-sm md:text-base mb-8 max-w-md leading-relaxed">
          Menu yang Anda pilih saat ini belum di-route atau sedang dalam proses tahap integrasi pengembang sistem klinik CareHub.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-slate-900/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Footer Detail */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-slate-100 pt-6 text-[11px] font-medium text-slate-400">
        <div>CareHub Clinic Management System</div>
        <div className="font-mono">BUILD_VERSION: 1.0.0-PROD</div>
      </div>
    </div>
  );
}
