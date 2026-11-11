"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  FileDown,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  Lock,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { QUESTIONS } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function KisiKisiContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"all" | "kisi" | "soal">("all");
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  // Teacher Authentication state
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/teacher/auth");
        const data = await res.json();
        setIsAuth(Boolean(data.authenticated));
      } catch {
        setIsAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Handle PIN unlock
  const handleUnlockWithPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError("Silakan masukkan PIN Guru.");
      return;
    }
    setVerifying(true);
    setPinError(null);

    try {
      const res = await fetch("/api/teacher/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "PIN Guru salah.");
      }
      setIsAuth(true);
      toast.success("Akses berhasil dibuka! Dokumen kisi-kisi dan kunci jawaban siap digunakan.");
    } catch (err: unknown) {
      setPinError(err instanceof Error ? err.message : "PIN Guru tidak cocok.");
      toast.error("PIN salah. Akses ini hanya untuk guru/asatidzah.");
    } finally {
      setVerifying(false);
    }
  };

  // Auto trigger print if ?print=true is present in URL and user is authenticated
  useEffect(() => {
    if (isAuth && searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAuth, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  // 1. Loading check
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-muted-foreground font-medium">Memverifikasi hak akses pendidik...</p>
      </div>
    );
  }

  // 2. Gate: Show PIN prompt if not authenticated
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dokumen Rahasia Pendidik
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Kisi-kisi soal dan rubrik kunci jawaban Al-Nahw al-Wadih dilindungi untuk menjaga kerahasiaan dan integritas ujian santri.
            </p>
          </div>

          <div className="bg-card border border-border shadow-md rounded-xl p-6 space-y-4">
            <form onSubmit={handleUnlockWithPin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-800" />
                  Masukkan PIN Guru / Penguji:
                </label>
                <Input
                  type="password"
                  placeholder="PIN Guru..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                  className="text-center tracking-widest text-base font-mono"
                />
              </div>

              {pinError && (
                <p className="text-xs text-destructive font-medium text-center">
                  {pinError}
                </p>
              )}

              <Button
                type="submit"
                disabled={verifying}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
              >
                {verifying ? "Memverifikasi PIN..." : "Buka Kisi-Kisi & Kunci Jawaban"}
              </Button>
            </form>

            <div className="pt-2 border-t text-center space-y-2">
              <p className="text-[11px] text-muted-foreground">
                Santri hanya diperkenankan mengakses halaman ujian dan daftar materi.
              </p>
              <Link
                href="/"
                className="text-xs text-emerald-800 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3 h-3" /> Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated: Render full Kisi-Kisi & Questions
  const questionsByBab = CHAPTERS.map((ch) => ({
    chapter: ch,
    questions: QUESTIONS.filter((q) => q.babNumber === ch.babNumber),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-foreground pb-20 print:bg-white print:text-black print:pb-0">
      {/* Screen Control Bar (Hidden when printing) */}
      <div className="sticky top-16 z-30 w-full border-b bg-card/95 backdrop-blur shadow-sm print:hidden">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                Dokumen Resmi:
              </span>
              <span className="text-xs text-muted-foreground">
                Kisi-Kisi & Rekapitulasi Soal Nahwu (Bab 1–20)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activeTab === "all" ? "bg-white text-emerald-900 shadow-xs dark:bg-muted dark:text-white" : "text-muted-foreground"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveTab("kisi")}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activeTab === "kisi" ? "bg-white text-emerald-900 shadow-xs dark:bg-muted dark:text-white" : "text-muted-foreground"
                }`}
              >
                Matriks Kisi-Kisi
              </button>
              <button
                onClick={() => setActiveTab("soal")}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activeTab === "soal" ? "bg-white text-emerald-900 shadow-xs dark:bg-muted dark:text-white" : "text-muted-foreground"
                }`}
              >
                Naskah 60 Soal
              </button>
            </div>

            {/* Answer Key Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="text-xs gap-1.5 h-8 border-border"
            >
              {showAnswerKey ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-emerald-700" />}
              <span className="hidden md:inline">{showAnswerKey ? "Sembunyikan Kunci" : "Tampilkan Kunci"}</span>
            </Button>

            {/* Print / Download Button */}
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold gap-1.5 h-8 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main A4 Document Container */}
      <main className="container mx-auto max-w-5xl px-4 sm:px-8 py-8 sm:py-12 print:p-0 print:max-w-none">
        <div className="bg-white text-slate-900 shadow-lg rounded-2xl border border-slate-200 p-8 sm:p-14 space-y-10 print:shadow-none print:border-none print:p-0 print:rounded-none">
          
          {/* ==================================================== */}
          {/* KOP RESMI DOKUMEN KISI-KISI                          */}
          {/* ==================================================== */}
          <header className="border-b-4 border-double border-slate-800 pb-5 text-center space-y-2">
            <div className="flex items-center justify-between pb-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-2xl text-emerald-900">
                مِ
              </div>
              <div className="flex-1 text-center px-4">
                <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-700 uppercase">
                  Penyusunan Evaluasi Pembelajaran & Penilaian Akhir Semester (PAS)
                </h3>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  KISI-KISI & DISTRIBUSI PENULISAN SOAL UJIAN NAHWU
                </h1>
                <p className="text-sm font-semibold text-emerald-900">
                  Kitab Rujukan: An-Nahw al-Wadih Juz 2 (Pelajaran 1 s.d. 20)
                </p>
                <p className="text-xs text-slate-500 font-arabic">
                  النَّحْوُ الوَاضِحُ فِي قَوَاعِدِ اللُّغَةِ العَرَبِيَّةِ لِلْمَدَارِسِ الابْتِدَائِيَّةِ • الجُزْءُ الثَّانِي (الدُّرُوس ١–٢٠)
                </p>
              </div>
              <div className="w-14 h-14 rounded-full border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-mono text-center leading-tight">
                KODE<br />PAS-20
              </div>
            </div>
          </header>

          {/* ==================================================== */}
          {/* TABEL IDENTITAS & SPESIFIKASI DOKUMEN                */}
          {/* ==================================================== */}
          <section className="rounded-xl border border-slate-300 bg-slate-50/70 p-4 sm:p-5 text-xs text-slate-800 space-y-3 print:bg-white print:border-slate-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <span className="font-semibold text-slate-500 block">Mata Pelajaran:</span>
                <span className="font-bold text-sm text-slate-900">Kaidah Nahwu (النحو)</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Cakupan Materi:</span>
                <span className="font-bold text-sm text-slate-900">Bab 1 s.d. Bab 20 (Hal. 3–131)</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Jumlah & Jenis Soal:</span>
                <span className="font-bold text-sm text-slate-900">60 Butir (40 Obj + 20 Subj)</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Skor Maksimal & Waktu:</span>
                <span className="font-bold text-sm text-emerald-900">80 Poin (Skala 100%) • 90 Menit</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600 text-[11px]">
              <div>
                <span className="font-semibold text-slate-700">Penyusun:</span> Tim Asatidzah & Guru Pengampu Nahwu
              </div>
              <div>
                <span className="font-semibold text-slate-700">Tahun Ajaran:</span> 2026 / 2027
              </div>
              <div>
                <span className="font-semibold text-slate-700">Standar Penilaian:</span> 50% Otomatis Sistem + 50% Koreksi Guru
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* TABEL 1: REKAPITULASI BENTUK SOAL & KOMPOSISI BOBOT  */}
          {/* ==================================================== */}
          {(activeTab === "all" || activeTab === "kisi") && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                    I
                  </span>
                  Tabel Distribusi Bentuk & Bobot Soal Ujian (60 Soal)
                </h2>
                <Badge variant="outline" className="border-slate-300 text-slate-700 text-[11px]">
                  Total 80 Poin
                </Badge>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">No</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Bentuk Soal</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center">Jumlah Butir</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center">Nomor Soal</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center">Bobot / Butir</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center">Total Poin</th>
                      <th className="py-2.5 px-3 text-center">Metode Penilaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Pilihan Ganda (PG)</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">17 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 43, 46, 52, 58
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">17 poin</td>
                      <td className="py-2 px-3 text-center text-emerald-800 font-medium">Otomatis Sistem</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">2</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Benar / Salah (B/S)</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">8 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        2, 8, 14, 20, 26, 32, 44, 50
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">8 poin</td>
                      <td className="py-2 px-3 text-center text-emerald-800 font-medium">Otomatis Sistem</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">3</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Isian Singkat</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">9 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        5, 11, 17, 23, 29, 35, 41, 47, 53
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">9 poin</td>
                      <td className="py-2 px-3 text-center text-emerald-800 font-medium">Otomatis Sistem</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">4</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Identifikasi / Klasifikasi</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">6 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        38, 40, 49, 55, 56, 59
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">6 poin</td>
                      <td className="py-2 px-3 text-center text-emerald-800 font-medium">Otomatis Sistem</td>
                    </tr>
                    <tr className="bg-emerald-50/60 font-semibold border-y border-emerald-200">
                      <td colSpan={2} className="py-2 px-3 text-emerald-950 border-r border-slate-200">
                        Subtotal Bagian Objektif (Otomatis)
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">40 butir</td>
                      <td className="py-2 px-3 text-center text-slate-500 border-r border-slate-200">—</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-emerald-900 border-r border-slate-200">
                        40 poin
                      </td>
                      <td className="py-2 px-3 text-center text-emerald-900 font-bold">50% Skor</td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">5</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">I‘rab & Analisis Kedudukan</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">6 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        9, 15, 21, 27, 33, 57
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">2 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">12 poin</td>
                      <td className="py-2 px-3 text-center text-amber-800 font-medium">Manual Guru</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">6</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Transformasi Kalimat</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">6 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        6, 36, 39, 42, 51, 60
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">2 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">12 poin</td>
                      <td className="py-2 px-3 text-center text-amber-800 font-medium">Manual Guru</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">7</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Koreksi Kesalahan Nahwu</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">5 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        3, 12, 18, 24, 30
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">2 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">10 poin</td>
                      <td className="py-2 px-3 text-center text-amber-800 font-medium">Manual Guru</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">8</td>
                      <td className="py-2 px-3 font-semibold border-r border-slate-200">Tashkeel (Pemberian Harakat)</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">3 butir</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] border-r border-slate-200">
                        45, 48, 54
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">2 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-200">6 poin</td>
                      <td className="py-2 px-3 text-center text-amber-800 font-medium">Manual Guru</td>
                    </tr>
                    <tr className="bg-amber-50/60 font-semibold border-y border-amber-200">
                      <td colSpan={2} className="py-2 px-3 text-amber-950 border-r border-slate-200">
                        Subtotal Bagian Subjektif (Koreksi Guru)
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">20 butir</td>
                      <td className="py-2 px-3 text-center text-slate-500 border-r border-slate-200">—</td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">2 poin</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-amber-900 border-r border-slate-200">
                        40 poin
                      </td>
                      <td className="py-2 px-3 text-center text-amber-900 font-bold">50% Skor</td>
                    </tr>

                    {/* TOTAL FINAL */}
                    <tr className="bg-slate-200/80 font-black text-slate-900 text-xs">
                      <td colSpan={2} className="py-3 px-3 uppercase tracking-wider border-r border-slate-300">
                        TOTAL KESELURUHAN (BAB 1–20)
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black border-r border-slate-300">
                        60 Butir Soal
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500 border-r border-slate-300">
                        1 s.d. 60
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500 border-r border-slate-300">—</td>
                      <td className="py-3 px-3 text-center font-mono font-black text-emerald-950 border-r border-slate-300">
                        80 Poin
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-950 font-bold">
                        100% (Skala Baku)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* TABEL 2: MATRIKS KISI-KISI DETAIL PER BAB (1-20)     */}
          {/* ==================================================== */}
          {(activeTab === "all" || activeTab === "kisi") && (
            <section className="space-y-4 print:break-before-page">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                    II
                  </span>
                  Matriks Kisi-Kisi Penulisan Soal Nahwu Per Pelajaran (Bab 1–20)
                </h2>
                <span className="text-xs text-slate-500">20 Pelajaran • 60 Butir Soal</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">Bab</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-56">Materi Pelajaran (Arab & Latin)</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-64">Intisari Kaidah Nahwu</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Indikator Ketercapaian Soal</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">Bentuk & No</th>
                      <th className="py-2.5 px-3 text-center w-16">Bobot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {questionsByBab.map(({ chapter, questions }) => (
                      <tr key={chapter.babNumber} className="hover:bg-slate-50/50 print:break-inside-avoid">
                        <td className="py-3 px-3 text-center font-bold border-r border-slate-200 align-top">
                          <span className="inline-block w-6 h-6 rounded bg-emerald-100 text-emerald-900 font-mono text-xs leading-6">
                            {chapter.babNumber}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-1">{chapter.pageRef}</span>
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 align-top">
                          <div className="font-arabic font-bold text-sm text-emerald-950 mb-0.5" dir="rtl">
                            {chapter.titleAr}
                          </div>
                          <div className="text-slate-700 text-xs font-medium">{chapter.titleId}</div>
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 align-top text-slate-600 leading-relaxed text-[11px]">
                          {chapter.summary}
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 align-top space-y-2">
                          {questions.map((q) => (
                            <div key={q.id} className="text-[11px] leading-snug">
                              <span className="font-semibold text-slate-800">Soal {q.id}:</span>{" "}
                              <span className="text-slate-600">{q.instruction}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 align-top text-center space-y-2 font-mono">
                          {questions.map((q) => (
                            <div key={q.id} className="text-[11px]">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 border text-[10px] uppercase font-bold text-slate-700">
                                {q.type.replace("_", " ")}
                              </span>
                              <span className="block text-slate-500 text-[10px]">No. {q.id}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-3 text-center align-top space-y-2 font-mono font-bold">
                          {questions.map((q) => (
                            <div key={q.id} className="text-[11px] text-slate-800">
                              {q.points} pt
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* BAGIAN 3: NASKAH LENGKAP 60 SOAL & RUBRIK            */}
          {/* ==================================================== */}
          {(activeTab === "all" || activeTab === "soal") && (
            <section className="space-y-6 print:break-before-page">
              <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                      III
                    </span>
                    Naskah Lengkap 60 Soal Ujian (Al-Nahw al-Wadih Juz 2)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Memuat instruksi pengerjaan, teks stimulus berbahasa Arab berharakat, opsi pilihan, serta rubrik penilaian.
                  </p>
                </div>
                {showAnswerKey && (
                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs self-start">
                    Kunci & Rubrik Guru Aktif
                  </Badge>
                )}
              </div>

              {/* Questions List Grouped by Chapter */}
              <div className="space-y-8">
                {questionsByBab.map(({ chapter, questions }) => (
                  <div
                    key={chapter.babNumber}
                    className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4 print:border-slate-300 print:bg-white print:p-3 print:break-inside-avoid"
                  >
                    {/* Chapter Subheader */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-bold text-xs">
                          Pelajaran {chapter.babNumber}
                        </span>
                        <span className="font-semibold text-xs text-slate-800">{chapter.titleId}</span>
                        <span className="text-[11px] text-slate-500">({chapter.pageRef})</span>
                      </div>
                      <span className="font-arabic font-bold text-sm text-emerald-950" dir="rtl">
                        {chapter.titleAr}
                      </span>
                    </div>

                    {/* Questions in this Chapter */}
                    <div className="grid grid-cols-1 gap-4">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 print:border-slate-300 print:p-2.5 print:break-inside-avoid"
                        >
                          {/* Question Meta Header */}
                          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs font-mono">
                                {q.id}
                              </span>
                              <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-700">
                                {q.type.replace("_", " ")}
                              </Badge>
                              <Badge
                                variant={q.gradingType === "otomatis" ? "emerald" : "amber"}
                                className="text-[10px]"
                              >
                                {q.gradingType === "otomatis" ? "Objektif (Sistem)" : "Subjektif (Guru)"}
                              </Badge>
                            </div>
                            <span className="font-bold text-slate-700 font-mono text-xs">{q.points} Poin</span>
                          </div>

                          {/* Instruction */}
                          <p className="text-xs text-slate-600 italic">{q.instruction}</p>

                          {/* Arabic Prompt */}
                          <div
                            className="p-3 rounded bg-emerald-50/50 border border-emerald-100 text-right font-arabic font-bold text-base sm:text-lg text-slate-900 leading-relaxed print:bg-white print:border-slate-200"
                            dir="rtl"
                          >
                            {q.prompt}
                          </div>

                          {/* Options if Multiple Choice */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const letters = ["A", "B", "C", "D"];
                                const isCorrect = opt === q.key;
                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2 rounded border text-xs flex items-center justify-between gap-2 ${
                                      showAnswerKey && isCorrect
                                        ? "bg-emerald-50 border-emerald-500 font-bold text-emerald-950"
                                        : "bg-slate-50/60 border-slate-200 text-slate-800"
                                    }`}
                                  >
                                    <span className="font-mono text-slate-500 font-bold">{letters[optIdx]}.</span>
                                    <span className="font-arabic text-sm text-right flex-1" dir="rtl">
                                      {opt}
                                    </span>
                                    {showAnswerKey && isCorrect && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Teacher Rubric & Answer Key */}
                          {showAnswerKey && (
                            <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 bg-amber-50/60 rounded p-3 text-xs text-slate-800 space-y-1.5 print:bg-slate-50">
                              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                Kunci Jawaban & Rubrik Penilaian:
                              </div>
                              {q.key && (
                                <div>
                                  <span className="font-semibold text-slate-700">Kunci Jawaban Baku:</span>{" "}
                                  <span className="font-arabic font-bold text-emerald-950 text-sm" dir="rtl">
                                    {q.key}
                                  </span>
                                  {q.acceptedVariants && q.acceptedVariants.length > 0 && (
                                    <span className="text-[11px] text-slate-500 ml-2">
                                      (Varian diterima: {q.acceptedVariants.join(", ")})
                                    </span>
                                  )}
                                </div>
                              )}
                              {q.rubric && (
                                <div className="space-y-1 text-[11px] leading-relaxed">
                                  <div>
                                    <span className="font-semibold text-slate-700">Model Jawaban Tepat:</span>{" "}
                                    <span className="font-arabic font-medium text-slate-900" dir="rtl">
                                      {q.rubric.modelAnswer}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-emerald-800">Skor Penuh (2 Poin):</span>{" "}
                                    {q.rubric.fullCredit}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-amber-800">Skor Sebagian (1 Poin):</span>{" "}
                                    {q.rubric.partialCredit}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-red-800">Nol (0 Poin):</span>{" "}
                                    {q.rubric.noCredit}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* TANDA TANGAN LEMBAR PENGESAHAN DOKUMEN               */}
          {/* ==================================================== */}
          <footer className="pt-8 border-t-2 border-slate-300 text-xs text-slate-700 print:break-inside-avoid space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala Madrasah / Pimpinan Pesantren</p>
                <div className="h-16" />
                <p className="font-bold underline">___________________________</p>
                <p className="text-[10px] text-slate-500">NIP / NIY. .....................................</p>
              </div>

              <div className="space-y-1 text-right">
                <p>Ditetapkan di: .........................</p>
                <p>Pada tanggal: ......................... 2026</p>
                <p className="font-bold">Guru Pengampu Mata Pelajaran Nahwu</p>
                <div className="h-16" />
                <p className="font-bold underline">___________________________</p>
                <p className="text-[10px] text-slate-500">NIP / NIY. .....................................</p>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
              Dokumen Kisi-Kisi & Soal Dihasilkan Otomatis oleh Platform Ujian Nahwu IDN Mekkah Madinah • Rujukan: Al-Nahw al-Wadih Juz 2
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function KisiKisiPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-sm">Memuat Kisi-Kisi...</div>}>
      <KisiKisiContent />
    </Suspense>
  );
}
