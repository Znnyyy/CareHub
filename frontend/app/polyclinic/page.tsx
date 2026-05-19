"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Polyclinic } from "@/types";
import { Header } from "@/components/layout/Header";
import { PolyclinicTable } from "@/components/polyclinic/PolyclinicTable";
import { PolyclinicModal } from "@/components/polyclinic/PolyclinicModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function PolyclinicPage() {
  const router = useRouter();
  const [polyclinics, setPolyclinics] = useState<Polyclinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Polyclinic | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchPolyclinics = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (search) params.search = search;
        const res = await api.get("/polyclinic/", { params });
        setPolyclinics(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchPolyclinics();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleEdit = (poly: Polyclinic) => {
    setEditData(poly);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus poliklinik ini?")) return;
    try {
      await api.delete(`/polyclinic/${id}/`);
      setPolyclinics(polyclinics.filter((p) => p.id !== id));
    } catch (err) {
      alert("Gagal menghapus poliklinik");
    }
  };

  const handleSuccess = () => {
    setSearch((s) => s + " ");
    setTimeout(() => setSearch((s) => s.trim()), 0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Data Poliklinik" subtitle="Kelola unit layanan poliklinik" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari nama / kode poli..."
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
              Tambah Poliklinik
            </Button>
          </div>

          <PolyclinicTable
            polyclinics={polyclinics}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <PolyclinicModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
