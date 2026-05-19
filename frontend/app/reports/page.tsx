"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Report } from "@/types";
import { Header } from "@/components/layout/Header";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportModal } from "@/components/reports/ReportModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [generatorLoading, setGeneratorLoading] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [router]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      const res = await api.get("/reports/", { params });
      setReports(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReports();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDownload = async (report: Report) => {
    try {
      const res = await api.get(`/reports/${report.id}/download/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", report.file?.split("/").pop() || `${report.title}.${report.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh dokumen laporan.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus riwayat laporan ini?")) return;
    try {
      await api.delete(`/reports/${id}/`);
      setReports(reports.filter((r) => r.id !== id));
    } catch (err) {
      alert("Gagal menghapus laporan.");
    }
  };

  const handleCreateReport = async (formData: {
    title: string;
    report_type: string;
    format: string;
    date_from: string;
    date_to: string;
  }) => {
    try {
      setGeneratorLoading(true);
      await api.post("/reports/", formData);
      alert("Laporan berhasil digenerasikan!");
      fetchReports();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setGeneratorLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Dokumen Laporan" subtitle="Generasikan rekap kunjungan, obat, dan daftar pasien klinik" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-1 w-full sm:w-auto gap-3 items-center">
              <SearchInput
                placeholder="Cari judul laporan..."
                value={search}
                onChange={setSearch}
                focusColor="blue"
              />
            </div>

            <Button
              onClick={() => setShowModal(true)}
              icon={Plus}
              className="w-full sm:w-auto"
            >
              Generasikan Laporan
            </Button>
          </div>

          <ReportTable
            reports={reports}
            loading={loading}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <ReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateReport}
        loading={generatorLoading}
      />
    </div>
  );
}
