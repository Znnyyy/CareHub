"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";

interface VisitRecord {
  id: number;
  record_number: string;
  patient_name: string;
  doctor_name: string;
  polyclinic_name: string;
  status: "waiting" | "in_progress" | "done" | "cancelled";
}

interface TodayVisitsTableProps {
  records: VisitRecord[];
}

const statusConfig = {
  waiting: { label: "Menunggu", styles: "bg-amber-100 text-amber-700" },
  in_progress: { label: "Pemeriksaan", styles: "bg-blue-100 text-blue-700" },
  done: { label: "Selesai", styles: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Dibatalkan", styles: "bg-rose-100 text-rose-700" },
};

export function TodayVisitsTable({ records }: TodayVisitsTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Kunjungan Hari Ini
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Daftar pasien yang terdaftar hari ini
          </p>
        </div>
        <button
          onClick={() => router.push("/medical-records")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors group"
        >
          Lihat semua
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <FileText className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Belum ada kunjungan hari ini</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  No. Rekam Medis
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">Pasien</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Dokter</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Poliklinik</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">
                    {r.record_number}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {r.patient_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    Dr. {r.doctor_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {r.polyclinic_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        statusConfig[r.status].styles
                      }`}
                    >
                      {statusConfig[r.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
