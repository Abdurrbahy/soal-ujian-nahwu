import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Clock,
  CheckCircle2,
  ShieldAlert,
  FileCheck2,
  ArrowRight,
  Sparkles,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="emerald" className="px-4 py-1.5 text-xs font-semibold gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          النحو الواضح في قواعد اللغة العربية • الجزء الثاني
        </Badge>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Platform Ujian Nahwu Modern, <br className="hidden sm:inline" />
          <span className="text-emerald-800 underline decoration-emerald-300 decoration-wavy decoration-2">
            Akurat & Terstandarisasi
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Ujian evaluasi nahwu menyeluruh berbasis kitab rujukan <strong>Al-Nahw al-Wadih Juz 2</strong> (Pelajaran 1–20). Dilengkapi penilaian objektif otomatis, rubrik koreksi manual untuk guru, kisi-kisi resmi format PDF, serta pencatatan aktivitas fokus yang transparan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/ujian" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-12 px-8 text-base shadow-md">
              <GraduationCap className="w-5 h-5" />
              Mulai Ujian Siswa
            </Button>
          </Link>

          <Link href="/kisi-kisi" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 h-12 px-6 text-base border-emerald-300 text-emerald-800 hover:bg-emerald-50">
              <FileDown className="w-4 h-4 text-emerald-700" />
              Kisi-Kisi & Soal (PDF)
            </Button>
          </Link>

          <Link href="/materi" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto gap-2 h-12 px-6 text-base text-muted-foreground hover:text-foreground">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              Daftar 20 Pelajaran
            </Button>
          </Link>
        </div>
      </section>

      {/* Highlights / Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-border/80 shadow-sm bg-card hover:border-emerald-700/40 transition-colors">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">60 Soal</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 text-xs sm:text-sm text-muted-foreground">
            Tepat 60 soal terstandarisasi mencakup 8 variasi jenis soal.
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-card hover:border-emerald-700/40 transition-colors">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">20 Bab</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 text-xs sm:text-sm text-muted-foreground">
            Setiap pelajaran 1–20 terwakili tepat 3 butir soal (80 poin).
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-card hover:border-emerald-700/40 transition-colors">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">Fleksibel</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 text-xs sm:text-sm text-muted-foreground">
            Pengerjaan mandiri tanpa countdown, siap dikirim kapan saja.
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-card hover:border-emerald-700/40 transition-colors">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">Seimbang</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 text-xs sm:text-sm text-muted-foreground">
            40 poin otomatis objektif + 40 poin manual berbasis rubrik.
          </CardContent>
        </Card>
      </section>

      {/* Question Distribution Table Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Distribusi 60 Soal Ujian (Bab 1–20)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Struktur penilaian terbagi seimbang 50% sistem otomatis instan dan 50% penilaian mendalam oleh guru.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/kisi-kisi">
              <Button variant="outline" size="sm" className="text-emerald-800 border-emerald-300 gap-1.5 text-xs font-semibold">
                <FileDown className="w-3.5 h-3.5" /> Unduh Kisi-Kisi PDF
              </Button>
            </Link>
            <Link href="/materi">
              <Button variant="ghost" className="text-emerald-800 hover:text-emerald-900 gap-1 text-sm font-medium p-0 h-auto">
                Lihat 20 Bab <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
                  Soal Objektif (40 Soal / 40 Poin)
                </CardTitle>
                <Badge variant="emerald">Penilaian Otomatis</Badge>
              </div>
              <CardDescription>
                Dinilai langsung oleh sistem setelah pengiriman ujian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 divide-y divide-border">
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">1. Pilihan Ganda</span>
                <span className="text-muted-foreground font-mono">17 Soal (17 poin)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">2. Benar / Salah</span>
                <span className="text-muted-foreground font-mono">8 Soal (8 poin)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">3. Isian Singkat</span>
                <span className="text-muted-foreground font-mono">9 Soal (9 poin)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">4. Identifikasi / Klasifikasi</span>
                <span className="text-muted-foreground font-mono">6 Soal (6 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                <span>Subtotal Otomatis</span>
                <span>40 Soal / 40 Poin</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-200">
                  Soal Subjektif (20 Soal / 40 Poin)
                </CardTitle>
                <Badge variant="amber">Koreksi Guru</Badge>
              </div>
              <CardDescription>
                Diperiksa guru melalui portal penilaian dengan rubrik baku.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 divide-y divide-border">
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">5. I‘rab & Analisis Kedudukan</span>
                <span className="text-muted-foreground font-mono">6 Soal (12 poin)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">6. Transformasi Kalimat</span>
                <span className="text-muted-foreground font-mono">6 Soal (12 poin)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">7. Koreksi Kesalahan Nahwu</span>
                <span className="text-muted-foreground font-mono">5 Soal (10 poin)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">8. Tashkeel (Pemberian Harakat)</span>
                <span className="text-muted-foreground font-mono">3 Soal (6 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm font-semibold text-amber-900 dark:text-amber-300">
                <span>Subtotal Koreksi Guru</span>
                <span>20 Soal / 40 Poin</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Transparent Integrity & Privacy Policy Note */}
      <section className="rounded-xl border border-border p-6 bg-muted/40 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground text-base">
              Kebijakan Transparansi & Integritas Ujian
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform Mi‘yar mencatat peristiwa kehilangan fokus dokumen (seperti berpindah tab atau meminimalkan browser) secara transparan untuk memberikan konteks kepada guru.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Tidak mengunci perangkat atau membatasi browser siswa.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Tidak mengakses kamera, mikrofon, atau merekam layar.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Tidak dapat mengidentifikasi nama aplikasi lain yang dibuka.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Peristiwa fokus adalah konteks reflektif, bukan vonis mutlak.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
