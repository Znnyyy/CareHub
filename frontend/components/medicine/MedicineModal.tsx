"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Medicine } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: Medicine | null;
  onSuccess: () => void;
}

const defaultForm = {
  code: "",
  name: "",
  generic_name: "",
  category: "",
  unit: "tablet",
  stock: 0,
  min_stock: 10,
  price: "",
  is_active: true,
};

export function MedicineModal({
  isOpen,
  onClose,
  editData,
  onSuccess,
}: MedicineModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          code: editData.code,
          name: editData.name,
          generic_name: editData.generic_name || "",
          category: editData.category,
          unit: editData.unit,
          stock: editData.stock,
          min_stock: editData.min_stock,
          price: editData.price,
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
        await api.put(`/medicine/${editData.id}/`, form);
      } else {
        await api.post("/medicine/", form);
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
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {editData ? "Edit Data Obat" : "Tambah Obat Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
              {error}
            </div>
          )}

          <form id="medicine-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Kode Obat</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                  placeholder="Contoh: OB-001"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Obat</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Nama merek obat"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Generik (Opsional)</label>
                <input
                  type="text"
                  value={form.generic_name}
                  onChange={(e) => setForm({ ...form, generic_name: e.target.value })}
                  placeholder="Kandungan kimia aktif"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Kategori</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  placeholder="Contoh: Antibiotik, Analgesik"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Satuan</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                >
                  <option value="tablet">Tablet</option>
                  <option value="kapsul">Kapsul</option>
                  <option value="botol">Botol / Sirup</option>
                  <option value="tube">Tube / Salep</option>
                  <option value="strip">Strip</option>
                  <option value="ampul">Ampul</option>
                  <option value="sachet">Sachet</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Harga Jual (Rp)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  placeholder="Contoh: 15000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Jumlah Stok</label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Minimum Stok Peringatan</label>
                <input
                  type="number"
                  min={1}
                  value={form.min_stock}
                  onChange={(e) => setForm({ ...form, min_stock: parseInt(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-center md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">Status Aktif (Tersedia untuk Resep)</span>
                </label>
              </div>
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
            form="medicine-form"
            loading={loading}
          >
            {editData ? "Simpan Perubahan" : "Tambah Obat"}
          </Button>
        </div>
      </div>
    </div>
  );
}
