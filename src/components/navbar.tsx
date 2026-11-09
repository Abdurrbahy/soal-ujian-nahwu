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
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        {isExamActive ? (
          <div className="flex items-center space-x-3 select-none cursor-default">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-sm">
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
          </div>
        ) : (
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
        )}

        {/* Right Navigation */}
        {isExamActive ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Ujian Berlangsung
            </span>
          </div>
        ) : (
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <Link
              href="/materi"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">20 Pelajaran</span>
            </Link>

            {pathname !== "/ujian" && (
              <Link
                href="/ujian"
                className="px-3.5 py-2 text-sm font-medium rounded-md bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1.5 font-semibold"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mulai Ujian</span>
              </Link>
            )}

            <Link
              href="/guru/dashboard"
              className="px-3 py-2 text-sm font-medium rounded-md border border-input hover:bg-muted transition-colors flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Portal Guru</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
