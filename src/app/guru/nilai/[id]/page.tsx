"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileText,
  AlertTriangle,
  AlertCircle,
  Award,
  Filter,
  Check,
  X,
  HelpCircle,
  Sparkles,
  Camera,
} from "lucide-react";
import { QUESTIONS } from "@/data/questions";
import { Submission, ManualGradeItem, Question } from "@/types/exam";
import { checkAnswerMatch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function TeacherGradingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Manual grading state: questionId -> { score, feedback }
  const [grades, setGrades] = useState<Record<number, ManualGradeItem>>({});

  // Filter view: 'all' | 'manual_only' | 'auto_only'
  const [viewFilter, setViewFilter] = useState<"all" | "manual_only" | "auto_only">("manual_only");

  // Load submission details
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/teacher/submissions?id=${encodeURIComponent(id)}`);
        if (res.status === 401) {
          router.push("/guru/login");
          return;
        }
        const data = await res.json();
        if (data.submission) {
          setSubmission(data.submission);
          // Preload existing grading if any
          setGrades(data.submission.manualGrading || {});
        } else {
          toast.error("Percobaan tidak ditemukan.");
        }
      } catch (err) {
        console.error("Failed to load submission", err);
        toast.error("Gagal memuat lembar jawaban.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, router]);

  // Handle Score Input change for a question
  const handleScoreChange = (qId: number, scoreVal: number, maxPoints: number) => {
    const validScore = Math.max(0, Math.min(scoreVal, maxPoints));
    setGrades((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        score: validScore,
        gradedAt: new Date().toISOString(),
      },
    }));
  };

  // Handle Feedback change
  const handleFeedbackChange = (qId: number, feedback: string) => {
    setGrades((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || { score: 0 }),
        feedback,
      },
    }));
  };

  // Save Grades to API
  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/teacher/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, grades }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmission(data.submission);
        toast.success("Penilaian berhasil disimpan!");
      } else {
        toast.error(data.error || "Gagal menyimpan penilaian.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Data Jawaban Tidak Ditemukan</h2>
          <p className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded inline-block">
            ID: {id}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lembar jawaban dengan ID ini belum tercatat di database cloud Supabase. Pastikan tabel <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">submissions</code> sudah dibuat di SQL Editor Supabase agar jawaban tersimpan permanen.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/guru/dashboard">
            <Button className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
              Kembali ke Dashboard Guru
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Live calculation of current manual score from state
  const manualQuestions = QUESTIONS.filter((q) => q.gradingType === "manual");
  const gradedManualCount = manualQuestions.filter(
    (q) => grades[q.id]?.score !== undefined && typeof grades[q.id].score === "number"
  ).length;

  const currentManualScore = manualQuestions.reduce((acc, q) => {
    const s = grades[q.id]?.score;
    return acc + (typeof s === "number" ? Math.min(Math.max(0, s), q.points) : 0);
  }, 0);

  const currentTotalScore = submission.autoScore + currentManualScore;
  const currentPercentage = Math.round((currentTotalScore / submission.maxTotalScore) * 100);

  // Filter questions according to selected filter
  const displayedQuestions = QUESTIONS.filter((q) => {
    if (viewFilter === "manual_only") return q.gradingType === "manual";
    if (viewFilter === "auto_only") return q.gradingType === "otomatis";
    return true;
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Top Breadcrumb and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <Link
            href="/guru/dashboard"
            className="text-xs text-muted-foreground hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard Guru
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Pemeriksaan Lembar Jawaban Siswa
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Siswa: <strong>{submission.studentName}</strong> ({submission.studentClass}) • ID: {submission.id}
          </p>
        </div>

        <Button
          onClick={handleSaveGrades}
          disabled={saving}
          className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 shadow-sm shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Simpan Penilaian"}</span>
        </Button>
      </div>

      {/* Student Summary Info & Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identitas Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Identitas & Waktu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Nama Siswa:</span>
              <strong className="text-foreground">{submission.studentName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Kelas / Rombel:</span>
              <strong className="text-foreground">{submission.studentClass}</strong>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Waktu Kirim:</span>
              <span>{new Date(submission.submittedAt).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Durasi Pengerjaan:</span>
              <span>
                {Math.round(submission.durationSpentSec / 60)} Menit{" "}
                {submission.autoSubmitted && <span className="text-amber-700 font-semibold">(Auto-submit)</span>}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Live Score Overview Card */}
        <Card className="border-border shadow-sm md:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Akumulasi Nilai Ujian (Otomatis + Manual)
            </CardTitle>
            <Badge
              variant={
                gradedManualCount === manualQuestions.length
                  ? "emerald"
                  : gradedManualCount > 0
                  ? "secondary"
                  : "amber"
              }
              className="text-xs"
            >
              {gradedManualCount === manualQuestions.length
                ? "Semua 29 Dinilai"
                : `${gradedManualCount} / 29 Dinilai`}
            </Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[11px] text-emerald-900 dark:text-emerald-300 font-medium block">
                Skor Objektif (46 Soal)
              </span>
              <strong className="text-xl sm:text-2xl text-emerald-900 dark:text-emerald-200">
                {submission.autoScore} <span className="text-xs font-normal text-muted-foreground">/ {submission.maxAutoScore}</span>
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/30">
              <span className="text-[11px] text-amber-900 dark:text-amber-300 font-medium block">
                Skor Guru (29 Soal)
              </span>
              <strong className="text-xl sm:text-2xl text-amber-900 dark:text-amber-200">
                {currentManualScore} <span className="text-xs font-normal text-muted-foreground">/ {submission.maxManualScore}</span>
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-primary text-primary-foreground">
              <span className="text-[11px] font-medium block opacity-90">
                Total Skor Akhir
              </span>
              <strong className="text-xl sm:text-2xl">
                {currentTotalScore} <span className="text-xs font-normal opacity-80">({currentPercentage}%)</span>
              </strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Focus Events Log Panel (Transparent Integrity Record) */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              Catatan Aktivitas Kehilangan Fokus Layar ({submission.focusEvents.length} Peristiwa)
            </CardTitle>
            <Badge variant={submission.focusEvents.length > 0 ? "amber" : "emerald"} className="text-xs">
              {submission.focusEvents.length === 0 ? "Fokus Sempurna" : `${submission.focusEvents.length} kali terdeteksi`}
            </Badge>
          </div>
          <CardDescription className="text-xs leading-relaxed">
            Pencatatan ini mencatat waktu ketika tab atau browser disembunyikan/beralih. Informasi ini bersifat kontekstual untuk membantu guru dan bukan merupakan bukti otomatis kecurangan.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {submission.focusEvents.length === 0 ? (
            <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 text-xs text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Siswa tidak pernah meminimalkan atau meninggalkan tab browser selama ujian berlangsung.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {submission.focusEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-md border text-xs ${
                    evt.type === "screenshot_attempt"
                      ? "bg-rose-50/70 border-rose-300 dark:bg-rose-950/20"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                        evt.type === "screenshot_attempt"
                          ? "bg-rose-200 text-rose-900"
                          : "bg-amber-200 text-amber-900"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-foreground">{evt.details || "Tab browser ditinggalkan / diminimalkan"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground font-mono">
                    {evt.type === "screenshot_attempt" && (
                      <Badge variant="destructive" className="text-[10px] py-0 gap-1 bg-rose-100 text-rose-900 border-rose-300">
                        <Camera className="w-3 h-3 text-rose-700" /> Screenshot
                      </Badge>
                    )}
                    <span>{new Date(evt.timestamp).toLocaleTimeString("id-ID")}</span>
                    {evt.durationSec ? (
                      <Badge variant="outline" className="text-[10px] py-0">
                        {evt.durationSec} dtk
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Tabs for Review */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Tampilkan:</span>
          <button
            onClick={() => setViewFilter("manual_only")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewFilter === "manual_only"
                ? "bg-emerald-800 text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Hanya Perlu Koreksi Guru (29 Soal)
          </button>
          <button
            onClick={() => setViewFilter("auto_only")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewFilter === "auto_only"
                ? "bg-emerald-800 text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Soal Otomatis (46 Soal)
          </button>
          <button
            onClick={() => setViewFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewFilter === "all"
                ? "bg-emerald-800 text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua ({QUESTIONS.length} Soal)
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Menampilkan <span className="font-bold text-foreground">{displayedQuestions.length}</span> soal
        </div>
      </div>

      {/* Questions Grading List */}
      <div className="space-y-6">
        {displayedQuestions.map((q) => {
          const studentAns = submission.answers[q.id];
          const isManual = q.gradingType === "manual";
          const currentGrade = grades[q.id];

          // For automatic question, check correctness
          const isCorrectAuto =
            !isManual && q.key && checkAnswerMatch(studentAns, q.key, q.acceptedVariants);

          return (
            <Card
              key={q.id}
              className={`border transition-all ${
                isManual
                  ? currentGrade?.score !== undefined
                    ? "border-emerald-300 bg-card"
                    : "border-amber-300 bg-amber-50/20"
                  : isCorrectAuto
                  ? "border-emerald-200 bg-card"
                  : "border-border bg-card"
              }`}
            >
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      {q.id}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Pelajaran {q.babNumber} ({q.pageRef})
                    </Badge>
                    <Badge variant={isManual ? "amber" : "emerald"} className="text-xs">
                      {q.type.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-mono">
                      Max: {q.points} Poin
                    </Badge>
                  </div>

                  <div className="text-xs">
                    {isManual ? (
                      currentGrade?.score !== undefined ? (
                        <Badge variant="emerald" className="gap-1">
                          <Check className="w-3 h-3" /> Sudah Diberi Nilai ({currentGrade.score} Poin)
                        </Badge>
                      ) : (
                        <Badge variant="amber" className="gap-1">
                          <AlertTriangle className="w-3 h-3" /> Perlu Dinilai
                        </Badge>
                      )
                    ) : isCorrectAuto ? (
                      <Badge variant="emerald" className="gap-1">
                        <Check className="w-3 h-3" /> Benar (+{q.points} Poin)
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <X className="w-3 h-3" /> Salah (0 Poin)
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Bab: {q.babTitle}
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Indonesian Instruction */}
                <div className="text-xs font-medium text-muted-foreground">
                  Instruksi: <span className="text-foreground">{q.instruction}</span>
                </div>

                {/* Stimulus Soal */}
                <div className="p-4 rounded-lg bg-muted/30 border text-right">
                  <div className="arabic-text text-xl font-bold text-foreground">
                    {q.prompt}
                  </div>
                </div>

                {/* Student Answer Display */}
                <div className="space-y-1.5 p-4 rounded-xl border bg-card">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Jawaban Siswa:</span>
                    {!studentAns && <span className="text-destructive font-medium">(Tidak dijawab)</span>}
                  </div>
                  <div
                    className={`arabic-text text-lg p-3 rounded-lg border text-right ${
                      !studentAns
                        ? "bg-muted/40 text-muted-foreground italic"
                        : isManual
                        ? "bg-muted/20 text-foreground font-semibold"
                        : isCorrectAuto
                        ? "bg-emerald-50/80 text-emerald-950 border-emerald-300 font-semibold"
                        : "bg-destructive/10 text-destructive border-destructive/30"
                    }`}
                  >
                    {studentAns || "— Tidak Ada Jawaban —"}
                  </div>
                </div>

                {/* Question Key / Model Answer Rubric */}
                {isManual && q.rubric ? (
                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300/60 space-y-3 text-xs">
                    <div className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-800" />
                      Pedoman Rubrik Koreksi Al-Nahw al-Wadih:
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-medium">Kunci Jawaban Model:</span>
                      <div className="arabic-text text-base font-bold text-foreground bg-background p-2.5 rounded border text-right">
                        {q.rubric.modelAnswer}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <strong className="text-emerald-800">Nilai Penuh ({q.points} Poin):</strong> {q.rubric.fullCredit}
                      </div>
                      <div>
                        <strong className="text-amber-800">Sebagian:</strong> {q.rubric.partialCredit || "-"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1">
                    <span className="text-muted-foreground font-medium">Kunci Jawaban Sistem:</span>
                    <div className="arabic-text text-base font-semibold text-foreground text-right">
                      {q.key}
                    </div>
                  </div>
                )}

                {/* Teacher Scoring Input (for Manual Questions) */}
                {isManual && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <Label htmlFor={`score-${q.id}`} className="text-xs font-semibold">
                          Beri Skor Soal Nomor {q.id} (Maksimal: {q.points} Poin):
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Masukkan angka antara 0 hingga {q.points}.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          id={`score-${q.id}`}
                          type="number"
                          min={0}
                          max={q.points}
                          step={1}
                          className="w-24 text-center font-bold text-base h-10"
                          value={currentGrade?.score !== undefined ? currentGrade.score : ""}
                          placeholder="0"
                          onChange={(e) =>
                            handleScoreChange(q.id, Number(e.target.value), q.points)
                          }
                        />
                        <span className="text-xs text-muted-foreground font-mono">/ {q.points}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`feedback-${q.id}`} className="text-xs text-muted-foreground">
                        Catatan / Umpan Balik untuk Siswa (Opsional):
                      </Label>
                      <Input
                        id={`feedback-${q.id}`}
                        placeholder="Contoh: I'rab tepat, perhatikan tanda nashab mutsanna..."
                        className="text-xs"
                        value={currentGrade?.feedback || ""}
                        onChange={(e) => handleFeedbackChange(q.id, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 p-4 rounded-xl bg-card border shadow-lg">
        <div className="text-xs text-muted-foreground">
          Sudah dinilai: <strong className="text-foreground">{gradedManualCount}</strong> dari 29 soal uraian guru
        </div>

        <div className="flex items-center gap-3">
          <Link href="/guru/dashboard">
            <Button variant="outline" size="sm">
              Kembali
            </Button>
          </Link>

          <Button
            onClick={handleSaveGrades}
            disabled={saving}
            className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 font-semibold shadow"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Semua Penilaian"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
