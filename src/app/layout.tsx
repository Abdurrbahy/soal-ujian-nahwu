import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Mi‘yar — Platform Ujian Nahwu",
  description:
    "Platform ujian nahwu berbasis web bersumber dari An-Nahw al-Wadih lil-Madaris al-Ibtida'iyyah Juz 2 (Pelajaran 1–26)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
                مِ
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                  Mi‘yar <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">مِعْيار</span>
                </span>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Platform Ujian Nahwu Al-Wadih
                </p>
              </div>
            </Link>

            <nav className="flex items-center space-x-1 sm:space-x-3">
              <Link
                href="/materi"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span className="hidden md:inline">26 Pelajaran</span>
              </Link>

              <Link
                href="/ujian"
                className="px-3.5 py-2 text-sm font-medium rounded-md bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mulai Ujian</span>
              </Link>

              <Link
                href="/guru/dashboard"
                className="px-3 py-2 text-sm font-medium rounded-md border border-input hover:bg-muted transition-colors flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Portal Guru</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-8 mt-16 text-sm text-muted-foreground">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-medium text-foreground">
                Mi‘yar (مِعْيَار) — Standar Penilaian Nahwu
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Materi rujukan: <span className="arabic-inline font-medium">النحو الواضح في قواعد اللغة العربية للمرحلة الابتدائية، الجزء الثاني</span> (علي الجارم ومصطفى أمين).
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/materi" className="hover:underline hover:text-foreground">
                Daftar Pelajaran 1–26
              </Link>
              <span>•</span>
              <Link href="/guru/dashboard" className="hover:underline hover:text-foreground">
                Portal Guru
              </Link>
            </div>
          </div>
        </footer>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
