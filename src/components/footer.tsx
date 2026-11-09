"use client";

import Link from "next/link";
import { useExamMode } from "@/context/exam-mode-context";

export function Footer() {
  const { isExamActive } = useExamMode();

  // Hide footer completely during active exam
  if (isExamActive) {
    return null;
  }

  return (
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
            Daftar Pelajaran 1–20
          </Link>
          <span>•</span>
          <Link href="/guru/dashboard" className="hover:underline hover:text-foreground">
            Portal Guru
          </Link>
        </div>
      </div>
    </footer>
  );
}
