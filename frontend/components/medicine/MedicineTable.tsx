"use client";

import { Medicine } from "@/types";
import { TableLoading } from "@/components/ui/TableLoading";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { Edit2, Trash2, Pill, AlertTriangle } from "lucide-react";

interface MedicineTableProps {
  medicines: Medicine[];
  loading: boolean;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: number) => void;
}

export function MedicineTable({
  medicines,
  loading,
  onEdit,
  onDelete,
}: MedicineTableProps) {
  const formatPrice = (priceStr: string) => {
    const price = parseFloat(priceStr);
    if (isNaN(price)) return priceStr;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Kode</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Nama Obat</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Kategori</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Stok</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Harga</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoading colSpan={7} message="Memuat data obat..." color="blue" />
            ) : medicines.length === 0 ? (
              <TableEmpty colSpan={7} message="Tidak ada data obat ditemukan." icon={Pill} />
            ) : (
              medicines.map((m) => {
                const isLowStock = m.stock <= m.min_stock;
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 whitespace-nowrap">
                      {m.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{m.name}</span>
                        {m.generic_name && (
                          <span className="text-xs text-slate-500 italic">
                            ({m.generic_name})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {m.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            isLowStock ? "text-amber-600" : "text-slate-900"
                          }`}
                        >
                          {m.stock} {m.unit}
                        </span>
                        {isLowStock && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            <AlertTriangle className="w-3 h-3" />
                            Stok Tipis (Min: {m.min_stock})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {formatPrice(m.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          m.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {m.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(m)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(m.id)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
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
