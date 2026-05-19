"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Prescription } from "@/types";
import { Header } from "@/components/layout/Header";
import { PrescriptionTable } from "@/components/prescriptions/PrescriptionTable";
import { PrescriptionDetailModal } from "@/components/prescriptions/PrescriptionDetailModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Filter } from "lucide-react";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/prescriptions", { params });
      setPrescriptions(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPrescriptions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, statusFilter]);

  const handleViewDetails = (p: Prescription) => {
    setSelectedPrescription(p);
    setShowDetailModal(true);
  };

  const handleDispense = async (id: number) => {
    if (!confirm("Konfirmasi penyerahan obat resep ke pasien?")) return;
    try {
      setActionLoading(true);
      await api.post(`/prescriptions/${id}/dispense/`);
      alert("Resep berhasil diserahkan ke pasien, stok obat terpotong!");
      setShowDetailModal(false);
      fetchPrescriptions();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal memproses resep");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Yakin ingin membatalkan resep ini? Stok obat akan dikembalikan.")) return;
    try {
      setActionLoading(true);
      await api.post(`/prescriptions/${id}/cancel/`);
      alert("Resep berhasil dibatalkan!");
      setShowDetailModal(false);
      fetchPrescriptions();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal membatalkan resep");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Resep Obat" subtitle="Kelola penyerahan obat resep dari rekam medis pasien" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari No. RM atau nama pasien..."
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
                  <option value="pending">Menunggu</option>
                  <option value="dispensed">Sudah Diberikan</option>
                  <option value="cancelled">Batal</option>
                </select>
              </div>
            </div>
          </div>

          <PrescriptionTable
            prescriptions={prescriptions}
            loading={loading}
            onViewDetails={handleViewDetails}
            onDispense={handleDispense}
            onCancel={handleCancel}
          />
        </div>
      </main>

      <PrescriptionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        prescription={selectedPrescription}
        onDispense={handleDispense}
        onCancel={handleCancel}
        actionLoading={actionLoading}
      />
    </div>
  );
}
