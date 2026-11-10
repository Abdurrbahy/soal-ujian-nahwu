"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  Trash2,
  LogOut,
  ShieldAlert,
  Settings2,
  GraduationCap,
  Sparkles,
  Database,
  RefreshCw,
  Copy,
  ExternalLink,
  Check,
  FileDown,
  Printer,
} from "lucide-react";
import { Submission, SubmissionStatus } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const SUPABASE_SCHEMA_SQL = `-- 1. Tabel Hasil Ujian Siswa (submissions)
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  student_section TEXT DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  duration_spent_sec INTEGER NOT NULL DEFAULT 0,
  auto_submitted BOOLEAN NOT NULL DEFAULT false,
  exam_version TEXT NOT NULL DEFAULT 'miyar-v1.0',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  auto_score INTEGER NOT NULL DEFAULT 0,
  max_auto_score INTEGER NOT NULL DEFAULT 40,
  manual_score INTEGER NOT NULL DEFAULT 0,
  max_manual_score INTEGER NOT NULL DEFAULT 40,
  total_score INTEGER NOT NULL DEFAULT 0,
  max_total_score INTEGER NOT NULL DEFAULT 80,
  percentage INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'menunggu_penilaian',
  focus_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  manual_grading JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_class ON submissions(student_class);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);

-- 2. Tabel Pengaturan Ujian (exam_settings)
CREATE TABLE IF NOT EXISTS exam_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  duration_minutes INTEGER NOT NULL DEFAULT 90,
  exam_title TEXT NOT NULL DEFAULT 'Ujian Nahwu Semester: Al-Nahw al-Wadih Juz 2 (Pelajaran 1–20)',
  target_chapter_min INTEGER NOT NULL DEFAULT 1,
  target_chapter_max INTEGER NOT NULL DEFAULT 20,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO exam_settings (id, duration_minutes, exam_title, target_chapter_min, target_chapter_max)
VALUES ('default', 90, 'Ujian Nahwu Semester: Al-Nahw al-Wadih Juz 2 (Pelajaran 1–20)', 1, 20)
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security & Hak Akses
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_settings ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE submissions TO anon, authenticated, service_role;
GRANT ALL ON TABLE exam_settings TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Allow public insert and read submissions" ON submissions;
CREATE POLICY "Allow public insert and read submissions"
  ON submissions FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read and update settings" ON exam_settings;
CREATE POLICY "Allow read and update settings"
  ON exam_settings FOR ALL
  USING (true)
  WITH CHECK (true);`;

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copyingSql, setCopyingSql] = useState(false);
  const [dbHealth, setDbHealth] = useState<{
    supabaseConfigured: boolean;
    supabaseConnected: boolean;
    tableExists: boolean;
    count: number;
    urlHost?: string;
    error?: string;
    hint?: string;
  } | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [savingSettings, setSavingSettings] = useState(false);

  // Load Submissions
  const fetchSubmissions = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/teacher/submissions");
      if (res.status === 401) {
        router.push("/guru/login");
        return;
      }
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
      if (data.dbHealth) {
        setDbHealth(data.dbHealth);
      }
    } catch (e) {
      console.error("Failed to load submissions", e);
      toast.error("Gagal memuat data ujian siswa.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopyingSql(true);
      toast.success("Skrip SQL berhasil disalin! Tempel di SQL Editor Supabase.");
      setTimeout(() => setCopyingSql(false), 2500);
    } catch {
      toast.error("Gagal menyalin. Silakan buka file supabase-schema.sql di proyek.");
    }
  };

  // Load Settings
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings?.durationMinutes) {
        setDurationMinutes(data.settings.durationMinutes);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchSettings();
  }, []);

  // Save Settings Handler
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes: Number(durationMinutes) }),
      });
      if (res.ok) {
        toast.success("Pengaturan durasi ujian berhasil diperbarui!");
        setIsSettingsOpen(false);
      } else {
        toast.error("Gagal menyimpan pengaturan.");
      }
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Delete Submission Handler
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus hasil ujian siswa "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/teacher/submissions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Hasil ujian ${name} berhasil dihapus.`);
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error(data.error || "Gagal menghapus.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/teacher/auth", { method: "DELETE" });
      toast.info("Anda telah keluar dari portal guru.");
      router.push("/guru/login");
    } catch {
      router.push("/guru/login");
    }
  };

  // Unique Classes list for filter dropdown
  const classesList = Array.from(new Set(submissions.map((s) => s.studentClass))).filter(Boolean);

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchName =
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(search.toLowerCase());
    const matchClass = selectedClass === "all" || s.studentClass === selectedClass;
    const matchStatus = selectedStatus === "all" || s.status === selectedStatus;
    return matchName && matchClass && matchStatus;
  });

  // Export CSV handler
  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedClass !== "all") params.set("class", selectedClass);
    if (selectedStatus !== "all") params.set("status", selectedStatus);

    window.open(`/api/teacher/export?${params.toString()}`, "_blank");
  };

  // Stats
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "menunggu_penilaian").length;
  const partialCount = submissions.filter((s) => s.status === "dinilai_sebagian").length;
  const finishedCount = submissions.filter((s) => s.status === "selesai_dinilai").length;
  const avgPercentage =
    totalCount > 0
      ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalCount)
      : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" className="text-xs">
              Portal Pendidik Nahwu
            </Badge>
            <span className="text-xs text-muted-foreground">• Al-Nahw al-Wadih Juz 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard Hasil & Penilaian Ujian
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola hasil ujian 60 soal (Pelajaran 1–20), periksa jawaban terbuka, telaah peristiwa fokus, dan beri skor manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/kisi-kisi" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 h-9 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
            >
              <FileDown className="w-4 h-4 text-emerald-700" />
              <span>Kisi-Kisi PDF</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs gap-1.5 h-9"
          >
            <Settings2 className="w-4 h-4 text-emerald-800" />
            <span>Durasi ({durationMinutes}m)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={submissions.length === 0}
            className="text-xs gap-1.5 h-9 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs gap-1.5 h-9 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>

      {/* Supabase Database Health Alert / Status */}
      {dbHealth && (!dbHealth.tableExists || !dbHealth.supabaseConnected) && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-200 text-amber-900 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-amber-950">
                    Status Koneksi Database Cloud Supabase
                  </h3>
                  <Badge variant="outline" className="border-amber-400 text-amber-900 bg-amber-100 text-[11px]">
                    Diperlukan untuk Vercel
                  </Badge>
                  {dbHealth.urlHost && (
                    <span className="font-mono text-[10px] bg-white text-slate-700 px-1.5 py-0.5 rounded border border-amber-300">
                      Host: {dbHealth.urlHost}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                  Platform berjalan di serverless Vercel. Agar jawaban siswa langsung tersimpan permanen dan tampil di dashboard guru, pastikan URL Supabase valid dan tabel <code className="font-semibold bg-amber-200/60 px-1 py-0.5 rounded">submissions</code> sudah dibuat.
                </p>
                {dbHealth.error && (
                  <p className="font-mono text-[11px] bg-white/90 text-amber-950 px-2.5 py-1.5 rounded border border-amber-300">
                    Status: {dbHealth.error}
                  </p>
                )}
                {dbHealth.hint && (
                  <div className="p-2.5 rounded-lg bg-amber-100/90 border border-amber-400/80 text-amber-950 text-xs space-y-1">
                    <span className="font-bold flex items-center gap-1 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Solusi yang perlu dilakukan:
                    </span>
                    <p className="leading-relaxed">{dbHealth.hint}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:self-center shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySql}
                className="text-xs gap-1.5 h-9 bg-white border-amber-300 hover:bg-amber-100 text-amber-950 font-medium shadow-sm"
              >
                {copyingSql ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copyingSql ? "Tersalin ke Clipboard!" : "Salin Skrip SQL"}
              </Button>
              <a
                href="https://supabase.com/dashboard/project/_/sql"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="text-xs gap-1.5 h-9 bg-emerald-800 hover:bg-emerald-900 text-white font-medium shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Supabase SQL Editor
                </Button>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSubmissions}
                disabled={isRefreshing}
                className="text-xs gap-1.5 h-9 text-amber-900 hover:bg-amber-100"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                Periksa Ulang
              </Button>
            </div>
          </div>
        </div>
      )}

      {dbHealth && dbHealth.tableExists && dbHealth.supabaseConnected && (
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold text-emerald-900">Database Cloud Supabase Terhubung & Aktif</span>
            <span className="text-emerald-700 hidden sm:inline">• {dbHealth.count} rekaman ujian tersimpan permanen di cloud</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchSubmissions}
            disabled={isRefreshing}
            className="text-xs h-7 px-2.5 text-emerald-800 hover:bg-emerald-100 gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Segarkan
          </Button>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs text-muted-foreground font-medium">Total Peserta Ujian</span>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              {totalCount}
              <Users className="w-4 h-4 text-emerald-700" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            {totalCount} lembar jawaban tersimpan
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs text-muted-foreground font-medium">Menunggu Koreksi</span>
            <CardTitle className="text-2xl font-bold flex items-center justify-between text-amber-700">
              {pendingCount + partialCount}
              <Clock className="w-4 h-4 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            {pendingCount} belum, {partialCount} sebagian
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs text-muted-foreground font-medium">Selesai Dinilai</span>
            <CardTitle className="text-2xl font-bold flex items-center justify-between text-emerald-800">
              {finishedCount}
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Skor total & persentase lengkap
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs text-muted-foreground font-medium">Rata-rata Nilai</span>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              {avgPercentage}%
              <GraduationCap className="w-4 h-4 text-emerald-700" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
            Skor akumulasi kelas
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Cari nama siswa atau kelas..."
            className="pl-9 text-xs sm:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Semua Kelas ({classesList.length})</option>
            {classesList.map((c) => (
              <option key={c} value={c}>
                Kelas {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Semua Status</option>
            <option value="menunggu_penilaian">Menunggu Penilaian</option>
            <option value="dinilai_sebagian">Dinilai Sebagian</option>
            <option value="selesai_dinilai">Selesai Dinilai</option>
          </select>

          {(search || selectedClass !== "all" || selectedStatus !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedClass("all");
                setSelectedStatus("all");
              }}
              className="text-xs h-10 px-2 text-muted-foreground"
            >
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Main Submissions List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Belum Ada Percobaan Ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search || selectedClass !== "all" || selectedStatus !== "all"
                ? "Tidak ada hasil yang cocok dengan kriteria filter saat ini."
                : "Belum ada siswa yang mengirimkan lembar jawaban ujian."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[200px]">Identitas Siswa</TableHead>
                  <TableHead>Waktu Kirim & Durasi</TableHead>
                  <TableHead className="text-center">Skor Objektif</TableHead>
                  <TableHead className="text-center">Skor Guru</TableHead>
                  <TableHead className="text-center">Total Skor</TableHead>
                  <TableHead>Status Penilaian</TableHead>
                  <TableHead>Aktivitas Fokus</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="font-semibold text-foreground">{s.studentName}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.studentClass} {s.studentSection ? `• ${s.studentSection}` : ""}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <div>
                        {new Date(s.submittedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{Math.round(s.durationSpentSec / 60)} mnt</span>
                        {s.autoSubmitted && (
                          <Badge variant="amber" className="text-[10px] py-0 px-1">
                            Habis
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono text-xs">
                      <span className="font-semibold text-foreground">{s.autoScore}</span>
                      <span className="text-muted-foreground"> / {s.maxAutoScore}</span>
                    </TableCell>

                    <TableCell className="text-center font-mono text-xs">
                      {s.status === "selesai_dinilai" ? (
                        <>
                          <span className="font-semibold text-foreground">{s.manualScore}</span>
                          <span className="text-muted-foreground"> / {s.maxManualScore}</span>
                        </>
                      ) : (
                        <span className="text-amber-700 italic text-[11px]">
                          {Object.keys(s.manualGrading || {}).length > 0
                            ? `${s.manualScore} (Sebagian)`
                            : "Belum Dinilai"}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="font-bold text-sm text-foreground">
                        {s.totalScore} <span className="text-xs font-normal text-muted-foreground">/ {s.maxTotalScore}</span>
                      </div>
                      <div className="text-xs font-mono text-emerald-800 font-semibold">
                        {s.percentage}%
                      </div>
                    </TableCell>

                    <TableCell>
                      {s.status === "selesai_dinilai" ? (
                        <Badge variant="emerald" className="text-[11px] font-medium">
                          Selesai Dinilai
                        </Badge>
                      ) : s.status === "dinilai_sebagian" ? (
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          Sebagian
                        </Badge>
                      ) : (
                        <Badge variant="amber" className="text-[11px] font-medium">
                          Menunggu
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShieldAlert
                          className={`w-4 h-4 ${
                            s.focusEvents.length > 0 ? "text-amber-600" : "text-emerald-700"
                          }`}
                        />
                        <span className="font-mono">{s.focusEvents.length} kali</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/rapor/${s.id}`} target="_blank">
                          <Button
                            size="sm"
                            variant="outline"
                            title="Unduh / Cetak Rapor Nilai Siswa (PDF)"
                            className="text-emerald-800 border-emerald-300 hover:bg-emerald-50 text-xs h-8 px-2.5 gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="hidden xl:inline">Rapor PDF</span>
                          </Button>
                        </Link>
                        <Link href={`/guru/nilai/${s.id}`}>
                          <Button size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-8 gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Periksa & Nilai</span>
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(s.id, s.studentName)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredSubmissions.map((s) => (
              <Card key={s.id} className="border-border shadow-sm p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{s.studentName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {s.studentClass} {s.studentSection ? `• ${s.studentSection}` : ""}
                    </p>
                  </div>
                  {s.status === "selesai_dinilai" ? (
                    <Badge variant="emerald" className="text-[10px]">Selesai</Badge>
                  ) : (
                    <Badge variant="amber" className="text-[10px]">Menunggu</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-muted/40 border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Skor Otomatis</span>
                    <strong className="font-mono">{s.autoScore} / {s.maxAutoScore}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Skor Manual</span>
                    <strong className="font-mono">
                      {s.status === "selesai_dinilai" ? `${s.manualScore} / ${s.maxManualScore}` : "Belum"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Total Skor</span>
                    <strong className="font-mono text-emerald-800">{s.totalScore} ({s.percentage}%)</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Kehilangan Fokus</span>
                    <strong className="font-mono">{s.focusEvents.length} kali</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(s.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link href={`/rapor/${s.id}`} target="_blank">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Rapor PDF"
                        className="text-emerald-800 border-emerald-300 hover:bg-emerald-50 text-xs h-8 px-2.5 gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Rapor</span>
                      </Button>
                    </Link>
                    <Link href={`/guru/nilai/${s.id}`}>
                      <Button size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-8">
                        Periksa & Nilai
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(s.id, s.studentName)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Settings Dialog (Exam Duration) */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Ujian Nahwu</DialogTitle>
            <DialogDescription className="text-xs">
              Ubah batas durasi pengerjaan untuk sesi ujian siswa selanjutnya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="duration-input" className="text-xs font-medium">
                Durasi Pengerjaan Ujian (Menit)
              </label>
              <Input
                id="duration-input"
                type="number"
                min={10}
                max={240}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
              <p className="text-[11px] text-muted-foreground">
                * Standar awal adalah 90 menit (dapat disesuaikan 30 s/d 180 menit).
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="bg-emerald-800 hover:bg-emerald-900 text-white"
            >
              {savingSettings ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
