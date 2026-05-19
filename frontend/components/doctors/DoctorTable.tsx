"use client";

import { Doctor } from "@/types";
import { TableLoading } from "@/components/ui/TableLoading";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { Edit2, Trash2, Stethoscope } from "lucide-react";

interface DoctorTableProps {
  doctors: Doctor[];
  loading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: number) => void;
}

export function DoctorTable({
  doctors,
  loading,
  onEdit,
  onDelete,
}: DoctorTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">NIP</th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Nama Lengkap
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Spesialisasi
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Poliklinik
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">Jadwal</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoading colSpan={7} message="Memuat data dokter..." color="blue" />
            ) : doctors.length === 0 ? (
              <TableEmpty colSpan={7} message="Tidak ada data dokter ditemukan." icon={Stethoscope} />
            ) : (
              doctors.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {d.nip}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {d.full_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {d.specialization}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {d.polyclinic_name || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 capitalize">
                        {d.schedule_day}
                      </span>
                      <span className="text-xs">
                        {d.schedule_start?.slice(0, 5)} - {d.schedule_end?.slice(0, 5)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        d.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {d.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(d)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(d.id)}
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
