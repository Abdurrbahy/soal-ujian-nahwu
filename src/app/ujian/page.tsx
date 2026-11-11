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
              <CardDescription>
                Harap membaca dan mematuhi seluruh tata tertib berikut sebelum memulai ujian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-sm text-muted-foreground leading-relaxed">
              <ol className="list-decimal pl-5 space-y-3.5 text-foreground">
                <li>
                  <strong>Berdoa kepada Allah Ta‘ala:</strong> Luruskan niat semata-mata menuntut ilmu karena Allah, baca basmalah, serta berdoalah memohon kemudahan, ketelitian, dan taufik sebelum mulai menjawab soal.
                </li>
                <li>
                  <strong>Menjaga Kejujuran & Memenuhi Syarat (Hadis):</strong> Wajib menjunjung tinggi sifat amanah dan menaati aturan ujian. Rasulullah ﷺ bersabda:
                  <div className="my-1.5 p-2.5 rounded-md bg-muted/60 border border-border/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                    <span className="arabic-inline text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-300">
                      «الْمُؤْمِنُونَ عَلَى شُرُوطِهِمْ»
                    </span>
                    <span className="text-xs italic text-muted-foreground">
                      “Kaum mukminin itu terikat pada syarat-syarat (kesepakatan) mereka.” (HR. Abu Dawud)
                    </span>
                  </div>
                </li>
                <li>
                  <strong>Dilarang Mencontek & Bekerja Sama:</strong> Dilarang keras membuka buku/catatan materi nahwu, membuka catatan digital, bertanya kepada teman, ataupun meminta bantuan orang lain. Kerjakan murni atas ikhtiar sendiri sebagai bentuk muraqabatullah (merasa senantiasa diawasi Allah).
                </li>
                <li>
                  <strong>Dilarang Membuka Tab atau Aplikasi Lain:</strong> Selama ujian berlangsung, santri tidak diperkenankan membuka tab baru di peramban (browser), beralih ke aplikasi lain, ataupun meminimalkan jendela ujian.
                </li>
                <li>
                  <strong>Fitur Pendeteksi Otomatis:</strong> Sistem IDN Mekkah Madinah dilengkapi teknologi pengawasan digital yang otomatis mencatat durasi ketika Anda berpindah tab/jendela, serta mendeteksi upaya tangkapan layar (screenshot). Seluruh aktivitas ini dicatat dan ditampilkan langsung pada portal guru.
                </li>
                <li>
                  <strong>Ketentuan Soal & Pengiriman:</strong> Ujian terdiri dari {QUESTIONS.length} butir soal (Pelajaran 1–20 Al-Nahw al-Wadih Juz 2). Pengerjaan bersifat mandiri tanpa batasan hitung mundur (countdown), dan lembar jawaban dapat dikirimkan kapan saja setelah Anda memeriksa kembali secara teliti.
                </li>
              </ol>

              <div className="p-4 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-100">
                  <ShieldAlert className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  Komitmen Kejujuran & Adab Penuntut Ilmu:
                </div>
                <p className="leading-relaxed">
                  Ujian bukan hanya mengukur kecakapan kaidah bahasa Arab, melainkan menguji integritas dan ketakwaan kita. Nilai yang berkah lahir dari kejujuran dan usaha yang diridhai Allah Ta‘ala.
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
            {studentName} • {studentClass} • IDN MEKKAH MADINAH
          </div>
        ))}
      </div>
      {/* Sticky Exam Header */}
      <div className="sticky top-14 sm:top-16 z-30 w-full border-b bg-card/95 backdrop-blur shadow-sm">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          {/* Student Info & Question Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsNavGridOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-input bg-background hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="sm:hidden">Soal</span>
              <Badge variant="secondary" className="text-[11px] px-1.5 py-0 h-4 font-mono">
                {currentIndex + 1}/{QUESTIONS.length}
              </Badge>
            </button>

            <div className="text-xs truncate max-w-[90px] xs:max-w-[130px] sm:max-w-[200px]">
              <span className="font-semibold text-foreground truncate block">{studentName}</span>
              <span className="text-[11px] text-muted-foreground hidden md:inline"> ({studentClass})</span>
            </div>
          </div>

          {/* Quick Stats & Submit */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md border bg-background text-[11px] sm:text-xs font-semibold text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{answeredCount}/{QUESTIONS.length}</span>
              <span className="hidden sm:inline"> Terjawab</span>
            </div>

            <Button
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold gap-1 text-xs px-2.5 sm:px-3 h-8 shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Kirim</span>
              <span className="hidden sm:inline"> Ujian</span>
            </Button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <Progress value={progressPercent} className="h-1 rounded-none bg-muted" />
      </div>

      {/* Main Exam Content Area */}
      <div className="container mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Banner: Seluruh Soal Selesai Dijawab */}
        {answeredCount === QUESTIONS.length && (
          <div className="p-3.5 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border-2 border-emerald-600 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-200" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-200/90 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" /> {QUESTIONS.length} dari {QUESTIONS.length} Soal Selesai Terjawab
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-foreground">
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
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold gap-2 px-5 sm:px-6 shadow-md shrink-0 py-5 sm:py-6 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Jawaban Sekarang</span>
            </Button>
          </div>
        )}

        {/* Transparent Focus Notice Banner if triggered */}
        {focusNotice && (
          <Alert variant="amber" className="shadow-sm p-3 sm:p-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-xs font-semibold">Catatan Aktivitas Layar</AlertTitle>
            <AlertDescription className="text-xs flex items-center justify-between gap-2 mt-1">
              <span className="leading-relaxed">{focusNotice}</span>
              <button
                onClick={() => setFocusNotice(null)}
                className="underline ml-2 text-xs font-semibold text-amber-900 dark:text-amber-300 shrink-0"
              >
                Tutup
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Question Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b bg-muted/20 p-3.5 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-2xs">
                  {currentQ.id}
                </span>
                <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                  Bab {currentQ.babNumber}
                </Badge>
                <Badge
                  variant={currentQ.gradingType === "otomatis" ? "emerald" : "amber"}
                  className="text-[10px] sm:text-xs px-2 py-0.5"
                >
                  {currentQ.type.replace("_", " ").toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs font-mono px-2 py-0.5">
                  {currentQ.points} Poin
                </Badge>
              </div>

              <Button
                variant={markedQuestions[currentQ.id] ? "default" : "outline"}
                size="sm"
                onClick={toggleMarkQuestion}
                className={`text-xs gap-1 h-7 sm:h-8 px-2 sm:px-2.5 shrink-0 ${
                  markedQuestions[currentQ.id]
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "text-muted-foreground"
                }`}
              >
                <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{markedQuestions[currentQ.id] ? "Ditandai" : "Tandai"}</span>
              </Button>
            </div>

            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400 mt-2 line-clamp-1">
              Bab: {currentQ.babTitle}
            </p>
          </CardHeader>

          <CardContent className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
            {/* Indonesian Instruction */}
            <div className="text-xs sm:text-sm font-medium text-foreground bg-muted/35 p-3 sm:p-3.5 rounded-lg border border-border/60 leading-relaxed">
              {currentQ.instruction}
            </div>

            {/* Arabic Stimulus / Prompt */}
            <div className="p-4 sm:p-6 rounded-xl bg-card border border-border/80 text-right overflow-x-auto">
              <div className="arabic-text text-xl sm:text-3xl font-bold text-foreground leading-[2.2] sm:leading-[2.2] break-words">
                {currentQ.prompt}
              </div>
            </div>

            {/* Input by Question Type */}
            <div className="pt-1 sm:pt-2">
              {/* 1. Pilihan Ganda & Benar / Salah & Identifikasi */}
              {(currentQ.type === "pilihan_ganda" ||
                currentQ.type === "benar_salah" ||
                currentQ.type === "identifikasi") &&
                currentQ.options && (
                  <RadioGroup
                    value={answers[currentQ.id] || ""}
                    onValueChange={handleAnswerChange}
                    className="space-y-2.5 sm:space-y-3"
                  >
                    {currentQ.options.map((opt, i) => {
                      const isSelected = answers[currentQ.id] === opt;
                      return (
                        <label
                          key={i}
                          className={`flex items-start justify-between p-3 sm:p-4 rounded-xl border cursor-pointer transition-all gap-3 ${
                            isSelected
                              ? "bg-emerald-50/80 border-emerald-600 dark:bg-emerald-950/30 text-foreground shadow-sm ring-1 ring-emerald-600"
                              : "border-border hover:bg-muted/40 active:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 pt-1">
                            <RadioGroupItem value={opt} id={`opt-${currentQ.id}-${i}`} />
                            <span className="font-mono text-xs font-semibold text-muted-foreground">
                              {String.fromCharCode(65 + i)}.
                            </span>
                          </div>
                          <span className="arabic-text text-base sm:text-xl font-medium text-right text-foreground pr-1 flex-1 min-w-0 break-words leading-[2.0]">
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
                    className="arabic-text text-lg sm:text-xl h-12 sm:h-14 px-3 sm:px-4 text-right"
                    dir="rtl"
                  />
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
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
                      Tulis jawaban uraian/analisis Anda:
                    </Label>
                    <Badge variant="amber" className="text-[10px] px-1.5 py-0">
                      Koreksi Guru
                    </Badge>
                  </div>
                  <Textarea
                    id={`textarea-${currentQ.id}`}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="اكتب الإجابة والشرح هنا..."
                    rows={4}
                    className="arabic-text text-base sm:text-xl p-3 sm:p-4 text-right min-h-[110px]"
                    dir="rtl"
                  />
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    * Jawaban akan diperiksa dan dinilai langsung oleh guru.
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          {/* Card Navigation Footer */}
          <CardFooter className="border-t bg-muted/10 p-3 sm:p-5 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="gap-1 sm:gap-1.5 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Button>

            <div className="text-xs font-semibold text-muted-foreground">
              <span className="text-foreground">{currentIndex + 1}</span> / {QUESTIONS.length}
            </div>

            {currentIndex < QUESTIONS.length - 1 ? (
              <Button
                onClick={() => setCurrentIndex((prev) => Math.min(QUESTIONS.length - 1, prev + 1))}
                className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1 sm:gap-1.5 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 shadow-sm font-semibold"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setIsSubmitDialogOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1 sm:gap-1.5 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 shadow-sm font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Selesai & Kirim</span>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Quick Nav Bar below Question */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border bg-card text-xs text-muted-foreground shadow-2xs">
          <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <strong className="text-foreground">{answeredCount}</strong> Terjawab
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <strong className="text-foreground">{markedCount}</strong> Ditandai
            </span>
            <span className="font-medium">
              <strong className="text-foreground">{unansweredCount}</strong> Belum
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNavGridOpen(true)}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold h-8 gap-1 flex-1 sm:flex-initial"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-700" />
              <span>Daftar {QUESTIONS.length} Soal</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs h-8 gap-1 flex-1 sm:flex-initial shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Kirim Ujian</span>
            </Button>
          </div>
        </div>

        {/* Connection or Submission Error */}
        {submissionError && (
          <Alert variant="destructive" className="p-3 sm:p-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertTitle className="text-xs sm:text-sm font-bold">Gagal Menyimpan Ujian</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-1">
              <span className="text-xs leading-relaxed">{submissionError}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  isSubmittingRef.current = false;
                  handleSubmitExam(false);
                }}
                className="gap-1 bg-background text-foreground h-8 text-xs shrink-0"
              >
                <RotateCcw className="w-3 h-3" /> Coba Kirim Ulang
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Modal: Navigasi Nomor Soal Grid */}
      <Dialog open={isNavGridOpen} onOpenChange={setIsNavGridOpen}>
        <DialogContent className="w-[94vw] sm:max-w-2xl max-h-[88vh] overflow-hidden flex flex-col p-4 sm:p-6 rounded-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base sm:text-lg font-bold">Navigasi {QUESTIONS.length} Nomor Soal</DialogTitle>
            <DialogDescription className="text-xs">
              Klik nomor soal untuk melompat langsung ke soal tersebut.
            </DialogDescription>
          </DialogHeader>

          {/* Filter Bar in Dialog */}
          <div className="flex items-center gap-1.5 pb-2.5 border-b text-xs overflow-x-auto">
            <span className="text-muted-foreground shrink-0">Filter:</span>
            <button
              onClick={() => setNavFilter("all")}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                navFilter === "all" ? "bg-emerald-800 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({QUESTIONS.length})
            </button>
            <button
              onClick={() => setNavFilter("unanswered")}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                navFilter === "unanswered" ? "bg-emerald-800 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Belum ({unansweredCount})
            </button>
            <button
              onClick={() => setNavFilter("marked")}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                navFilter === "marked" ? "bg-emerald-800 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Ditandai ({markedCount})
            </button>
          </div>

          {/* Numbers Grid */}
          <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
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
                    className={`h-9 sm:h-10 rounded-lg border text-xs flex flex-col items-center justify-center transition-all ${btnClass}`}
                  >
                    <span>{q.id}</span>
                    {isMarked && <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend and Actions */}
          <div className="border-t pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-around w-full sm:w-auto gap-2 text-[11px]">
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-400" /> Terjawab ({answeredCount})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-500" /> Ditandai ({markedCount})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-card border border-border" /> Belum ({unansweredCount})
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-initial h-8 text-xs" onClick={() => setIsNavGridOpen(false)}>
                Tutup
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsNavGridOpen(false);
                  setIsSubmitDialogOpen(true);
                }}
                className="flex-1 sm:flex-initial h-8 text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-bold gap-1 shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>Kirim Ujian</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Konfirmasi Pengiriman Ujian */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent className="w-[94vw] sm:max-w-md p-4 sm:p-6 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg font-bold">
              Konfirmasi Pengiriman Ujian
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm space-y-3">
              <p>
                Apakah Anda yakin ingin menyelesaikan dan mengirimkan lembar jawaban ujian nahwu Anda sekarang?
              </p>

              <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-1.5 text-xs text-foreground">
                <div className="flex justify-between">
                  <span>Nama Peserta:</span>
                  <strong className="text-emerald-900 dark:text-emerald-300 truncate max-w-[160px]">{studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Kelas:</span>
                  <strong>{studentClass}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Soal Terjawab:</span>
                  <strong>{answeredCount} dari {QUESTIONS.length} soal</strong>
                </div>
                <div className="flex justify-between">
                  <span>Soal Belum Dijawab:</span>
                  <span className={unansweredCount > 0 ? "text-amber-700 dark:text-amber-400 font-bold" : ""}>
                    {unansweredCount} soal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Soal Ditandai Ditinjau:</span>
                  <strong>{markedCount} soal</strong>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
                  <span>
                    Masih terdapat <strong>{unansweredCount} soal</strong> yang belum Anda isi. Soal yang tidak terisi akan dihitung sebagai 0 poin.
                  </span>
                </div>
              )}

              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Setelah dikirim, jawaban tidak dapat diubah kembali.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 justify-end sm:justify-end mt-2">
            <AlertDialogCancel className="flex-1 sm:flex-initial m-0 h-9 text-xs">Periksa Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                isSubmittingRef.current = false;
                setIsSubmitDialogOpen(false);
                handleSubmitExam(false);
              }}
              className="flex-1 sm:flex-initial m-0 h-9 text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
            >
              Ya, Kirim Ujian
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
