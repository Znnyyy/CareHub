"use client";

import { Prescription } from "@/types";
import { X, Pill, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PrescriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onDispense: (id: number) => void;
  onCancel: (id: number) => void;
  actionLoading: boolean;
}

export function PrescriptionDetailModal({
  isOpen,
  onClose,
  prescription,
  onDispense,
  onCancel,
  actionLoading,
}: PrescriptionDetailModalProps) {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Detail Resep Obat
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">No. Rekam Medis</p>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{prescription.record_number}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Nama Pasien</p>
              <p className="font-semibold text-slate-900 mt-0.5">{prescription.patient_name || "Pasien"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Dokter Pengirim</p>
              <p className="font-semibold text-slate-900 mt-0.5">Dr. {prescription.doctor_name || "Dokter"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Status Resep</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${
                prescription.status === "dispensed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : prescription.status === "cancelled"
                  ? "bg-slate-50 text-slate-600 border-slate-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {prescription.status === "dispensed"
                  ? "Sudah Diberikan"
                  : prescription.status === "cancelled"
                  ? "Batal"
                  : "Menunggu Penyerahan"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Rincian Obat</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                    <th className="px-4 py-3">Nama Obat</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3">Dosis / Aturan Pakai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {prescription.details && prescription.details.length > 0 ? (
                    prescription.details.map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-3 text-slate-900 font-semibold">
                          {d.medicine_detail?.name || `Obat ID: ${d.medicine}`}
                          <div className="text-xs text-slate-400 font-medium font-mono">
                            {d.medicine_detail?.code}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-900 font-bold">
                          {d.quantity} <span className="text-xs font-normal text-slate-400">{d.medicine_detail?.unit || "Unit"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800">{d.dosage}</div>
                          {d.instructions && (
                            <div className="text-xs text-slate-500 italic mt-0.5">{d.instructions}</div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">
                        Tidak ada detail obat yang tercatat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {prescription.notes && (
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Catatan Resep</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{prescription.notes}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            {prescription.status === "pending" && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Pastikan stok obat fisik mencukupi sebelum diserahkan.
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={actionLoading}
            >
              Tutup
            </Button>
            {prescription.status === "pending" && (
              <>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => onCancel(prescription.id)}
                  loading={actionLoading}
                  icon={XCircle}
                >
                  Batalkan
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => onDispense(prescription.id)}
                  loading={actionLoading}
                  icon={CheckCircle2}
                >
                  Serahkan Obat
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
