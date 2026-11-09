"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileCheck,
  Printer,
  Home,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ReceiptData {
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
}

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`);
        const json = await res.json();
        if (!res.ok || !json.submission) {
          throw new Error(json.error || "Tanda terima tidak ditemukan.");
        }
        setData(json.submission);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal memuat tanda terima.");
      } finally {
        setLoading(false);
      }
    }
    fetchReceipt();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 space-y-6">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Data Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">{error || "ID tanda terima tidak valid."}</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  const durationMin = Math.round(data.durationSpentSec / 60);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 sm:py-16 space-y-6">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <Badge variant="emerald" className="px-3 py-1 text-xs font-semibold">
          Ujian Berhasil Terkirim
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Tanda Terima Ujian Nahwu
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Lembar jawaban Anda telah tersimpan secara aman di sistem Mi‘yar.
        </p>
      </div>

      {/* Main Printable Receipt Card */}
      <Card className="border-border shadow-md print:shadow-none print:border-none">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold">Bukti Pengiriman Ujian</CardTitle>
              <CardDescription className="text-xs">
                Materi: Al-Nahw al-Wadih Juz 2 (Pelajaran 1–20)
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-muted-foreground block">Nomor Resi:</span>
              <span className="font-mono font-bold text-xs text-emerald-800">{data.id}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Student Identitas Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm p-4 rounded-xl bg-muted/30 border border-border">
            <div>
              <span className="text-muted-foreground block text-xs">Nama Lengkap Siswa</span>
              <span className="font-bold text-foreground text-sm sm:text-base">{data.studentName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Kelas / Rombel</span>
              <span className="font-bold text-foreground text-sm sm:text-base">{data.studentClass}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Waktu Pengiriman</span>
              <span className="font-medium text-foreground">
                {new Date(data.submittedAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Durasi Pengerjaan</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                {durationMin} Menit {data.autoSubmitted && <span className="text-amber-700 font-bold">(Auto-submit)</span>}
              </span>
            </div>
          </div>

          {/* Scores Breakdown Box */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              Rincian Skor & Status Penilaian
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Objective Automatic Score */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    Skor Objektif (Otomatis)
                  </span>
                  <Badge variant="emerald" className="text-[10px]">46 Soal</Badge>
                </div>
                <div className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">
                  {data.autoScore} <span className="text-xs font-normal text-muted-foreground">/ {data.maxAutoScore} Poin</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Dihitung instan dari soal Pilihan Ganda, Benar/Salah, Isian Singkat, & Identifikasi.
                </p>
              </div>

              {/* Subjective Manual Status */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Skor Subjektif (Guru)
                  </span>
                  <Badge variant="amber" className="text-[10px]">29 Soal</Badge>
                </div>
                <div className="text-xl font-bold text-amber-900 dark:text-amber-200">
                  {data.status === "selesai_dinilai" ? (
                    `${data.manualScore} / ${data.maxManualScore} Poin`
                  ) : (
                    "Menunggu Penilaian Guru"
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Mencakup soal Tashkeel, Transformasi Kalimat, Koreksi Kesalahan, & I‘rab.
                </p>
              </div>
            </div>

            {/* Total final score if already graded */}
            {data.status === "selesai_dinilai" && (
              <div className="p-4 rounded-xl bg-primary text-primary-foreground text-center space-y-1">
                <span className="text-xs font-medium uppercase tracking-wider opacity-90">
                  Skor Akhir Keseluruhan (Telah Dinilai Lengkap)
                </span>
                <div className="text-3xl font-black">
                  {data.totalScore} / {data.maxTotalScore} ({data.percentage}%)
                </div>
              </div>
            )}
          </div>

          {/* Transparent Integrity Notice on Receipt */}
          <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Integritas & Keabsahan Ujian
            </div>
            <p>
              Percobaan ini tercatat dengan {data.focusEventsCount} kali peristiwa kehilangan fokus dokumen. Informasi ini disimpan untuk tinjauan guru.
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="w-full sm:w-auto gap-2 text-xs"
          >
            <Printer className="w-4 h-4" /> Cetak / Simpan PDF
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white gap-2 text-xs">
              <Home className="w-4 h-4" /> Kembali ke Beranda
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
