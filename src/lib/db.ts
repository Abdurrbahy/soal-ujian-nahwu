import fs from "fs/promises";
import path from "path";
import { Submission, ManualGradeItem, FocusEventRecord, SubmissionStatus } from "@/types/exam";
import { QUESTIONS } from "@/data/questions";
import { checkAnswerMatch } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";

// In Vercel serverless environment, only /tmp is writable for file fallback
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "miyar_data")
  : path.join(process.cwd(), "data");

const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

export interface ExamSettings {
  durationMinutes: number;
  examTitle: string;
  targetChapterMin: number;
  targetChapterMax: number;
}

const DEFAULT_SETTINGS: ExamSettings = {
  durationMinutes: 90,
  examTitle: "Ujian Nahwu Semester: Al-Nahw al-Wadih Juz 2 (Pelajaran 1–26)",
  targetChapterMin: 1,
  targetChapterMax: 26,
};

function rowToSubmission(row: Record<string, unknown>): Submission {
  return {
    id: String(row.id),
    studentName: String(row.student_name),
    studentClass: String(row.student_class),
    studentSection: String(row.student_section || ""),
    startedAt: String(row.started_at),
    submittedAt: String(row.submitted_at),
    durationSpentSec: Number(row.duration_spent_sec) || 0,
    autoSubmitted: Boolean(row.auto_submitted),
    examVersion: String(row.exam_version || "miyar-v1.0"),
    answers: (row.answers as Record<number, string>) || {},
    autoScore: Number(row.auto_score) || 0,
    maxAutoScore: Number(row.max_auto_score) || 46,
    manualScore: Number(row.manual_score) || 0,
    maxManualScore: Number(row.max_manual_score) || 58,
    totalScore: Number(row.total_score) || 0,
    maxTotalScore: Number(row.max_total_score) || 104,
    percentage: Number(row.percentage) || 0,
    status: (row.status as SubmissionStatus) || "menunggu_penilaian",
    focusEvents: (row.focus_events as FocusEventRecord[]) || [],
    manualGrading: (row.manual_grading as Record<number, ManualGradeItem>) || {},
  };
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore if already exists
  }
}

// ----------------------------------------------------
// EXAM SETTINGS
// ----------------------------------------------------
export async function getExamSettings(): Promise<ExamSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("exam_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (!error && data) {
        return {
          durationMinutes: data.duration_minutes || DEFAULT_SETTINGS.durationMinutes,
          examTitle: data.exam_title || DEFAULT_SETTINGS.examTitle,
          targetChapterMin: data.target_chapter_min || DEFAULT_SETTINGS.targetChapterMin,
          targetChapterMax: data.target_chapter_max || DEFAULT_SETTINGS.targetChapterMax,
        };
      }
    } catch (e) {
      console.error("Supabase getExamSettings error, falling back to local file:", e);
    }
  }

  // Local File Fallback
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    try {
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
    } catch {}
    return DEFAULT_SETTINGS;
  }
}

export async function updateExamSettings(settings: Partial<ExamSettings>): Promise<ExamSettings> {
  const current = await getExamSettings();
  const updated: ExamSettings = { ...current, ...settings };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("exam_settings").upsert({
        id: "default",
        duration_minutes: updated.durationMinutes,
        exam_title: updated.examTitle,
        target_chapter_min: updated.targetChapterMin,
        target_chapter_max: updated.targetChapterMax,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Supabase updateExamSettings error:", e);
    }
  }

  await ensureDataDir();
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}

  return updated;
}

// ----------------------------------------------------
// SUBMISSIONS
// ----------------------------------------------------
export async function getAllSubmissions(): Promise<Submission[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (!error && data) {
        return data.map(rowToSubmission);
      }
      if (error) {
        console.error("Supabase getAllSubmissions error:", error);
      }
    } catch (e) {
      console.error("Supabase error, falling back to local file:", e);
    }
  }

  // Local File Fallback
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    const data: Submission[] = JSON.parse(raw);
    return data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch {
    try {
      await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
    } catch {}
    return [];
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return rowToSubmission(data);
      }
    } catch (e) {
      console.error("Supabase getSubmissionById error:", e);
    }
  }

  const all = await getAllSubmissions();
  return all.find((s) => s.id === id) || null;
}

// Mutex lock to strictly serialize writes in concurrent scenarios
let writeMutex = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = writeMutex.then(fn, fn);
  writeMutex = result.then(() => {}, () => {});
  return result;
}

export async function saveNewSubmission(data: {
  studentName: string;
  studentClass: string;
  studentSection?: string;
  startedAt: string;
  submittedAt: string;
  durationSpentSec: number;
  autoSubmitted: boolean;
  answers: Record<number, string>;
  focusEvents: FocusEventRecord[];
}): Promise<Submission> {
  return withLock(async () => {
    // Calculate automatic scoring server-side
    let autoScore = 0;
    let maxAutoScore = 0;
    let maxManualScore = 0;

    for (const q of QUESTIONS) {
      if (q.gradingType === "otomatis") {
        maxAutoScore += q.points;
        const studentAns = data.answers[q.id];
        if (studentAns && q.key) {
          if (checkAnswerMatch(studentAns, q.key, q.acceptedVariants)) {
            autoScore += q.points;
          }
        }
      } else {
        maxManualScore += q.points;
      }
    }

    const maxTotalScore = maxAutoScore + maxManualScore;
    const initialManualScore = 0;
    const initialTotalScore = autoScore + initialManualScore;
    const percentage = Math.round((initialTotalScore / maxTotalScore) * 100);

    const submission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentName: data.studentName.trim(),
      studentClass: data.studentClass.trim(),
      studentSection: data.studentSection?.trim() || "",
      startedAt: data.startedAt,
      submittedAt: data.submittedAt,
      durationSpentSec: data.durationSpentSec,
      autoSubmitted: data.autoSubmitted,
      examVersion: "miyar-v1.0",
      answers: data.answers,
      autoScore,
      maxAutoScore,
      manualScore: initialManualScore,
      maxManualScore,
      totalScore: initialTotalScore,
      maxTotalScore,
      percentage,
      status: "menunggu_penilaian",
      focusEvents: data.focusEvents || [],
      manualGrading: {},
    };

    // 1. Insert into Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from("submissions").insert({
          id: submission.id,
          student_name: submission.studentName,
          student_class: submission.studentClass,
          student_section: submission.studentSection,
          started_at: submission.startedAt,
          submitted_at: submission.submittedAt,
          duration_spent_sec: submission.durationSpentSec,
          auto_submitted: submission.autoSubmitted,
          exam_version: submission.examVersion,
          answers: submission.answers,
          auto_score: submission.autoScore,
          max_auto_score: submission.maxAutoScore,
          manual_score: submission.manualScore,
          max_manual_score: submission.maxManualScore,
          total_score: submission.totalScore,
          max_total_score: submission.maxTotalScore,
          percentage: submission.percentage,
          status: submission.status,
          focus_events: submission.focusEvents,
          manual_grading: submission.manualGrading,
        });

        if (error) {
          console.error("Supabase insert error:", error);
        } else {
          return submission;
        }
      } catch (e) {
        console.error("Supabase insert exception, writing to local file:", e);
      }
    }

    // 2. Local file persistence
    await ensureDataDir();
    const all = await getAllSubmissions();
    all.unshift(submission);
    try {
      const tmpFile = `${SUBMISSIONS_FILE}.tmp.${Date.now()}`;
      await fs.writeFile(tmpFile, JSON.stringify(all, null, 2), "utf-8");
      await fs.rename(tmpFile, SUBMISSIONS_FILE);
    } catch (err) {
      console.error("Local file persist error:", err);
    }

    return submission;
  });
}

export async function updateSubmissionGrading(
  id: string,
  grades: Record<number, ManualGradeItem>
): Promise<Submission | null> {
  return withLock(async () => {
    const current = await getSubmissionById(id);
    if (!current) return null;

    const updatedManualGrading = { ...current.manualGrading, ...grades };

    // Calculate manual score
    let manualScore = 0;
    let manualCount = 0;
    const totalManualQuestions = QUESTIONS.filter((q) => q.gradingType === "manual").length;

    for (const q of QUESTIONS) {
      if (q.gradingType === "manual") {
        const g = updatedManualGrading[q.id];
        if (g !== undefined && typeof g.score === "number") {
          manualScore += Math.min(Math.max(0, g.score), q.points);
          manualCount++;
        }
      }
    }

    let status: SubmissionStatus = "menunggu_penilaian";
    if (manualCount === totalManualQuestions) {
      status = "selesai_dinilai";
    } else if (manualCount > 0) {
      status = "dinilai_sebagian";
    }

    const totalScore = current.autoScore + manualScore;
    const percentage = Math.round((totalScore / current.maxTotalScore) * 100);

    const updatedSubmission: Submission = {
      ...current,
      manualScore,
      totalScore,
      percentage,
      status,
      manualGrading: updatedManualGrading,
    };

    // 1. Update in Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from("submissions")
          .update({
            manual_score: updatedSubmission.manualScore,
            total_score: updatedSubmission.totalScore,
            percentage: updatedSubmission.percentage,
            status: updatedSubmission.status,
            manual_grading: updatedSubmission.manualGrading,
          })
          .eq("id", id);

        if (!error) {
          return updatedSubmission;
        }
      } catch (e) {
        console.error("Supabase update error:", e);
      }
    }

    // 2. Local file persistence
    const all = await getAllSubmissions();
    const idx = all.findIndex((s) => s.id === id);
    if (idx !== -1) {
      all[idx] = updatedSubmission;
      try {
        const tmpFile = `${SUBMISSIONS_FILE}.tmp.${Date.now()}`;
        await fs.writeFile(tmpFile, JSON.stringify(all, null, 2), "utf-8");
        await fs.rename(tmpFile, SUBMISSIONS_FILE);
      } catch (err) {
        console.error("Local file persist error:", err);
      }
    }

    return updatedSubmission;
  });
}

export async function deleteSubmission(id: string): Promise<boolean> {
  return withLock(async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from("submissions").delete().eq("id", id);
        if (!error) return true;
      } catch (e) {
        console.error("Supabase delete error:", e);
      }
    }

    const all = await getAllSubmissions();
    const filtered = all.filter((s) => s.id !== id);
    if (filtered.length === all.length) return false;

    try {
      const tmpFile = `${SUBMISSIONS_FILE}.tmp.${Date.now()}`;
      await fs.writeFile(tmpFile, JSON.stringify(filtered, null, 2), "utf-8");
      await fs.rename(tmpFile, SUBMISSIONS_FILE);
    } catch {}

    return true;
  });
}
