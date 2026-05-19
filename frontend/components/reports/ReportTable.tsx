"use client";

import { Report } from "@/types";
import { TableLoading } from "@/components/ui/TableLoading";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

interface ReportTableProps {
  reports: Report[];
  loading: boolean;
  onDownload: (report: Report) => void;
  onDelete: (id: number) => void;
}

export function ReportTable({
  reports,
  loading,
  onDownload,
  onDelete,
}: ReportTableProps) {
  const typeLabels = {
    visit: "Kunjungan Pasien",
    medicine: "Persediaan Obat",
    diagnosis: "Rekap Diagnosa",
    patient: "Daftar Pasien",
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
              <th className="px-6 py-4">Judul Laporan</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Format</th>
              <th className="px-6 py-4">Periode</th>
              <th className="px-6 py-4">Dibuat Oleh</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {loading ? (
              <TableLoading colSpan={7} message="Memuat riwayat laporan..." color="blue" />
            ) : reports.length === 0 ? (
              <TableEmpty colSpan={7} message="Tidak ada riwayat laporan." icon={FileText} />
            ) : (
              reports.map((r) => {
                const isExcel = r.format === "xlsx";
                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {r.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {typeLabels[r.report_type] || r.report_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        isExcel
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                          : "bg-rose-50 text-rose-700 border-rose-200/50"
                      }`}>
                        {isExcel ? (
                          <>
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Excel
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            PDF
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(r.date_from)} - {formatDate(r.date_to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">
                      {r.generated_by_name || "Admin"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onDownload(r)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                          title="Unduh Laporan"
                        >
                          <Download className="w-4 h-4" />
                          Unduh
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
