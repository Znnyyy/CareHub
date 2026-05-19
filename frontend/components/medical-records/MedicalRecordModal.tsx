"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { MedicalRecord, Patient, Doctor } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: MedicalRecord | null;
  onSuccess: () => void;
}

const defaultForm = {
  patient: "",
  doctor: "",
  visit_date: new Date().toISOString().split("T")[0],
  status: "waiting",
  complaint: "",
  diagnosis: "",
  notes: "",
  blood_pressure: "",
  weight: "",
  height: "",
  temperature: "",
};

export function MedicalRecordModal({
  isOpen,
  onClose,
  editData,
  onSuccess,
}: MedicalRecordModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchDoctors();
      if (editData) {
        setForm({
          patient: editData.patient.toString(),
          doctor: editData.doctor.toString(),
          visit_date: editData.visit_date,
          status: editData.status,
          complaint: editData.complaint || "",
          diagnosis: editData.diagnosis || "",
          notes: editData.notes || "",
          blood_pressure: editData.blood_pressure || "",
          weight: editData.weight?.toString() || "",
          height: editData.height?.toString() || "",
          temperature: editData.temperature?.toString() || "",
        });
      } else {
        setForm({
          ...defaultForm,
          visit_date: new Date().toISOString().split("T")[0],
        });
      }
      setError("");
    }
  }, [isOpen, editData]);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients/");
      setPatients(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors/");
      setDoctors(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        patient: parseInt(form.patient),
        doctor: parseInt(form.doctor),
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
      };

      if (editData) {
        await api.put(`/medical-records/${editData.id}/`, payload);
      } else {
        await api.post("/medical-records/", payload);
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
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {editData ? `Edit Rekam Medis - ${editData.record_number}` : "Buat Rekam Medis Baru"}
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

          <form id="med-record-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Pasien</label>
                <select
                  value={form.patient}
                  onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                >
                  <option value="">-- Pilih Pasien --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.nik})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Dokter Pemeriksa</label>
                <select
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                >
                  <option value="">-- Pilih Dokter --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tanggal Kunjungan</label>
                <input
                  type="date"
                  value={form.visit_date}
                  onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                >
                  <option value="waiting">Menunggu</option>
                  <option value="in_progress">Dalam Pemeriksaan</option>
                  <option value="done">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Tanda-tanda Vital</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Tekanan Darah (mmHg)</label>
                  <input
                    type="text"
                    value={form.blood_pressure}
                    onChange={(e) => setForm({ ...form, blood_pressure: e.target.value })}
                    placeholder="120/80"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="65.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    placeholder="170"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Suhu Tubuh (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                    placeholder="36.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Detail Pemeriksaan</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Keluhan Utama</label>
                <textarea
                  value={form.complaint}
                  onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                  required
                  rows={3}
                  placeholder="Keluhan yang dirasakan pasien..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Diagnosis</label>
                <textarea
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  rows={2}
                  placeholder="Diagnosis penyakit..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Catatan Tambahan / Tindakan</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Catatan terapi, saran obat, atau petunjuk medis lainnya..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none font-medium text-slate-800"
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
            form="med-record-form"
            loading={loading}
          >
            {editData ? "Simpan Perubahan" : "Simpan Rekam Medis"}
          </Button>
        </div>
      </div>
    </div>
  );
}
