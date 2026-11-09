"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Grid,
  ShieldAlert,
  Info,
  RotateCcw,
  Sparkles,
  Loader2,
} from "lucide-react";
import { QUESTIONS } from "@/data/questions";
import { Question, FocusEventRecord } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useExamMode } from "@/context/exam-mode-context";

const LOCAL_STORAGE_KEY = "miyar_exam_session_v1";

export default function ExamPage() {
  const router = useRouter();
  const { setIsExamActive } = useExamMode();

  // State: Stage ('identity' | 'exam' | 'submitting')
  const [stage, setStage] = useState<"identity" | "exam" | "submitting">("identity");

  // Sync active exam state with global Navbar & Footer
  useEffect(() => {
    const isRunning = stage === "exam" || stage === "submitting";
    setIsExamActive(isRunning);
    return () => {
      setIsExamActive(false);
    };
  }, [stage, setIsExamActive]);

  // Student Identity
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentSection, setStudentSection] = useState("");

  // Exam Progress
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});

  // Timestamps
  const [startedAt, setStartedAt] = useState<string>("");

  // Focus tracking (Tab Switch / Window Blur)
  const [focusEvents, setFocusEvents] = useState<FocusEventRecord[]>([]);
  const [focusNotice, setFocusNotice] = useState<string | null>(null);
  const blurTimeRef = useRef<number | null>(null);
  const isBlurredRef = useRef<boolean>(false);

  // Submission Guard Refs
  const isSubmittingRef = useRef<boolean>(false);

  // Modals
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isNavGridOpen, setIsNavGridOpen] = useState(false);
  const [navFilter, setNavFilter] = useState<"all" | "unanswered" | "marked">("all");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Load existing session from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stage === "exam") {
          setStudentName(parsed.studentName || "");
          setStudentClass(parsed.studentClass || "");
          setStudentSection(parsed.studentSection || "");
          setAnswers(parsed.answers || {});
          setMarkedQuestions(parsed.markedQuestions || {});
          setFocusEvents(parsed.focusEvents || []);
          setCurrentIndex(parsed.currentIndex || 0);
          setStartedAt(parsed.startedAt || new Date().toISOString());
          setStage("exam");

          toast.info("Sesi ujian Anda sebelumnya telah dipulihkan.");
        }
      }
    } catch (e) {
      console.error("Failed to restore exam session", e);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (stage === "exam") {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            stage: "exam",
            studentName,
            studentClass,
            studentSection,
            startedAt,
            answers,
            markedQuestions,
            focusEvents,
            currentIndex,
          })
        );
      } catch (e) {
        console.error("Failed to save progress to localStorage", e);
      }
    }
  }, [stage, studentName, studentClass, studentSection, startedAt, answers, markedQuestions, focusEvents, currentIndex]);

  // Submit Handler Definition
  const handleSubmitExam = useCallback(
    async (isAutoSubmit = false) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      setStage("submitting");
      setSubmissionError(null);

      try {
        const payload = {
          studentName: studentName?.trim() || "Siswa",
          studentClass: studentClass?.trim() || "Kelas",
          studentSection: studentSection?.trim() || "",
          startedAt: startedAt || new Date().toISOString(),
          autoSubmitted: isAutoSubmit,
          answers: answers || {},
          focusEvents: focusEvents || [],
        };

        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal menyimpan ujian.");
        }

        // Clean up storage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        toast.success("Ujian berhasil dikirim!", { id: "submit-status" });
        window.location.href = `/tanda-terima/${data.submission.id}`;
      } catch (err: unknown) {
        isSubmittingRef.current = false;
        const message = err instanceof Error ? err.message : "Koneksi terganggu.";
        console.error("Submission failed:", err);
        setSubmissionError(message);
        setStage("exam");
        toast.error(`Gagal mengirim ujian: ${message}`, {
          id: "submit-status",
        });
      }
    },
    [studentName, studentClass, studentSection, startedAt, answers, focusEvents]
  );

  // Focus event tracking (Document Visibility & Window Blur)
  useEffect(() => {
    if (stage !== "exam") return;

    const recordLoss = () => {
      if (!isBlurredRef.current) {
        isBlurredRef.current = true;
        blurTimeRef.current = Date.now();
      }
    };

    const recordGain = () => {
      if (isBlurredRef.current && blurTimeRef.current) {
        const durationSec = Math.max(1, Math.round((Date.now() - blurTimeRef.current) / 1000));
        const newEvent: FocusEventRecord = {
          type: "visibility_hidden",
          timestamp: new Date().toISOString(),
          durationSec,
          details: `Halaman kehilangan fokus selama ${durationSec} detik`,
        };

        setFocusEvents((prev) => [...prev, newEvent]);
        setFocusNotice(`Pemberitahuan: Anda meninggalkan layar ujian selama ${durationSec} detik. Peristiwa ini dicatat untuk rekam jejak guru.`);
        isBlurredRef.current = false;
        blurTimeRef.current = null;
      }
    };

    const recordScreenshotAttempt = (detail: string) => {
      const newEvent: FocusEventRecord = {
        type: "screenshot_attempt",
        timestamp: new Date().toISOString(),
        details: detail,
      };

      setFocusEvents((prev) => [...prev, newEvent]);
      setFocusNotice(`Pemberitahuan Keamanan: Upaya tangkapan layar (screenshot) terdeteksi dan dicatat dalam laporan guru.`);
      toast.warning("Peringatan: Upaya tangkapan layar (screenshot) terdeteksi dan dicatat dalam rekam jejak guru.");

      // Attempt to clear/overwrite clipboard to prevent exam leakage
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Tangkapan layar dinonaktifkan demi integritas ujian Nahwu.");
        }
      } catch {}
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. PrintScreen key (Windows / Linux)
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        recordScreenshotAttempt("Tombol PrintScreen ditekan");
        return;
      }

      // 2. Mac screenshot shortcuts: Cmd + Shift + 3 / 4 / 5
      if (e.metaKey && e.shiftKey && ["Digit3", "Digit4", "Digit5"].includes(e.code)) {
        recordScreenshotAttempt(`Shortcut tangkapan layar Mac (${e.code}) terdeteksi`);
        return;
      }

      // 3. Snipping tool: Win + Shift + S or Ctrl + Shift + S
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.code === "KeyS" || e.key === "S" || e.key === "s")) {
        e.preventDefault();
        recordScreenshotAttempt("Kombinasi tombol Snipping Tool (Shift + S) terdeteksi");
        return;
      }

      // 4. Print shortcut: Ctrl + P / Cmd + P
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        recordScreenshotAttempt("Upaya cetak layar (Ctrl/Cmd + P) diblokir");
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        recordScreenshotAttempt("Pelepasan tombol PrintScreen terdeteksi");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordLoss();
      } else {
        recordGain();
      }
    };

    const handleWindowBlur = () => {
      recordLoss();
    };

    const handleWindowFocus = () => {
      recordGain();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stage]);

  // Start Exam Click
  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      toast.error("Nama lengkap siswa wajib diisi.");
      return;
    }
    if (!studentClass.trim()) {
      toast.error("Silakan pilih kelas Anda (Kelas 10, 11, atau 12).");
      return;
    }

    const now = new Date().toISOString();
    setStartedAt(now);
    setStage("exam");
    setIsExamActive(true);
    toast.success("Ujian dimulai. Selamat mengerjakan!");
  };

  // Answer change helper
  const handleAnswerChange = (val: string) => {
    const q = QUESTIONS[currentIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  // Toggle Marked for Review
  const toggleMarkQuestion = () => {
    const q = QUESTIONS[currentIndex];
    setMarkedQuestions((prev) => ({
      ...prev,
      [q.id]: !prev[q.id],
    }));
  };

  // Stats
  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;
  const markedCount = Object.values(markedQuestions).filter(Boolean).length;
  const unansweredCount = QUESTIONS.length - answeredCount;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  // Current question object
  const currentQ: Question = QUESTIONS[currentIndex];

  // ==========================================
  // STAGE 1: IDENTITAS & PETUNJUK
  // ==========================================
  if (stage === "identity") {
    return (
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="emerald" className="px-3.5 py-1 text-xs font-semibold">
            Formulir Peserta Ujian
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Ujian Nahwu Al-Wadih Juz 2
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Silakan lengkapi identitas Anda dengan teliti sebelum memulai ujian.
          </p>
        </div>

        <form onSubmit={handleStartExam} className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg font-semibold">Identitas Siswa</CardTitle>
              <CardDescription>
                Identitas ini akan dicantumkan pada lembar jawaban dan bukti pengiriman ujian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap Siswa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Contoh: Muhammad Ali Ridha"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class" className="text-sm font-medium">
                  Kelas <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 transition-colors cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih Kelas (10, 11, 12) --</option>
                    <option value="Kelas 10">Kelas 10</option>
                    <option value="Kelas 11">Kelas 11</option>
                    <option value="Kelas 12">Kelas 12</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pilih tingkat kelas Anda saat ini (Kelas 10, 11, atau 12).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exam Rules & Instructions Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-800" />
                Ketentuan & Petunjuk Pengerjaan Ujian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                <li>
                  <strong>Tepat {QUESTIONS.length} Soal:</strong> Mencakup seluruh 20 pelajaran Al-Nahw al-Wadih Juz 2 (Bab 1–20: Pilihan Ganda, Benar/Salah, Isian Singkat, Klasifikasi, Tashkeel, Transformasi, Koreksi, dan I‘rab).
                </li>
                <li>
                  <strong>Pengerjaan Mandiri & Fleksibel:</strong> Anda dapat mengerjakan soal dengan tenang tanpa batasan timer countdown otomatis. Jawaban berapapun jumlahnya dapat Anda kirimkan kapan saja setelah melakukan konfirmasi.
                </li>
                <li>
                  <strong>Penilaian Seimbang:</strong> Skor objektif (40 butir soal) langsung dihitung otomatis oleh sistem, sedangkan 20 butir soal uraian/tashkeel/i‘rab akan diperiksa dan dinilai langsung oleh guru.
                </li>
                <li>
                  <strong>Tanda Terima & Bukti Pengiriman:</strong> Setelah selesai, Anda akan menerima nomor resi dan rangkuman jawaban yang dapat disimpan atau dicetak.
                </li>
              </ul>

              <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-800" />
                  Kebijakan Integritas & Pencatatan Fokus Layar:
                </div>
                <p>
                  Sistem mencatat waktu ketika tab atau jendela browser Anda diminimalkan atau ditinggalkan. Catatan ini bersifat informatif bagi guru untuk memahami proses pengerjaan. Platform tidak mengunci browser Anda dan tidak mengakses kamera/mikrofon.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-muted-foreground">
                Pastikan koneksi internet Anda stabil sebelum memulai.
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white gap-2 font-semibold shadow">
                <Sparkles className="w-4 h-4" />
                Mulai Pengerjaan Ujian
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    );
  }

  // ==========================================
  // STAGE 2: PENGIRIMAN SEDANG BERLANGSUNG
  // ==========================================
  if (stage === "submitting") {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="p-8 max-w-md w-full bg-card rounded-2xl border border-border shadow-lg text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Sedang Mengirim Jawaban Ujian...</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Mohon menunggu dan jangan menutup halaman ini. Sistem sedang menyimpan jawaban {QUESTIONS.length} soal Anda ke database dan menghitung skor otomatis.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
            <Sparkles className="w-4 h-4 animate-bounce" />
            <span>Menyiapkan Lembar Bukti Tanda Terima...</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 3: LAYAR UJIAN AKTIF
  // ==========================================
  return (
    <div
      className="min-h-screen bg-muted/20 pb-20 select-none relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Dynamic Security Watermark (Anti-Camera / Anti-Leak) */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden opacity-[0.035] dark:opacity-[0.05] flex flex-wrap gap-12 p-8 rotate-[-15deg] items-center justify-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="text-center font-mono text-[11px] font-bold text-foreground tracking-widest whitespace-nowrap">
            {studentName} • {studentClass} • MI‘YAR NAHWU
          </div>
        ))}
      </div>
      {/* Sticky Exam Header */}
      <div className="sticky top-16 z-30 w-full border-b bg-card/95 backdrop-blur shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Student Info & Question Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNavGridOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-input bg-background hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Grid className="w-4 h-4 text-emerald-800" />
              <span>Daftar Soal</span>
              <Badge variant="secondary" className="ml-1 text-[11px] px-1.5 py-0">
                {currentIndex + 1}/{QUESTIONS.length}
              </Badge>
            </button>

            <div className="hidden sm:block text-xs">
              <span className="font-semibold text-foreground">{studentName}</span>
              <span className="text-muted-foreground"> ({studentClass})</span>
            </div>
          </div>

          {/* Quick Stats & Submit */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background border-border text-xs font-semibold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{answeredCount} / {QUESTIONS.length} Terjawab</span>
            </div>

            <Button
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Ujian</span>
            </Button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <Progress value={progressPercent} className="h-1 rounded-none bg-muted" />
      </div>

      {/* Main Exam Content Area */}
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8 space-y-6">
        {/* Banner: Seluruh Soal Selesai Dijawab */}
        {answeredCount === QUESTIONS.length && (
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border-2 border-emerald-600 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-7 h-7 text-emerald-200" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200/90 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" /> {QUESTIONS.length} dari {QUESTIONS.length} Soal Selesai Terjawab
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Alhamdulillah, seluruh {QUESTIONS.length} soal telah selesai dijawab!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Anda sudah mengisi semua nomor. Anda dapat meneliti kembali jawaban Anda atau langsung mengirimkan ujian sekarang.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold gap-2 px-6 shadow-md shrink-0 py-6 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Jawaban Sekarang</span>
            </Button>
          </div>
        )}

        {/* Transparent Focus Notice Banner if triggered */}
        {focusNotice && (
          <Alert variant="amber" className="shadow-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-xs font-semibold">Catatan Aktivitas Layar</AlertTitle>
            <AlertDescription className="text-xs flex items-center justify-between">
              <span>{focusNotice}</span>
              <button
                onClick={() => setFocusNotice(null)}
                className="underline ml-2 text-xs font-medium text-amber-900 dark:text-amber-300"
              >
                Tutup
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Question Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                  {currentQ.id}
                </span>
                <Badge variant="outline" className="text-xs">
                  Pelajaran {currentQ.babNumber}: {currentQ.pageRef}
                </Badge>
                <Badge
                  variant={currentQ.gradingType === "otomatis" ? "emerald" : "amber"}
                  className="text-xs"
                >
                  {currentQ.type.replace("_", " ").toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="text-xs font-mono">
                  {currentQ.points} Poin
                </Badge>
              </div>

              <Button
                variant={markedQuestions[currentQ.id] ? "default" : "outline"}
                size="sm"
                onClick={toggleMarkQuestion}
                className={`text-xs gap-1.5 h-8 ${
                  markedQuestions[currentQ.id]
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "text-muted-foreground"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedQuestions[currentQ.id] ? "Ditandai" : "Tandai Soal"}</span>
              </Button>
            </div>

            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400 mt-2">
              Bab: {currentQ.babTitle}
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Indonesian Instruction */}
            <div className="text-sm font-medium text-foreground bg-muted/30 p-3.5 rounded-lg border border-border/60">
              {currentQ.instruction}
            </div>

            {/* Arabic Stimulus / Prompt */}
            <div className="p-6 rounded-xl bg-card border border-border/80 text-right">
              <div className="arabic-text text-2xl sm:text-3xl font-bold text-foreground leading-[2.2]">
                {currentQ.prompt}
              </div>
            </div>

            {/* Input by Question Type */}
            <div className="pt-2">
              {/* 1. Pilihan Ganda & Benar / Salah & Identifikasi */}
              {(currentQ.type === "pilihan_ganda" ||
                currentQ.type === "benar_salah" ||
                currentQ.type === "identifikasi") &&
                currentQ.options && (
                  <RadioGroup
                    value={answers[currentQ.id] || ""}
                    onValueChange={handleAnswerChange}
                    className="space-y-3"
                  >
                    {currentQ.options.map((opt, i) => {
                      const isSelected = answers[currentQ.id] === opt;
                      return (
                        <label
                          key={i}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-emerald-50/80 border-emerald-600 dark:bg-emerald-950/30 text-foreground shadow-sm ring-1 ring-emerald-600"
                              : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={opt} id={`opt-${currentQ.id}-${i}`} />
                            <span className="font-mono text-xs text-muted-foreground">
                              {String.fromCharCode(65 + i)}.
                            </span>
                          </div>
                          <span className="arabic-text text-lg sm:text-xl font-medium text-right text-foreground pr-2">
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                )}

              {/* 2. Isian Singkat */}
              {currentQ.type === "isian_singkat" && (
                <div className="space-y-2">
                  <Label htmlFor={`input-${currentQ.id}`} className="text-xs text-muted-foreground">
                    Ketik jawaban isian Anda di bawah ini (Bahasa Arab):
                  </Label>
                  <Input
                    id={`input-${currentQ.id}`}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="اكتب الإجابة هنا..."
                    className="arabic-text text-xl h-14 px-4 text-right"
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground">
                    * Sistem menerima variasi bentuk penulisan tanpa dan dengan harakat standar.
                  </p>
                </div>
              )}

              {/* 3. Tashkeel, Transformasi Kalimat, Koreksi Kesalahan, I'rab */}
              {(currentQ.type === "tashkeel" ||
                currentQ.type === "transformasi" ||
                currentQ.type === "koreksi" ||
                currentQ.type === "irab") && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <Label htmlFor={`textarea-${currentQ.id}`}>
                      Tulis jawaban uraian/analisis Anda di bawah ini (akan diperiksa guru):
                    </Label>
                    <Badge variant="amber" className="text-[10px]">
                      Koreksi Guru
                    </Badge>
                  </div>
                  <Textarea
                    id={`textarea-${currentQ.id}`}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="اكتب الإجابة والشرح هنا..."
                    rows={4}
                    className="arabic-text text-lg sm:text-xl p-4 text-right min-h-[120px]"
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground">
                    * Jawaban Anda akan dinilai langsung oleh guru berdasarkan rubrik kaidah Al-Nahw al-Wadih.
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          {/* Card Navigation Footer */}
          <CardFooter className="border-t bg-muted/10 p-4 sm:p-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Button>

            <div className="text-xs text-muted-foreground hidden sm:block">
              Soal {currentIndex + 1} dari {QUESTIONS.length}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSubmitDialogOpen(true)}
                className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Ujian ({answeredCount}/{QUESTIONS.length})</span>
              </Button>

              {currentIndex < QUESTIONS.length - 1 ? (
                <Button
                  onClick={() => setCurrentIndex((prev) => Math.min(QUESTIONS.length - 1, prev + 1))}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1.5 shadow-sm font-semibold"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setIsSubmitDialogOpen(true)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1.5 shadow-sm font-bold"
                >
                  <Send className="w-4 h-4" />
                  <span>Selesai & Kirim</span>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Quick Nav Bar below Question */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border bg-card text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <strong>{answeredCount}</strong> Terjawab
            </span>
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <strong>{markedCount}</strong> Ditandai
            </span>
            <span>
              <strong>{unansweredCount}</strong> Belum
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs h-7 gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Kirim Ujian</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNavGridOpen(true)}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-medium h-7"
            >
              Buka Navigasi Grid (1–{QUESTIONS.length})
            </Button>
          </div>
        </div>

        {/* Connection or Submission Error */}
        {submissionError && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertTitle>Gagal Menyimpan Ujian</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{submissionError}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  isSubmittingRef.current = false;
                  handleSubmitExam(false);
                }}
                className="ml-3 gap-1 bg-background text-foreground"
              >
                <RotateCcw className="w-3 h-3" /> Coba Kirim Ulang
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Modal: Navigasi Nomor Soal Grid */}
      <Dialog open={isNavGridOpen} onOpenChange={setIsNavGridOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold">Navigasi {QUESTIONS.length} Nomor Soal</DialogTitle>
            <DialogDescription className="text-xs">
              Klik nomor soal untuk melompat langsung ke soal tersebut.
            </DialogDescription>
          </DialogHeader>

          {/* Filter Bar in Dialog */}
          <div className="flex items-center gap-2 pb-3 border-b text-xs">
            <span className="text-muted-foreground">Filter:</span>
            <button
              onClick={() => setNavFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                navFilter === "all" ? "bg-emerald-800 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({QUESTIONS.length})
            </button>
            <button
              onClick={() => setNavFilter("unanswered")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                navFilter === "unanswered" ? "bg-emerald-800 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Belum Dijawab ({unansweredCount})
            </button>
            <button
              onClick={() => setNavFilter("marked")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                navFilter === "marked" ? "bg-emerald-800 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Ditandai ({markedCount})
            </button>
          </div>

          {/* Numbers Grid */}
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {QUESTIONS.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]?.trim());
                const isMarked = Boolean(markedQuestions[q.id]);
                const isCurrent = idx === currentIndex;

                // Filter check
                if (navFilter === "unanswered" && isAnswered) return null;
                if (navFilter === "marked" && !isMarked) return null;

                let btnClass = "border-border bg-card text-foreground hover:bg-muted";
                if (isCurrent) {
                  btnClass = "border-emerald-700 bg-emerald-800 text-white ring-2 ring-emerald-500 font-bold";
                } else if (isMarked) {
                  btnClass = "border-amber-500 bg-amber-100 text-amber-900 font-semibold";
                } else if (isAnswered) {
                  btnClass = "border-emerald-400 bg-emerald-100/70 text-emerald-900 font-medium";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsNavGridOpen(false);
                    }}
                    className={`h-10 rounded-lg border text-xs flex flex-col items-center justify-center transition-all ${btnClass}`}
                  >
                    <span>{q.id}</span>
                    {isMarked && <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend and Submit Actions */}
          <div className="border-t pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" /> Terjawab ({answeredCount})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-amber-100 border border-amber-500" /> Ditandai ({markedCount})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-card border border-border" /> Belum ({unansweredCount})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsNavGridOpen(false)}>
                Tutup
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsNavGridOpen(false);
                  setIsSubmitDialogOpen(true);
                }}
                className={`text-white font-bold gap-1.5 shadow-sm ${
                  answeredCount === QUESTIONS.length
                    ? "bg-emerald-800 hover:bg-emerald-900 ring-2 ring-emerald-400"
                    : "bg-emerald-800 hover:bg-emerald-900"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {answeredCount === QUESTIONS.length
                    ? `Kirim Ujian (${QUESTIONS.length}/${QUESTIONS.length} Selesai)`
                    : `Kirim Ujian (${answeredCount}/${QUESTIONS.length})`}
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Konfirmasi Pengiriman Ujian */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Konfirmasi Pengiriman Ujian
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm space-y-3">
              <p>
                Apakah Anda yakin ingin menyelesaikan dan mengirimkan lembar jawaban ujian nahwu Anda sekarang?
              </p>

              <div className="p-3.5 rounded-lg bg-muted/50 border border-border space-y-1.5 text-xs text-foreground">
                <div className="flex justify-between">
                  <span>Nama Peserta:</span>
                  <strong className="text-emerald-900">{studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Soal Terjawab:</span>
                  <strong>{answeredCount} dari {QUESTIONS.length} soal</strong>
                </div>
                <div className="flex justify-between">
                  <span>Soal Belum Dijawab:</span>
                  <span className={unansweredCount > 0 ? "text-amber-700 font-bold" : ""}>
                    {unansweredCount} soal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Soal Ditandai Ditinjau:</span>
                  <strong>{markedCount} soal</strong>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-2.5 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <span>
                    Masih terdapat <strong>{unansweredCount} soal</strong> yang belum Anda isi. Soal yang tidak terisi akan dihitung sebagai 0 poin.
                  </span>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Setelah dikirim, jawaban tidak dapat diubah kembali.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                isSubmittingRef.current = false;
                setIsSubmitDialogOpen(false);
                handleSubmitExam(false);
              }}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
            >
              Ya, Kirim Ujian
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
