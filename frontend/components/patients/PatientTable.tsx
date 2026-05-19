"use client";

import { Patient } from "@/types";
import { TableLoading } from "@/components/ui/TableLoading";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { Edit2, Trash2, Users } from "lucide-react";

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

export function PatientTable({
  patients,
  loading,
  onEdit,
  onDelete,
}: PatientTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">NIK</th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Nama Lengkap
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">Gender</th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Tgl Lahir
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">Goldar</th>
              <th className="px-6 py-4 font-semibold tracking-wider">No. HP</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoading colSpan={8} message="Memuat data pasien..." color="blue" />
            ) : patients.length === 0 ? (
              <TableEmpty colSpan={8} message="Tidak ada data pasien ditemukan." icon={Users} />
            ) : (
              patients.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {p.nik}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {p.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        p.gender === "M"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {p.gender === "M" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {p.birth_date}
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {p.blood_type || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {p.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        p.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {p.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
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
