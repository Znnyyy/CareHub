"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Doctor } from "@/types";
import { Header } from "@/components/layout/Header";
import { DoctorTable } from "@/components/doctors/DoctorTable";
import { DoctorModal } from "@/components/doctors/DoctorModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Doctor | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (search) params.search = search;
        const res = await api.get("/doctors/", { params });
        setDoctors(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchDoctors();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleEdit = (doctor: Doctor) => {
    setEditData(doctor);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus dokter ini?")) return;
    try {
      await api.delete(`/doctors/${id}/`);
      setDoctors(doctors.filter((d) => d.id !== id));
    } catch (err) {
      alert("Gagal menghapus dokter");
    }
  };

  const handleSuccess = () => {
    setSearch((s) => s + " ");
    setTimeout(() => setSearch((s) => s.trim()), 0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Data Dokter" subtitle="Kelola data dokter klinik" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari nama / spesialisasi..."
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
              Tambah Dokter
            </Button>
          </div>

          <DoctorTable
            doctors={doctors}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <DoctorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
