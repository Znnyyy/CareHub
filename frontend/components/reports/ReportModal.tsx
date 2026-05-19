"use client";

import { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    report_type: string;
    format: string;
    date_from: string;
    date_to: string;
  }) => Promise<void>;
  loading: boolean;
}

const getFirstDayOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
};

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const defaultForm = {
  title: "",
  report_type: "visit",
  format: "pdf",
  date_from: getFirstDayOfMonth(),
  date_to: getToday(),
};

export function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: ReportModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  const typeLabels: Record<string, string> = {
    visit: "Laporan Kunjungan Pasien",
    medicine: "Laporan Persediaan Obat",
    diagnosis: "Laporan Rekap Diagnosa",
    patient: "Laporan Daftar Pasien",
  };

  // Auto-generate title when parameters change
  useEffect(() => {
    if (isOpen) {
      const typeLabel = typeLabels[form.report_type] || "Laporan";
      const formattedFrom = form.date_from.split("-").reverse().join("/");
      const formattedTo = form.date_to.split("-").reverse().join("/");
      setForm((f) => ({
        ...f,
        title: `${typeLabel} (${formattedFrom} - ${formattedTo})`,
      }));
    }
  }, [form.report_type, form.date_from, form.date_to, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: "",
        report_type: "visit",
        format: "pdf",
        date_from: getFirstDayOfMonth(),
        date_to: getToday(),
      });
      setError("");
    }
  }, [isOpen]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (new Date(form.date_from) > new Date(form.date_to)) {
      setError("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
      return;
    }

    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal membuat laporan.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Buat Dokumen Laporan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
              {error}
            </div>
          )}

          <form id="report-generator-form" onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Tipe Laporan</label>
              <select
                value={form.report_type}
                onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
              >
                <option value="visit">Laporan Kunjungan Pasien</option>
                <option value="medicine">Laporan Persediaan Obat</option>
                <option value="patient">Laporan Daftar Pasien</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Format Dokumen</label>
              <select
                value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
              >
                <option value="pdf">Portable Document Format (PDF)</option>
                <option value="xlsx">Spreadsheet Excel (XLSX)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tanggal Mulai</label>
                <input
                  type="date"
                  value={form.date_from}
                  onChange={(e) => setForm({ ...form, date_from: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tanggal Selesai</label>
                <input
                  type="date"
                  value={form.date_to}
                  onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-semibold text-slate-700">Judul Dokumen (Otomatis)</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Judul laporan"
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-semibold text-slate-800"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="report-generator-form"
            loading={loading}
          >
            Buat Laporan
          </Button>
        </div>
      </div>
    </div>
  );
}
