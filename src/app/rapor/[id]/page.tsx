"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Printer,
  FileDown,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Share2,
  Check,
  BookOpen,
  Calendar,
  AlertCircle,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { QUESTIONS } from "@/data/questions";
import { CHAPTERS } from "@/data/chapters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface SubmissionData {
  id: string;
  studentName: string;
  studentClass: string;
  studentSection?: string;
  startedAt: string;
  submittedAt: string;
  durationSpentSec: number;
  autoSubmitted: boolean;
  autoScore: number;
  maxAutoScore: number;
  manualScore: number;
  maxManualScore: number;
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  status: string;
  focusEventsCount: number;
  manualGrading?: Record<number, { score: number; feedback?: string; gradedAt?: string }>;
  answers?: Record<number, string>;
}

export default function StudentScoreReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();

  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`);
        const json = await res.json();
        if (!res.ok || !json.submission) {
          throw new Error(json.error || "Data nilai ujian siswa tidak ditemukan.");
        }
        setData(json.submission);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal memuat rapor nilai.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Auto trigger print dialog if ?print=true
  useEffect(() => {
    if (data && searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [data, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      const url = window.location.href.split("?")[0];
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Tautan rapor siswa berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 space-y-6">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold">Rapor Nilai Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">{error || "Data ujian tidak valid."}</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  // Score calculations
  const totalScore = data.totalScore;
  const maxTotalScore = data.maxTotalScore || 80;
  const percentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  const isFullyGraded = data.status === "selesai_dinilai" || data.manualScore > 0;

  // Grade Predicate
  let predicate = {
    arabic: "ممتاز",
    latin: "Mumtaz",
    desc: "Istimewa (A)",
    passed: true,
    color: "text-emerald-800 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40",
  };

  if (percentage < 60) {
    predicate = {
      arabic: "راسب",
      latin: "Rasib",
      desc: "Kurang / Perlu Bimbingan (D)",
      passed: false,
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 border-red-300 dark:bg-red-950/40",
    };
  } else if (percentage < 70) {
    predicate = {
      arabic: "مقبول",
      latin: "Maqbul",
      desc: "Cukup (C)",
      passed: false,
      color: "text-amber-800 dark:text-amber-400",
      bg: "bg-amber-50 border-amber-300 dark:bg-amber-950/40",
    };
  } else if (percentage < 80) {
    predicate = {
      arabic: "جيد",
      latin: "Jayyid",
      desc: "Baik (B)",
      passed: true,
      color: "text-blue-800 dark:text-blue-400",
      bg: "bg-blue-50 border-blue-300 dark:bg-blue-950/40",
    };
  } else if (percentage < 90) {
    predicate = {
      arabic: "جيد جداً",
      latin: "Jayyid Jiddan",
      desc: "Sangat Baik (B+)",
      passed: true,
      color: "text-teal-800 dark:text-teal-400",
      bg: "bg-teal-50 border-teal-300 dark:bg-teal-950/40",
    };
  }

  // Teacher feedback collection
  const feedbacks: { questionId: number; prompt: string; feedback: string; score: number; maxPoints: number }[] = [];
  if (data.manualGrading) {
    for (const [qIdStr, grade] of Object.entries(data.manualGrading)) {
      const qId = Number(qIdStr);
      const q = QUESTIONS.find((item) => item.id === qId);
      if (q && (grade.feedback?.trim() || grade.score !== undefined)) {
        feedbacks.push({
          questionId: qId,
          prompt: q.prompt,
          feedback: grade.feedback?.trim() || "",
          score: grade.score || 0,
          maxPoints: q.points,
        });
      }
    }
  }

  const durationMin = Math.round(data.durationSpentSec / 60);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-background text-foreground pb-20 print:bg-white print:text-black print:pb-0">
      {/* Screen Control Bar (Hidden when printing) */}
      <div className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur shadow-sm print:hidden">
        <div className="container mx-auto max-w-4xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href={`/guru/nilai/${id}`}>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Penilaian</span>
              </Button>
            </Link>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-foreground hidden sm:inline">
              Rapor Nilai: {data.studentName} ({data.studentClass})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Tautan Tersalin" : "Bagi ke Siswa"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main A4 Document Sheet */}
      <main className="container mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10 print:p-0 print:max-w-none">
        <div className="bg-white text-slate-900 shadow-xl rounded-2xl border border-slate-200 p-6 sm:p-12 space-y-8 print:shadow-none print:border-none print:p-0 print:rounded-none">
          {/* 1. Official Header / Kop Surat Resmi */}
          <header className="border-b-4 border-double border-slate-800 pb-5 text-center space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center shrink-0">
                <img
                  src="/images/logo-idn.png"
                  alt="IDN Mekkah Madinah"
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </div>

              <div className="flex-1 space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 font-sans">
                  IDN BOARDING SCHOOL MEKKAH MADINAH
                </h2>
                <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-sans">
                  Laporan Hasil Ujian & Nilai Akhir Santri
                </h1>
                <p className="text-xs text-slate-600 italic">
                  Mata Pelajaran: Nahwu (An-Nahw al-Wadih Lil Madaris al-Ibtida&apos;iyyah Juz 2 — Pelajaran 1 s.d. 20)
                </p>
              </div>

              <div className="w-14 h-12 rounded-xl border border-slate-300 flex items-center justify-center text-center p-1 text-[10px] font-mono text-slate-600 shrink-0">
                A4 PDF
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-3 pt-1 border-t border-slate-200">
              <span>Tahun Ajaran 1447–1448 H / 2026 M</span>
              <span>•</span>
              <span>IDN Mekkah Madinah</span>
              <span>•</span>
              <span className="font-mono">Resi: {data.id}</span>
            </div>
          </header>

          {/* 2. Identitas Peserta Ujian */}
          <section className="bg-slate-50 border border-slate-300 rounded-xl p-4 sm:p-5 text-xs text-slate-800 print:bg-white print:border-slate-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">Nama Lengkap Santri / Siswa:</span>
                <strong className="text-slate-900 text-sm font-bold">{data.studentName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">Tingkat / Kelas:</span>
                <strong className="text-slate-900 text-sm font-bold">{data.studentClass}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">Tanggal Pelaksanaan Ujian:</span>
                <span>
                  {new Date(data.submittedAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">Waktu & Durasi Pengerjaan:</span>
                <span>
                  {new Date(data.submittedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB ({durationMin} Menit)
                </span>
              </div>
              <div className="flex justify-between sm:col-span-2 pt-0.5">
                <span className="text-slate-500 font-medium">Status Pemeriksaan:</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                  {isFullyGraded
                    ? "Telah Selesai Diperiksa & Dinilai Lengkap oleh Guru"
                    : "Menunggu Penyelesaian Koreksi Manual Guru"}
                </span>
              </div>
            </div>
          </section>

          {/* 3. Sertifikat Nilai Akhir & Predikat (Highlight Box) */}
          <section className="rounded-2xl border-2 border-emerald-700 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/70 p-6 sm:p-8 text-center space-y-4 print:border-emerald-800 print:bg-white print:break-inside-avoid shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-900">
              Hasil Capaian Evaluasi Akhir
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Raw Score */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block mb-1">Skor Kumulatif</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {totalScore} <span className="text-xs font-normal text-slate-500">/ {maxTotalScore} Poin</span>
                </div>
                <span className="text-[11px] text-slate-500">Bobot Maksimal 80 Poin</span>
              </div>

              {/* Final Grade 100 */}
              <div className="p-4 rounded-xl bg-emerald-800 text-white shadow-md sm:scale-105">
                <span className="text-xs font-semibold uppercase tracking-wider block opacity-90 mb-1">
                  Nilai Akhir (Skala 100)
                </span>
                <div className="text-4xl sm:text-5xl font-black tracking-tight">
                  {percentage}
                </div>
                <span className="text-[11px] opacity-90 block mt-1">KKM: 70</span>
              </div>

              {/* Predicate */}
              <div className={`p-3.5 rounded-xl border shadow-2xs ${predicate.bg}`}>
                <span className="text-xs text-slate-500 block mb-1">Predikat Belajar</span>
                <div className="arabic-inline text-2xl font-bold text-slate-900">
                  {predicate.arabic}
                </div>
                <div className={`text-xs font-bold ${predicate.color}`}>
                  {predicate.latin} — {predicate.desc}
                </div>
              </div>
            </div>

            {/* Passing Status */}
            <div className="pt-2">
              {predicate.passed ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Dinyatakan: LULUS & MEMENUHI STANDAR KELULUSAN
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Dinyatakan: PERLU PENGUATAN MATERI / REMEDIAL
                </div>
              )}
            </div>
          </section>

          {/* 4. Tabel Rincian Komponen Nilai */}
          <section className="space-y-3 print:break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-300 pb-1.5">
              <FileText className="w-4 h-4 text-emerald-800" />
              1. Rincian Komponen Penilaian
            </h3>

            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-xs text-slate-800 text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-4">Komponen Evaluasi Ujian</th>
                    <th className="py-2.5 px-3 text-center">Bentuk Soal</th>
                    <th className="py-2.5 px-3 text-center">Jumlah</th>
                    <th className="py-2.5 px-3 text-center">Maks. Poin</th>
                    <th className="py-2.5 px-3 text-center font-bold">Skor Perolehan</th>
                    <th className="py-2.5 px-3 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 text-center font-bold">1</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      Bagian I: Ujian Objektif
                      <span className="block text-[11px] font-normal text-slate-500">
                        Penilaian instan otomatis sistem
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Pilihan Ganda, B/S, Isian Singkat</td>
                    <td className="py-2.5 px-3 text-center font-semibold">40 Soal</td>
                    <td className="py-2.5 px-3 text-center">40 Poin</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-800 text-sm">
                      {data.autoScore} Poin
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold">
                      {Math.round((data.autoScore / (data.maxAutoScore || 40)) * 100)}%
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-center font-bold">2</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      Bagian II: Ujian Analisis & Uraian Kaidah
                      <span className="block text-[11px] font-normal text-slate-500">
                        Pemeriksaan teliti & rubrik koreksi guru
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Tashkeel, Transformasi, Koreksi, I‘rab</td>
                    <td className="py-2.5 px-3 text-center font-semibold">20 Soal</td>
                    <td className="py-2.5 px-3 text-center">40 Poin</td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-800 text-sm">
                      {data.manualScore} Poin
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold">
                      {Math.round((data.manualScore / (data.maxManualScore || 40)) * 100)}%
                    </td>
                  </tr>

                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                    <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider">
                      Total Akumulasi Nilai:
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold">60 Soal</td>
                    <td className="py-3 px-3 text-center font-bold">80 Poin</td>
                    <td className="py-3 px-3 text-center font-black text-emerald-900 text-base">
                      {totalScore} Poin
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-emerald-900 text-sm">
                      {percentage}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Analisis Kompetensi Pelajaran 1–20 */}
          <section className="space-y-3 print:break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-300 pb-1.5">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              2. Ruang Lingkup Materi Pelajaran (Al-Nahw al-Wadih Juz 2)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="font-bold text-emerald-900 block">Pelajaran 1–5: Pembagian Fi‘il & I‘rab Mudhari</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Taqsimul Fi‘il (Shahih & Mu‘tal Akhir), Mabni & Mu‘rab, Rafa‘, Nashab, dan Jazm pada Fi‘il Mudhari.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="font-bold text-emerald-900 block">Pelajaran 6–10: Bina‘ Fi‘il & I‘rab Mahalli</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Bina‘ Fi‘il Madhi, Mudhari, & Amr; I‘rab Mahalli; I‘rab Fi‘il Mudhari Mu‘tal Akhir.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="font-bold text-emerald-900 block">Pelajaran 11–15: Isim Mu‘tal & I‘rab Tasniyah</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Isim Maqshur & Manqush, I‘rab Taqdiri pada Isim, I‘rab Isim Tasniyah dan ketentuannya.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="font-bold text-emerald-900 block">Pelajaran 16–20: Isim Jamak & Al-Asma‘ul Khamsah</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Jama‘ Mudzakkar & Mu‘annats Salim, Asma‘ul Khamsah, Af‘alul Khamsah, dan Al-Mamnu‘ minash Sharf.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Catatan Pembinaan & Evaluasi Guru */}
          <section className="space-y-3 print:break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-300 pb-1.5">
              <Award className="w-4 h-4 text-emerald-800" />
              3. Catatan & Rekomendasi Guru Penguji
            </h3>

            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 space-y-3">
              <div className="space-y-1.5 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  Evaluasi Pembelajaran:
                </p>
                <p className="text-slate-700 italic">
                  {percentage >= 80
                    ? "Alhamdulillah, ananda menunjukkan penguasaan kaidah nahwu yang sangat baik, teliti dalam penentuan harakat akhir, serta mampu menguraikan kedudukan i‘rab kalimat dengan runtut. Pertahankan semangat belajar dan terus kembangkan pada jenjang berikutnya."
                    : percentage >= 70
                    ? "Ananda telah tuntas memenuhi kriteria kelulusan minimal. Perlu peningkatan latihan mandiri pada ketelitian tashkeel kalimat dan identifikasi tanda i‘rab cabang (niyabah)."
                    : "Ananda dianjurkan mengulang kembali pemahaman pada materi bina‘ fi‘il, isim maqshur/manqush, dan latihan i‘rab intensif bersama pembimbing."}
                </p>
              </div>

              {/* Specific Question Feedbacks from manual grading if available */}
              {feedbacks.length > 0 && (
                <div className="border-t border-slate-200 pt-2 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-900 block uppercase">
                    Catatan Khusus Soal Uraian / I‘rab:
                  </span>
                  <div className="space-y-1.5">
                    {feedbacks.slice(0, 4).map((f) => (
                      <div key={f.questionId} className="p-2 rounded bg-white border border-slate-200 text-[11px]">
                        <div className="flex justify-between items-center text-slate-600 mb-0.5">
                          <span className="font-bold">Soal #{f.questionId}</span>
                          <span className="font-semibold text-emerald-800">{f.score} / {f.maxPoints} Poin</span>
                        </div>
                        {f.feedback && <p className="text-slate-800 italic">&ldquo;{f.feedback}&rdquo;</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 7. Pengesahan & Tanda Tangan */}
          <footer className="pt-8 border-t-2 border-slate-300 text-xs text-slate-800 print:break-inside-avoid space-y-8">
            <div className="flex justify-end text-center pr-2 sm:pr-6">
              {/* TTD Koordinator IDN Mekkah Madinah */}
              <div className="space-y-16 w-72">
                <div>
                  <p className="text-slate-500">
                    Diterbitkan pada, {new Date(data.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-bold text-slate-900 mt-1">Koordinator IDN Mekkah Madinah</p>
                </div>
                <div className="border-b border-slate-700 pb-1">
                  <p className="font-bold text-slate-900 text-sm">
                    Abdurrahman Asyam, S.Kom.
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Footer Note */}
            <div className="text-[10px] text-slate-500 text-center border-t border-dashed border-slate-200 pt-3">
              <p>
                Dokumen ini merupakan Laporan Hasil Ujian digital resmi dari <strong>IDN Mekkah Madinah</strong>. Dokumen sah apabila identitas siswa dan nomor resi terdaftar di pangkalan data evaluasi.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
