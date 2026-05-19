"use client";

import { Prescription } from "@/types";
import { TableLoading } from "@/components/ui/TableLoading";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { Eye, CheckCircle2, XCircle } from "lucide-react";

interface PrescriptionTableProps {
  prescriptions: Prescription[];
  loading: boolean;
  onViewDetails: (prescription: Prescription) => void;
  onDispense: (id: number) => void;
  onCancel: (id: number) => void;
}

export function PrescriptionTable({
  prescriptions,
  loading,
  onViewDetails,
  onDispense,
  onCancel,
}: PrescriptionTableProps) {
  const statusConfig = {
    pending: {
      label: "Menunggu",
      classes: "bg-amber-50 text-amber-700 border-amber-200/50",
    },
    dispensed: {
      label: "Sudah Diberikan",
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
        hour: "2-digit",
        minute: "2-digit",
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
              <th className="px-6 py-4">Nama Pasien</th>
              <th className="px-6 py-4">Dokter</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoading colSpan={6} message="Memuat data resep..." color="blue" />
            ) : prescriptions.length === 0 ? (
              <TableEmpty colSpan={6} message="Tidak ada data resep ditemukan." icon={CheckCircle2} />
            ) : (
              prescriptions.map((p) => {
                const status = statusConfig[p.status] || {
                  label: p.status,
                  classes: "bg-slate-50 text-slate-600 border-slate-200/50",
                };

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors text-sm text-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-900 font-semibold">
                      {p.record_number || `RM ID: ${p.medical_record}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {p.patient_name || "Pasien"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {p.doctor_name ? `Dr. ${p.doctor_name}` : "Dokter"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(p)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Detail Resep"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {p.status === "pending" && (
                          <>
                            <button
                              onClick={() => onDispense(p.id)}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Serahkan Obat"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onCancel(p.id)}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Batalkan Resep"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
