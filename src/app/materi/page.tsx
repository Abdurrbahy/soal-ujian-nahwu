"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowLeft, GraduationCap, CheckCircle } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { QUESTIONS } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MateriPage() {
  const [search, setSearch] = useState("");

  const filteredChapters = CHAPTERS.filter((ch) => {
    const q = search.toLowerCase();
    return (
      ch.babNumber.toString().includes(q) ||
      ch.titleAr.includes(search) ||
      ch.titleId.toLowerCase().includes(q) ||
      ch.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Beranda
            </Link>
            <span>/</span>
            <span className="text-foreground">Cakupan Materi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Daftar 26 Pelajaran Nahwu
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rujukan resmi: <span className="arabic-inline font-medium text-emerald-800">النحو الواضح في قواعد اللغة العربية للمرحلة الابتدائية، الجزء الثاني</span>
          </p>
        </div>

        <Link href="/ujian">
          <Button className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            Mulai Ujian 75 Soal
          </Button>
        </Link>
      </div>

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Cari pelajaran, kaidah, atau nomor bab..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{filteredChapters.length}</span> dari 26 pelajaran (Semua terwakili min. 2 soal)
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredChapters.map((ch) => {
          const chapterQuestions = QUESTIONS.filter((q) => q.babNumber === ch.babNumber);
          const autoCount = chapterQuestions.filter((q) => q.gradingType === "otomatis").length;
          const manualCount = chapterQuestions.filter((q) => q.gradingType === "manual").length;

          return (
            <Card key={ch.babNumber} className="border-border shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {ch.babNumber}
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {ch.pageRef}
                    </Badge>
                  </div>
                  <Badge variant="emerald" className="text-xs shrink-0">
                    {chapterQuestions.length} Soal Ujian
                  </Badge>
                </div>

                <div className="mt-2 text-right">
                  <h3 className="arabic-text text-xl font-bold text-foreground">
                    {ch.titleAr}
                  </h3>
                </div>

                <CardTitle className="text-base font-semibold text-emerald-950 dark:text-emerald-300 mt-1">
                  {ch.titleId}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  {ch.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    Kaidah Pokok Kitab:
                  </div>
                  <ul className="space-y-1.5 text-xs text-foreground">
                    {ch.rulesSummary.map((rule, idx) => (
                      <li key={idx} className="arabic-text text-right bg-background/80 p-2 rounded border border-border/40 text-sm">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>Komposisi soal:</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-700" /> {autoCount} Otomatis
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-amber-700" /> {manualCount} Manual
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
