import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Trophy,
  Palette,
  FileText,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-14 space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION (With Real 3D Book Mockup & Harmonized Color Buttons) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 sm:pt-4">
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

          {/* Action Buttons - Harmonized with IDN Brand Colors */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link href="/ujian">
              <button className="w-full sm:w-auto rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 h-13 text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all group">
                <GraduationCap className="w-5 h-5 text-emerald-200" />
                <span>Mulai Ujian Siswa</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link href="/materi">
              <button className="w-full sm:w-auto rounded-full bg-white hover:bg-emerald-50/70 border-2 border-emerald-800/25 hover:border-emerald-800 text-emerald-950 font-bold px-7 h-13 text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-2xs">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Daftar 20 Pelajaran</span>
              </button>
            </Link>
          </div>

          {/* Quick highlights under CTA */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
              <span>60 Butir Soal Variatif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
              <span>Standar 80 Poin Kelulusan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
              <span>Rapor Resmi PDF A4</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Mockup Kitab An-Nahw al-Wadih Juz 2 */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-lg flex flex-col items-center justify-center">
            {/* Soft Ambient Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/50 via-amber-100/40 to-blue-200/40 rounded-full blur-3xl scale-95 pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute -top-3 right-4 sm:right-8 z-10 px-4 py-2 rounded-full bg-white/95 border border-border shadow-md backdrop-blur-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">Kitab Rujukan Resmi</span>
            </div>

            {/* 3D Book Mockup */}
            <div className="relative z-0 py-6 px-4 group">
              <img
                src="/images/mockup-kitab-nahwu.png"
                alt="3D Mockup Kitab An-Nahw al-Wadih Juz 2"
                className="max-h-[380px] sm:max-h-[460px] w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1"
              />
            </div>

            {/* Floating Bottom Card */}
            <div className="absolute -bottom-3 left-4 sm:left-6 z-10 p-3 px-4 rounded-2xl bg-white/95 border border-border shadow-lg backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-extrabold text-foreground">Al-Nahw al-Wadih Juz 2</p>
                <p className="text-[11px] text-muted-foreground font-medium">Pelajaran 1–20 (Hal. 3–70)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 VIBRANT PILLARS (With Sistem Deteksi Pindah Tab on Card 3) */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Fitur &amp; Karakteristik Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Standar Ujian yang Menyeluruh &amp; Terpercaya
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Vibrant Sky Blue */}
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

          {/* Card 2: Fresh Forest Emerald */}
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

          {/* Card 3: SISTEM DETEKSI PINDAH TAB (Warm Rose Coral) */}
          <div className="rounded-3xl bg-[#E11D48] text-white p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold">
                  Anti-Kecurangan
                </span>
              </div>
              <div className="space-y-1 pt-2">
                <h3 className="text-2xl font-extrabold tracking-tight">Deteksi Pindah Tab</h3>
                <p className="text-xs text-rose-100 leading-relaxed">
                  Sistem otomatis mendeteksi dan mencatat waktu santri saat beralih tab atau meminimalkan browser selama ujian berlangsung.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/15 text-[11px] font-medium text-rose-100 flex items-center justify-between">
              <span>Pencatatan Fokus</span>
              <span className="font-bold">Laporan ke Guru</span>
            </div>
          </div>

          {/* Card 4: Golden Honey Amber */}
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
            <button className="rounded-full text-emerald-800 hover:text-emerald-950 font-bold text-sm px-4 py-2 hover:bg-emerald-50 transition-colors flex items-center gap-1.5">
              <span>Lihat 20 Bab Materi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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

      {/* 4. TRANSPARENT INTEGRITY POLICY */}
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

      {/* 5. BOTTOM CTA BANNER (Flawless High-Contrast Buttons) */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-14 text-center space-y-6 shadow-lg border border-emerald-800/40">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wide">
            Siap Menguji Kemampuan Nahwu?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mulai Pengerjaan Ujian Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-lg mx-auto leading-relaxed">
            Pastikan koneksi internet stabil dan awali dengan membaca basmalah serta berdoa kepada Allah Subhanahu wa Ta&apos;ala.
          </p>
        </div>

        {/* Buttons: 100% High Contrast, Zero White-on-White, Matching IDN Theme */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <Link href="/ujian" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-full bg-white hover:bg-slate-100 text-emerald-950 font-extrabold px-8 py-3.5 text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-emerald-800" />
              <span>Masuk ke Lembar Ujian</span>
            </button>
          </Link>
          <Link href="/kisi-kisi" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-full bg-emerald-900/60 hover:bg-emerald-900 border-2 border-white/70 hover:border-white text-white font-bold px-8 py-3.5 text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-sm">
              <FileText className="w-5 h-5 text-emerald-300" />
              <span>Lihat Kisi-Kisi &amp; Naskah</span>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
