"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Polyclinic } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PolyclinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: Polyclinic | null;
  onSuccess: () => void;
}

const defaultForm = {
  code: "",
  name: "",
  description: "",
  floor: "1",
  is_active: true,
};

export function PolyclinicModal({
  isOpen,
  onClose,
  editData,
  onSuccess,
}: PolyclinicModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          code: editData.code,
          name: editData.name,
          description: editData.description || "",
          floor: editData.floor || "1",
          is_active: editData.is_active,
        });
      } else {
        setForm(defaultForm);
      }
      setError("");
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editData) {
        await api.put(`/polyclinic/${editData.id}/`, form);
      } else {
        await api.post("/polyclinic/", form);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Terjadi kesalahan saat menyimpan data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {editData ? "Edit Poliklinik" : "Tambah Poliklinik Baru"}
          </h2>
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

          <form id="polyclinic-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Kode Poliklinik</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                placeholder="Contoh: POL-UMU, POL-GIG"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Nama Poliklinik</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Contoh: Poliklinik Umum"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Lantai Lokasi</label>
              <input
                type="text"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                required
                placeholder="Contoh: 1, 2, atau Basement"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Deskripsi (Opsional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Penjelasan singkat lokasi/tujuan poli"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-700">Status Aktif (Tersedia untuk rujukan & pendaftaran)</span>
              </label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="polyclinic-form"
            loading={loading}
          >
            {editData ? "Simpan Perubahan" : "Tambah Poliklinik"}
          </Button>
        </div>
      </div>
    </div>
  );
}
