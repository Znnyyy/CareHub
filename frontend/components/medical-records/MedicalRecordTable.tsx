"use client";

import { MedicalRecord } from "@/types";
import { TableLoading } from "@/components/ui/TableLoading";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { Edit2, Trash2, ClipboardList } from "lucide-react";

interface MedicalRecordTableProps {
  records: MedicalRecord[];
  loading: boolean;
  onEdit: (record: MedicalRecord) => void;
  onDelete: (id: number) => void;
}

export function MedicalRecordTable({
  records,
  loading,
  onEdit,
  onDelete,
}: MedicalRecordTableProps) {
  const statusConfig = {
    waiting: {
      label: "Menunggu",
      classes: "bg-amber-50 text-amber-700 border-amber-200/50",
    },
    in_progress: {
      label: "Pemeriksaan",
      classes: "bg-blue-50 text-blue-700 border-blue-200/50",
    },
    done: {
      label: "Selesai",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    },
    cancelled: {
      label: "Batal",
      classes: "bg-slate-50 text-slate-600 border-slate-200/50",
    },
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">No. RM</th>
              <th className="px-6 py-4">Pasien</th>
              <th className="px-6 py-4">Dokter & Poli</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Diagnosis</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoading colSpan={7} message="Memuat data rekam medis..." color="blue" />
            ) : records.length === 0 ? (
              <TableEmpty colSpan={7} message="Tidak ada data rekam medis ditemukan." icon={ClipboardList} />
            ) : (
              records.map((r) => {
                const status = statusConfig[r.status] || {
                  label: r.status,
                  classes: "bg-slate-50 text-slate-600 border-slate-200/50",
                };

                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors text-sm text-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-900 font-semibold">
                      {r.record_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {r.patient_name || `ID: ${r.patient}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {r.doctor_name || `ID: ${r.doctor}`}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {r.polyclinic_name || "Poliklinik"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(r.visit_date)}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {r.diagnosis || <span className="text-slate-400 italic">Belum diperiksa</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(r)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit / Detail"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(r.id)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
