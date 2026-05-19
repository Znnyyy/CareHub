"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Patient } from "@/types";
import { Header } from "@/components/layout/Header";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientModal } from "@/components/patients/PatientModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Plus, Filter } from "lucide-react";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Patient | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (search) params.search = search;
        if (genderFilter) params.gender = genderFilter;
        const res = await api.get("/patients/", { params });
        setPatients(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, genderFilter]);

  const handleEdit = (patient: Patient) => {
    setEditData(patient);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pasien ini?")) return;
    try {
      await api.delete(`/patients/${id}/`);
      setPatients(patients.filter(p => p.id !== id));
    } catch (err) {
      alert("Gagal menghapus pasien");
    }
  };

  const handleSuccess = () => {
    setSearch(s => s + " ");
    setTimeout(() => setSearch(s => s.trim()), 0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Data Pasien" subtitle="Kelola data pasien klinik" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari nama / NIK..."
                value={search}
                onChange={setSearch}
                focusColor="blue"
              />

              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm appearance-none"
                >
                  <option value="">Semua Gender</option>
                  <option value="M">Laki-laki</option>
                  <option value="F">Perempuan</option>
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
              Tambah Pasien
            </Button>
          </div>

          <PatientTable
            patients={patients}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <PatientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
