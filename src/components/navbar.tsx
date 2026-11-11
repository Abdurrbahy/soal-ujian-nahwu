"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { useExamMode } from "@/context/exam-mode-context";

export function Navbar() {
  const { isExamActive } = useExamMode();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand: Logo IDN Saja */}
        {isExamActive ? (
          <div className="flex items-center select-none cursor-default">
            <img
              src="/images/logo-idn.png"
              alt="IDN Mekkah Madinah"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>
        ) : (
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo-idn.png"
              alt="IDN Mekkah Madinah"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        )}

        {/* Right Navigation */}
        {isExamActive ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Ujian Sedang Berlangsung</span>
            </span>
          </div>
        ) : (
          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/materi"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full hover:bg-muted/80 text-foreground/80 hover:text-foreground transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">20 Pelajaran</span>
            </Link>

            {pathname !== "/ujian" && (
              <Link
                href="/ujian"
                className="px-5 py-2 text-xs sm:text-sm font-bold rounded-full bg-emerald-800 text-white hover:bg-emerald-900 transition-all shadow-xs flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mulai Ujian</span>
              </Link>
            )}

            <Link
              href="/guru/dashboard"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-all flex items-center gap-1.5 text-foreground"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Portal Guru</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
