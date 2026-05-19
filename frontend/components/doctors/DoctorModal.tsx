"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Doctor, Polyclinic } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: Doctor | null;
  onSuccess: () => void;
}

const defaultForm = {
  nip: "",
  full_name: "",
  specialization: "",
  polyclinic: "",
  phone: "",
  email: "",
  schedule_day: "senin",
  schedule_start: "08:00",
  schedule_end: "14:00",
  quota: 20,
  is_active: true,
};

export function DoctorModal({
  isOpen,
  onClose,
  editData,
  onSuccess,
}: DoctorModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [polyclinics, setPolyclinics] = useState<Polyclinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPolyclinics();
      if (editData) {
        setForm({
          nip: editData.nip,
          full_name: editData.full_name,
          specialization: editData.specialization,
          polyclinic: editData.polyclinic?.toString() || "",
          phone: editData.phone,
          email: editData.email || "",
          schedule_day: editData.schedule_day,
          schedule_start: editData.schedule_start?.slice(0, 5) || "08:00",
          schedule_end: editData.schedule_end?.slice(0, 5) || "14:00",
          quota: editData.quota,
          is_active: editData.is_active,
        });
      } else {
        setForm(defaultForm);
      }
      setError("");
    }
  }, [isOpen, editData]);

  const fetchPolyclinics = async () => {
    try {
      const res = await api.get("/polyclinic/");
      setPolyclinics(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch polyclinics", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        polyclinic: form.polyclinic ? parseInt(form.polyclinic) : null,
      };

      if (editData) {
        await api.put(`/doctors/${editData.id}/`, payload);
      } else {
        await api.post("/doctors/", payload);
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
            {editData ? "Edit Data Dokter" : "Tambah Dokter Baru"}
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

          <form id="doctor-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">NIP</label>
                <input
                  type="text"
                  value={form.nip}
                  onChange={(e) => setForm({ ...form, nip: e.target.value })}
                  required
                  placeholder="Nomor Induk Pegawai"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  required
                  placeholder="dr. Nama Lengkap, Sp.X"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Spesialisasi</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                  required
                  placeholder="Contoh: Dokter Umum"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Poliklinik</label>
                <select
                  value={form.polyclinic}
                  onChange={(e) =>
                    setForm({ ...form, polyclinic: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                >
                  <option value="">-- Pilih Poliklinik --</option>
                  {polyclinics.map((poly) => (
                    <option key={poly.id} value={poly.id}>
                      {poly.name}
                    </option>
                  ))}
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="dokter@contoh.com (opsional)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Hari Praktik</label>
                <select
                  value={form.schedule_day}
                  onChange={(e) =>
                    setForm({ ...form, schedule_day: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                >
                  <option value="senin">Senin</option>
                  <option value="selasa">Selasa</option>
                  <option value="rabu">Rabu</option>
                  <option value="kamis">Kamis</option>
                  <option value="jumat">Jumat</option>
                  <option value="sabtu">Sabtu</option>
                  <option value="minggu">Minggu</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Jam Mulai</label>
                  <input
                    type="time"
                    value={form.schedule_start}
                    onChange={(e) =>
                      setForm({ ...form, schedule_start: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Jam Selesai</label>
                  <input
                    type="time"
                    value={form.schedule_end}
                    onChange={(e) =>
                      setForm({ ...form, schedule_end: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Kuota Harian</label>
                <input
                  type="number"
                  min={1}
                  value={form.quota}
                  onChange={(e) =>
                    setForm({ ...form, quota: parseInt(e.target.value) || 0 })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Status Aktif
                  </span>
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
            form="doctor-form"
            loading={loading}
          >
            {editData ? "Simpan Perubahan" : "Tambah Dokter"}
          </Button>
        </div>
      </div>
    </div>
  );
}
