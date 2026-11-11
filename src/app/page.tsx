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
  Trophy,
  Compass,
  Palette,
  FileText,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-14 space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION (BrightPath UI Style: 2-Column with Punchy Headline & Playful Graphic Composition) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 sm:pt-6">
        {/* Left Column: Bold Typography & Action Buttons */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>IDN Boarding School Mekkah Madinah</span>
            <span className="text-emerald-400">•</span>
            <span className="font-arabic font-normal text-xs">النحو الواضح ۲</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground leading-[1.12]">
            Platform Ujian Nahwu Modern, <br className="hidden sm:inline" />
            <span className="text-emerald-800">Akurat &amp; Terstandarisasi.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Evaluasi komprehensif kaidah bahasa Arab santri berbasis kitab rujukan{" "}
            <strong className="text-foreground">Al-Nahw al-Wadih Juz 2</strong> (Pelajaran 1–20). Dilengkapi penilaian objektif otomatis, rubrik koreksi manual asatidzah, kisi-kisi resmi, serta cetak rapor nilai digital.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link href="/ujian">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-8 h-13 text-sm sm:text-base flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all group"
              >
                <span>Mulai Ujian Siswa</span>
                <span className="w-6 h-6 rounded-full bg-slate-950/15 flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
                  ▶
                </span>
              </Button>
            </Link>

            <Link href="/materi">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full border-2 border-foreground/20 hover:border-foreground/40 hover:bg-muted/70 text-foreground font-semibold px-6 h-13 text-sm sm:text-base transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <span>Daftar 20 Pelajaran</span>
              </Button>
            </Link>
          </div>

          {/* Quick highlights under CTA */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>60 Butir Soal Variatif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Standar 80 Poin Kelulusan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Rapor Resmi PDF A4</span>
            </div>
          </div>
        </div>

        {/* Right Column: Playful Modern Educational Visual Composition (BrightPath Aesthetic) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/60 p-6 sm:p-8 border border-border/80 shadow-md overflow-hidden flex flex-col justify-between">
            {/* Background Geometric Accents */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-200/50 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-emerald-200/50 blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

            {/* Top Row Badges */}
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-border shadow-xs backdrop-blur-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">Sistem Ujian Aktif</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-[#F43F5E] text-white text-xs font-extrabold tracking-wide shadow-xs">
                Juz 2 Tuntas
              </div>
            </div>

            {/* Center Arabic Calligraphy & Book Card */}
            <div className="relative my-auto py-4 space-y-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Kitab Standar Nahwu
                </span>
                <p className="arabic-text text-2xl font-bold text-slate-900 leading-tight">
                  النَّحْوُ الْوَاضِحُ فِي قَوَاعِدِ اللُّغَةِ الْعَرَبِيَّةِ
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  20 Pelajaran Terstruktur • Bab 1 s.d. 20
                </p>
              </div>
            </div>

            {/* Bottom Row Highlights */}
            <div className="relative grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/90 border border-border shadow-xs backdrop-blur-sm space-y-0.5 text-left">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Bobot Ujian</span>
                <p className="text-sm font-extrabold text-foreground">80 Poin Maksimal</p>
                <p className="text-[11px] text-emerald-800 font-medium">40 Oto + 40 Guru</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-border shadow-xs backdrop-blur-sm space-y-0.5 text-left">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Hasil Akhir</span>
                <p className="text-sm font-extrabold text-foreground">Rapor &amp; Resi Sah</p>
                <p className="text-[11px] text-blue-700 font-medium">Cetak PDF Otomatis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 VIBRANT PILLARS (Direct 1:1 Match to the Bottom Colorful Cards of BrightPath UI) */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Fitur &amp; Karakteristik Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Standar Ujian yang Menyeluruh &amp; Bersahabat
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Vibrant Sky Blue (BrightPath UI Card 1) */}
          <div className="rounded-3xl bg-[#2563EB] text-white p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold">
                  8 Variasi Soal
                </span>
              </div>
              <div className="space-y-1 pt-2">
                <h3 className="text-2xl font-extrabold tracking-tight">60 Butir Soal</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Kompilasi lengkap pilihan ganda, benar/salah, isian singkat, tashkeel, dan analisis i‘rab mendalam.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/15 text-[11px] font-medium text-blue-100 flex items-center justify-between">
              <span>Objektif + Uraian</span>
              <span className="font-bold">100% Tuntas</span>
            </div>
          </div>

          {/* Card 2: Fresh Forest Emerald (BrightPath UI Card 2) */}
          <div className="rounded-3xl bg-[#059669] text-white p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold">
                  Pelajaran 1–20
                </span>
              </div>
              <div className="space-y-1 pt-2">
                <h3 className="text-2xl font-extrabold tracking-tight">20 Bab Materi</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Tiap bab terwakili secara adil tepat 3 butir soal (80 poin) mencakup kaidah fi‘il, isim, hingga harakat.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/15 text-[11px] font-medium text-emerald-100 flex items-center justify-between">
              <span>Al-Nahw al-Wadih</span>
              <span className="font-bold">Juz 2</span>
            </div>
          </div>

          {/* Card 3: Warm Rose Coral (BrightPath UI Card 3) */}
          <div className="rounded-3xl bg-[#E11D48] text-white p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold">
                  Mandiri
                </span>
              </div>
              <div className="space-y-1 pt-2">
                <h3 className="text-2xl font-extrabold tracking-tight">Fleksibel &amp; Tenang</h3>
                <p className="text-xs text-rose-100 leading-relaxed">
                  Pengerjaan mandiri tanpa timer countdown otomatis yang membebani. Santri dapat fokus memeriksa jawaban.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/15 text-[11px] font-medium text-rose-100 flex items-center justify-between">
              <span>Bebas Tekanan</span>
              <span className="font-bold">Kirim Kapan Saja</span>
            </div>
          </div>

          {/* Card 4: Golden Honey Amber (BrightPath UI Card 4) */}
          <div className="rounded-3xl bg-[#D97706] text-white p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold">
                  40 Oto + 40 Guru
                </span>
              </div>
              <div className="space-y-1 pt-2">
                <h3 className="text-2xl font-extrabold tracking-tight">Penilaian Seimbang</h3>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Skor objektif langsung keluar otomatis, sedangkan 20 soal uraian dikoreksi manual guru dengan rubrik baku.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/15 text-[11px] font-medium text-amber-100 flex items-center justify-between">
              <span>Rubrik Resmi</span>
              <span className="font-bold">80 Poin Maks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUESTION DISTRIBUTION (Modern Rounded-3xl Cards) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Rincian Bobot Ujian
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Distribusi 60 Soal Ujian (Bab 1–20)
            </h2>
            <p className="text-sm text-muted-foreground">
              Keseimbangan antara kecepatan penilaian sistem otomatis dan ketelitian analisis pengajar.
            </p>
          </div>
          <Link href="/materi">
            <Button variant="ghost" className="rounded-full text-emerald-800 hover:text-emerald-900 gap-1.5 text-sm font-bold p-0 sm:px-4 sm:py-2 hover:bg-emerald-50 h-auto">
              Lihat 20 Bab Materi <ArrowRight className="w-4 h-4 ml-0.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Objektif */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Bagian 1
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  Soal Objektif (40 Butir / 40 Poin)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dinilai langsung oleh sistem sesaat setelah santri mengirim ujian.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                Otomatis
              </span>
            </div>

            <div className="space-y-3 divide-y divide-border/60">
              <div className="pt-2 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">1. Pilihan Ganda (PG)</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">17 Soal (17 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">2. Benar / Salah</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">8 Soal (8 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">3. Isian Singkat</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">9 Soal (9 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">4. Identifikasi / Klasifikasi</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">6 Soal (6 poin)</span>
              </div>
              <div className="pt-4 flex justify-between items-center text-sm font-bold text-emerald-800">
                <span>Subtotal Poin Objektif</span>
                <span>40 Poin Maksimal</span>
              </div>
            </div>
          </div>

          {/* Card Subjektif */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Bagian 2
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  Soal Uraian / I‘rab (20 Butir / 40 Poin)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Diperiksa guru penguji melalui Portal Guru dengan panduan rubrik.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold shrink-0">
                Koreksi Guru
              </span>
            </div>

            <div className="space-y-3 divide-y divide-border/60">
              <div className="pt-2 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">5. I‘rab &amp; Kedudukan Kalimat</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">6 Soal (12 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">6. Transformasi Kalimat</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">6 Soal (12 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">7. Koreksi Kesalahan Nahwu</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">5 Soal (10 poin)</span>
              </div>
              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">8. Tashkeel (Pemberian Harakat)</span>
                <span className="text-muted-foreground font-mono text-xs font-bold">3 Soal (6 poin)</span>
              </div>
              <div className="pt-4 flex justify-between items-center text-sm font-bold text-amber-800">
                <span>Subtotal Poin Uraian Guru</span>
                <span>40 Poin Maksimal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRANSPARENT INTEGRITY POLICY (BrightPath Rounded Card) */}
      <section className="rounded-3xl border border-border/80 p-6 sm:p-8 bg-white/70 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Keamanan &amp; Etika Islami
              </span>
              <h3 className="font-extrabold text-foreground text-lg sm:text-xl">
                Kebijakan Transparansi &amp; Integritas Ujian
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Platform IDN Mekkah Madinah mencatat peristiwa dokumen ketika santri beralih tab atau meminimalkan browser semata-mata sebagai catatan refleksi guru untuk menjaga kejujuran.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground pt-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>Tidak mengunci sistem atau memblokir akses perangkat siswa.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>Tidak mengakses kamera, mikrofon, atau merekam isi layar.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>Watermark identitas santri aktif sepanjang pengerjaan ujian.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>Menjunjung tinggi prinsip hadis: <em>Al-Mu&apos;minuna &apos;ala syurutihim</em>.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER (Vibrant IDN Emerald/Blue Gradient) */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide">
            Siap Menguji Kemampuan Nahwu?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mulai Pengerjaan Ujian Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
            Pastikan koneksi internet stabil dan awali dengan membaca basmalah serta berdoa kepada Allah Subhanahu wa Ta&apos;ala.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/ujian" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-8 h-12 text-sm sm:text-base shadow-sm hover:shadow transition-all"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Masuk ke Lembar Ujian
            </Button>
          </Link>
          <Link href="/kisi-kisi" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full border-2 border-white/30 hover:border-white text-white hover:bg-white/10 font-semibold px-6 h-12 text-sm sm:text-base transition-all"
            >
              Lihat Kisi-Kisi &amp; Naskah
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
