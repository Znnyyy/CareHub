"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { TodayVisitsTable } from "@/components/dashboard/TodayVisitsTable";
import { Users, Stethoscope, AlertTriangle, Activity } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayVisits: 0,
    lowStock: 0,
    totalDoctors: 0,
  });
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, doctorsRes, medicineRes, recordsRes] =
        await Promise.all([
          api.get("/patients/"),
          api.get("/doctors/"),
          api.get("/medicine/low_stock/"),
          api.get("/medical-records/today/"),
        ]);
      setStats({
        totalPatients: patientsRes.data.count || patientsRes.data.length || 0,
        totalDoctors: doctorsRes.data.count || doctorsRes.data.length || 0,
        lowStock: medicineRes.data.length || 0,
        todayVisits: recordsRes.data.length || 0,
      });
      setTodayRecords(recordsRes.data.slice(0, 5) || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Activity className="w-8 h-8 animate-pulse text-blue-500" />
            <p className="text-sm font-medium">Memuat data dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Pasien"
              value={stats.totalPatients}
              sub="terdaftar dalam sistem"
              icon={<Users className="w-6 h-6" />}
              colorClass="text-blue-600"
              bgClass="bg-blue-100/50"
            />
            <StatCard
              label="Kunjungan Hari Ini"
              value={stats.todayVisits}
              sub="kunjungan aktif"
              icon={<Activity className="w-6 h-6" />}
              colorClass="text-emerald-600"
              bgClass="bg-emerald-100/50"
            />
            <StatCard
              label="Stok Obat Rendah"
              value={stats.lowStock}
              sub="perlu restock segera"
              icon={<AlertTriangle className="w-6 h-6" />}
              colorClass="text-amber-500"
              bgClass="bg-amber-100/50"
            />
            <StatCard
              label="Dokter Aktif"
              value={stats.totalDoctors}
              sub="dokter terdaftar"
              icon={<Stethoscope className="w-6 h-6" />}
              colorClass="text-indigo-600"
              bgClass="bg-indigo-100/50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TodayVisitsTable records={todayRecords} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white h-full flex flex-col justify-between shadow-md">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Ringkasan Sistem
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-6">
                    Sistem Manajemen Klinik CareHub berjalan normal. Pastikan
                    untuk selalu mengecek stok obat secara berkala.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm">
                    <span className="text-sm font-medium">Status Server</span>
                    <span className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm">
                    <span className="text-sm font-medium">Versi Aplikasi</span>
                    <span className="text-sm font-bold text-blue-100">
                      v1.0.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
