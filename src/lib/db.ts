import fs from "fs/promises";
import path from "path";
import { Submission, ManualGradeItem, FocusEventRecord, SubmissionStatus } from "@/types/exam";
import { QUESTIONS } from "@/data/questions";
import { checkAnswerMatch } from "@/lib/utils";

// In Vercel serverless environment, only /tmp is writable
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

// Optional Cloud KV (Vercel KV / Upstash Redis) support via native fetch
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (json.result) {
      return typeof json.result === "string" ? JSON.parse(json.result) : json.result;
    }
    return null;
  } catch (e) {
    console.error("KV get error:", e);
    return null;
  }
}

async function kvSet(key: string, val: unknown): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(typeof val === "string" ? val : JSON.stringify(val)),
      cache: "no-store",
    });
    return res.ok;
  } catch (e) {
    console.error("KV set error:", e);
    return false;
  }
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore if already exists
  }
}

export async function getExamSettings(): Promise<ExamSettings> {
  // 1. Try Cloud KV if configured
  if (KV_URL && KV_TOKEN) {
    const fromKv = await kvGet<ExamSettings>("miyar_settings");
    if (fromKv) return fromKv;
  }

  // 2. Fallback to file storage
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
  const updated = { ...current, ...settings };

  if (KV_URL && KV_TOKEN) {
    await kvSet("miyar_settings", updated);
  }

  await ensureDataDir();
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}

  return updated;
}

export async function getAllSubmissions(): Promise<Submission[]> {
  // 1. Try Cloud KV if configured
  if (KV_URL && KV_TOKEN) {
    const fromKv = await kvGet<Submission[]>("miyar_submissions");
    if (fromKv && Array.isArray(fromKv)) {
      return fromKv.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
  }

  // 2. Fallback to file storage
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    const data: Submission[] = JSON.parse(raw);
    return data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch {
    // Return empty array - NO DUMMY DATA
    try {
      await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
    } catch {}
    return [];
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const all = await getAllSubmissions();
  return all.find((s) => s.id === id) || null;
}

// Mutex lock to strictly serialize writes and prevent concurrent race conditions
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
    await ensureDataDir();
    const all = await getAllSubmissions();

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

    all.unshift(submission);
    await persistSubmissions(all);
    return submission;
  });
}

export async function updateSubmissionGrading(
  id: string,
  grades: Record<number, ManualGradeItem>
): Promise<Submission | null> {
  return withLock(async () => {
    const all = await getAllSubmissions();
    const index = all.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const current = all[index];
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

    all[index] = updatedSubmission;
    await persistSubmissions(all);
    return updatedSubmission;
  });
}

export async function deleteSubmission(id: string): Promise<boolean> {
  return withLock(async () => {
    const all = await getAllSubmissions();
    const filtered = all.filter((s) => s.id !== id);
    if (filtered.length === all.length) return false;
    await persistSubmissions(filtered);
    return true;
  });
}

async function persistSubmissions(data: Submission[]) {
  // 1. If Cloud KV is configured, write to Cloud KV
  if (KV_URL && KV_TOKEN) {
    await kvSet("miyar_submissions", data);
  }

  // 2. Also write to disk atomically
  try {
    await ensureDataDir();
    const tmpFile = `${SUBMISSIONS_FILE}.tmp.${Date.now()}`;
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmpFile, SUBMISSIONS_FILE);
  } catch (err) {
    console.error("Local file persist error (expected on read-only serverless if KV is used):", err);
  }
}
