"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { useExamMode } from "@/context/exam-mode-context";

export function Navbar() {
  const { isExamActive } = useExamMode();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto max-w-7xl px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        {isExamActive ? (
          <div className="flex items-center space-x-2 sm:space-x-3 select-none cursor-default">
            <img
              src="/images/logo-idn.png"
              alt="IDN Mekkah Madinah"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="hidden xs:block">
              <span className="font-bold text-sm sm:text-base tracking-tight text-foreground flex items-center gap-1 sm:gap-1.5">
                IDN <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">Mekkah Madinah</span>
              </span>
              <p className="text-[11px] text-muted-foreground hidden md:block">
                Platform Ujian Nahwu
              </p>
            </div>
          </div>
        ) : (
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <img
              src="/images/logo-idn.png"
              alt="IDN Mekkah Madinah"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-foreground flex items-center gap-1.5">
                IDN <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">Mekkah Madinah</span>
              </span>
              <p className="text-[11px] text-muted-foreground hidden md:block">
                Platform Ujian Nahwu
              </p>
            </div>
          </Link>
        )}

        {/* Right Navigation */}
        {isExamActive ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Ujian Berlangsung</span>
            </span>
          </div>
        ) : (
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <Link
              href="/materi"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
              <span className="hidden md:inline">20 Pelajaran</span>
            </Link>

            {pathname !== "/ujian" && (
              <Link
                href="/ujian"
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1 sm:gap-1.5 font-semibold"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Mulai Ujian</span>
              </Link>
            )}

            <Link
              href="/guru/dashboard"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md border border-input hover:bg-muted transition-colors flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
              <span className="hidden sm:inline">Portal Guru</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
