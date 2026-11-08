export type QuestionType =
  | "pilihan_ganda"
  | "benar_salah"
  | "isian_singkat"
  | "identifikasi"
  | "tashkeel"
  | "transformasi"
  | "koreksi"
  | "irab";

export type GradingType = "otomatis" | "manual";

export interface Rubric {
  modelAnswer: string;
  criteria: string[];
  fullCredit: string;
  partialCredit?: string;
  noCredit: string;
}

export interface Question {
  id: number;
  babNumber: number;
  babTitle: string;
  pageRef: string;
  type: QuestionType;
  gradingType: GradingType;
  prompt: string;
  instruction: string;
  options?: string[];
  key?: string;
  acceptedVariants?: string[];
  rubric?: Rubric;
  points: number;
}

export interface FocusEventRecord {
  type: "visibility_hidden" | "window_blur";
  timestamp: string;
  durationSec?: number;
  details?: string;
}

export interface ManualGradeItem {
  score: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export type SubmissionStatus = "menunggu_penilaian" | "dinilai_sebagian" | "selesai_dinilai";

export interface Submission {
  id: string;
  studentName: string;
  studentClass: string;
  studentSection?: string;
  startedAt: string;
  submittedAt: string;
  durationSpentSec: number;
  autoSubmitted: boolean;
  examVersion: string;
  answers: Record<number, string>;
  autoScore: number;
  maxAutoScore: number;
  manualScore: number;
  maxManualScore: number;
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  status: SubmissionStatus;
  focusEvents: FocusEventRecord[];
  manualGrading: Record<number, ManualGradeItem>;
}

export interface ChapterMeta {
  babNumber: number;
  titleAr: string;
  titleId: string;
  pageRef: string;
  summary: string;
  rulesSummary: string[];
}
