"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { MedicalRecord } from "@/types";
import { Header } from "@/components/layout/Header";
import { MedicalRecordTable } from "@/components/medical-records/MedicalRecordTable";
import { MedicalRecordModal } from "@/components/medical-records/MedicalRecordModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Plus, Filter } from "lucide-react";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;
        const res = await api.get("/medical-records/", { params });
        setRecords(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchRecords();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, statusFilter]);

  const handleEdit = (record: MedicalRecord) => {
    setEditData(record);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus rekam medis ini?")) return;
    try {
      await api.delete(`/medical-records/${id}/`);
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      alert("Gagal menghapus rekam medis");
    }
  };

  const handleSuccess = () => {
    setSearch((s) => s + " ");
    setTimeout(() => setSearch((s) => s.trim()), 0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Rekam Medis" subtitle="Kelola riwayat kunjungan dan hasil pemeriksaan klinis" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari No. RM, nama pasien, atau dokter..."
                value={search}
                onChange={setSearch}
                focusColor="blue"
              />

              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm appearance-none font-medium text-slate-700"
                >
                  <option value="">Semua Status</option>
                  <option value="waiting">Menunggu</option>
                  <option value="in_progress">Pemeriksaan</option>
                  <option value="done">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              icon={Plus}
              className="w-full sm:w-auto"
            >
              Rekam Medis Baru
            </Button>
          </div>

          <MedicalRecordTable
            records={records}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <MedicalRecordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
