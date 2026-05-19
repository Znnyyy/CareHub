"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Patient } from "@/types";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: Patient | null;
  onSuccess: () => void;
}

const defaultForm = {
  nik: "",
  full_name: "",
  gender: "M",
  birth_date: "",
  blood_type: "",
  address: "",
  phone: "",
  emergency_contact: "",
};

export function PatientModal({
  isOpen,
  onClose,
  editData,
  onSuccess,
}: PatientModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          nik: editData.nik,
          full_name: editData.full_name,
          gender: editData.gender,
          birth_date: editData.birth_date,
          blood_type: editData.blood_type || "",
          address: editData.address,
          phone: editData.phone,
          emergency_contact: editData.emergency_contact || "",
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
        await api.put(`/patients/${editData.id}/`, form);
      } else {
        await api.post("/patients/", form);
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
            {editData ? "Edit Data Pasien" : "Tambah Pasien Baru"}
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

          <form id="patient-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">NIK</label>
                <input
                  type="text"
                  value={form.nik}
                  onChange={(e) => setForm({ ...form, nik: e.target.value })}
                  required
                  maxLength={16}
                  placeholder="16 digit NIK"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  required
                  placeholder="Nama lengkap pasien"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                >
                  <option value="M">Laki-laki</option>
                  <option value="F">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tanggal Lahir</label>
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={(e) =>
                    setForm({ ...form, birth_date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Golongan Darah</label>
                <select
                  value={form.blood_type}
                  onChange={(e) =>
                    setForm({ ...form, blood_type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                >
                  <option value="">Tidak diketahui</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">No. HP</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Alamat Lengkap</label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                  rows={3}
                  placeholder="Alamat lengkap tempat tinggal"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Kontak Darurat (Opsional)</label>
                <input
                  type="text"
                  value={form.emergency_contact}
                  onChange={(e) =>
                    setForm({ ...form, emergency_contact: e.target.value })
                  }
                  placeholder="No. HP keluarga/kerabat"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
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
            form="patient-form"
            loading={loading}
          >
            {editData ? "Simpan Perubahan" : "Tambah Pasien"}
          </Button>
        </div>
      </div>
    </div>
  );
}
