"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Medicine } from "@/types";
import { Header } from "@/components/layout/Header";
import { MedicineTable } from "@/components/medicine/MedicineTable";
import { MedicineModal } from "@/components/medicine/MedicineModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function MedicinePage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Medicine | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (search) params.search = search;
        const res = await api.get("/medicine/", { params });
        setMedicines(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchMedicines();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleEdit = (medicine: Medicine) => {
    setEditData(medicine);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus obat ini?")) return;
    try {
      await api.delete(`/medicine/${id}//`);
      setMedicines(medicines.filter((m) => m.id !== id));
    } catch (err) {
      alert("Gagal menghapus obat");
    }
  };

  const handleSuccess = () => {
    setSearch((s) => s + " ");
    setTimeout(() => setSearch((s) => s.trim()), 0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Inventaris Obat" subtitle="Kelola persediaan obat apotek klinik" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari nama / kode obat..."
                value={search}
                onChange={setSearch}
                focusColor="blue"
              />
            </div>

            <Button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              icon={Plus}
              className="w-full sm:w-auto"
            >
              Tambah Obat
            </Button>
          </div>

          <MedicineTable
            medicines={medicines}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <MedicineModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
