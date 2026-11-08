import fs from "fs/promises";
import path from "path";
import { Submission, ManualGradeItem, FocusEventRecord, SubmissionStatus } from "@/types/exam";
import { QUESTIONS } from "@/data/questions";
import { checkAnswerMatch } from "@/lib/utils";

const DATA_DIR = path.join(process.cwd(), "data");
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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if already exists
  }
}

export async function getExamSettings(): Promise<ExamSettings> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
    return DEFAULT_SETTINGS;
  }
}

export async function updateExamSettings(settings: Partial<ExamSettings>): Promise<ExamSettings> {
  const current = await getExamSettings();
  const updated = { ...current, ...settings };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

export async function getAllSubmissions(): Promise<Submission[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    const data: Submission[] = JSON.parse(raw);
    return data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch {
    // If file doesn't exist, seed with a realistic sample submission to showcase dashboard
    const sample = createSampleSubmission();
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([sample], null, 2), "utf-8");
    return [sample];
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const all = await getAllSubmissions();
  return all.find((s) => s.id === id) || null;
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
  await atomicWriteSubmissions(all);
  return submission;
}

export async function updateSubmissionGrading(
  id: string,
  grades: Record<number, ManualGradeItem>
): Promise<Submission | null> {
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
  await atomicWriteSubmissions(all);
  return updatedSubmission;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const all = await getAllSubmissions();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  await atomicWriteSubmissions(filtered);
  return true;
}

async function atomicWriteSubmissions(data: Submission[]) {
  const tmpFile = `${SUBMISSIONS_FILE}.tmp.${Date.now()}`;
  await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpFile, SUBMISSIONS_FILE);
}

function createSampleSubmission(): Submission {
  const sampleAnswers: Record<number, string> = {
    1: "سَعَى",
    2: "صحيح (Benar)",
    4: "هَذَا، حَيْثُ، كَتَبَ، مِنْ",
    5: "صحيح (Benar)",
    7: "لم يسع",
    8: "الفتحة الظاهرة على آخره",
    10: "العَصَا",
    11: "صحيح (Benar)",
    14: "لام الجحود",
    16: "مَنْ",
    17: "تجتهد",
    19: "ثُبُوتُ النُّونِ",
    20: "يقصروا",
    22: "جَمْعُ تَكْسِيرٍ",
    23: "خطأ (Salah)",
    24: "شجرتان",
    25: "حَضَرَ الصَّدِيقَانِ وَرَأَيْتُ الصَّدِيقَيْنِ",
    26: "صحيح (Benar)",
    28: "يُرْفَعُ بِالوَاوِ، وَيُنْصَبُ وَيُجَرُّ بِاليَاءِ",
    29: "المجتهدين",
    31: "الكَسْرَةِ نِيَابَةً عَنِ الفَتْحَةِ",
    32: "صحيح (Benar)",
    34: "تُحْذَفُ نُونُهُ",
    35: "طالبا العلم",
    37: "سَلَّمْتُ عَلَى أَبِيكَ",
    38: "أخاك",
    40: "تَاءٌ سَاكِنَةٌ فِي آخِرِهِ (نَحْوُ: كَتَبَتْ)",
    41: "صحيح (Benar)",
    43: "الأَلِفُ المَمْدُودَةُ",
    45: "حمراء",
    46: "نَكِرَةٌ",
    47: "اسْمٌ يَدُلُّ عَلَى شَيْءٍ غَيْرِ مُعَيَّنٍ",
    49: "مَكَّةُ",
    50: "صحيح (Benar)",
    51: "يوسف",
    52: "يُحْذَفُ فَلَا يَجْتَمِعُ مَعَ (أَلْ)",
    55: "مُتَّصِلٌ",
    56: "نَحْنُ نَكْتُبُ (الفاعل ضمير مستتر تقديره نحن)",
    58: "اللَّاتِي / اللَّائِي",
    59: "الهاء في (كرمته)",
    61: "هَاتَانِ",
    62: "هذه",
    68: "الاسْتِمْرَارُ (مُلازَمَةُ الخَبَرِ لِلْمُخْبَرِ عَنْهُ)",
    70: "مُؤَكِّدٌ لِفِعْلِهِ",
    72: "مَفْعُولٌ لأَجْلِهِ مَنْصُوبٌ",
    74: "ظَرْفُ مَكَانٍ",
    // Subjective answers
    3: "الفعل يرمي معتل الآخر بالياء وليس صحيحاً لأن في آخره حرف علة.",
    6: "الطالبات يكتبن الدرس بهدوء.",
    9: "يقضِ: فعل مضارع مجزوم بلم وعلامة جزمه حذف حرف العلة الياء.",
    12: "الفتى: مفعول به منصوب بفتحة مقدرة على الألف منع من ظهورها التعذر.",
    15: "فَتَرْسُبَ",
    18: "مَنْ يَزْرَعْ الخَيْرَ يَحْصُدْهُ",
    21: "أَنْتِ تَكْتُبِينَ الدَّرْسَ",
    27: "قَرَأْتُ كِتَابَيْنِ مُفِيدَيْنِ",
    30: "المهندسون: فاعل مرفوع بالواو لأنه جمع مذكر سالم.",
    33: "رَأَيْتُ السَّيَّارَاتِ المُسْرِعَاتِ",
    36: "جَاءَ مُعَلِّمُو المَدْرَسَةِ",
    39: "ذا: خبر كان منصوب بالألف لأنه من الأسماء الخمسة.",
    42: "سَافَرَتْ أُخْتِي إِلَى مَكَّةَ",
    44: "كُبْرَى",
    48: "رَكِبْتُ الحِصَانَ السَّرِيعَ",
    53: "البَابَ",
    54: "الكِتَابَ (لا يجتمع التنوين مع أل)",
    57: "الكاف ضمير متصل مبني في محل نصب مفعول به.",
    60: "فَازَ التِّلْمِيذَانِ اللَّذَانِ اجْتَهَدَا",
    63: "هَاتَانِ بِنْتَانِ مُهَذَّبَتَانِ",
    64: "الواجبُ: نائب فاعل مرفوع بالضمة الظاهرة.",
    65: "فُتِحَ البَابُ",
    66: "يُحْتَرَمُ المُعَلِّمُ",
    67: "مَا زَالَ المُسَافِرُونَ قَادِمِينَ",
    69: "مَا زَالَ الجَوُّ مُعْتَدِلاً",
    71: "حِفْظاً حَسَناً",
    73: "إِجْلالاً",
    75: "لَيْلاً"
  };

  return {
    id: "sub-contoh-ahmad-fauzan",
    studentName: "Ahmad Fauzan Al-Banjari",
    studentClass: "8A - Thullab",
    studentSection: "Reguler",
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    durationSpentSec: 4230,
    autoSubmitted: false,
    examVersion: "miyar-v1.0",
    answers: sampleAnswers,
    autoScore: 46,
    maxAutoScore: 46,
    manualScore: 48,
    maxManualScore: 58,
    totalScore: 94,
    maxTotalScore: 104,
    percentage: 90,
    status: "selesai_dinilai",
    focusEvents: [
      {
        type: "visibility_hidden",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        durationSec: 3,
        details: "Halaman dokumen disembunyikan (beralih tab / minimize)",
      },
    ],
    manualGrading: {
      3: { score: 2, feedback: "Penjelasan tepat: mu'tal akhir bil ya'." },
      6: { score: 2, feedback: "Bagus, fi'il mabni 'alas sukun ma'a nun inats." },
      9: { score: 2, feedback: "I'rab lengkap hadzfu harfil illah." },
      12: { score: 2, feedback: "Sempurna." },
      15: { score: 2, feedback: "Fathah tepat." },
      18: { score: 2, feedback: "Koreksi sukun kedua fi'il benar." },
      21: { score: 2, feedback: "Tsubutun nun tepat." },
      27: { score: 2, feedback: "Mutsanna manshub bil ya' tepat." },
      30: { score: 2, feedback: "Lengkap dan tepat." },
      33: { score: 2, feedback: "Kasrah pada kedua kata tepat." },
      36: { score: 2, feedback: "Penghapusan nun pada mudhaf benar." },
      39: { score: 2, feedback: "Khabar kaana manshub bil alif." },
      42: { score: 2, feedback: "Tepat." },
      44: { score: 2, feedback: "Alif maqshurah tepat." },
      48: { score: 2, feedback: "Penghapusan tanwin saat ber-Al tepat." },
      53: { score: 2, feedback: "Fathah tunggal benar." },
      54: { score: 2, feedback: "Alasan tepat." },
      57: { score: 2, feedback: "I'rab kaf tepat." },
      60: { score: 2, feedback: "Transformasi mutsanna lengkap." },
      63: { score: 2, feedback: "Isim isyarah hatani tepat." },
      64: { score: 2, feedback: "Na'ib fa'il marfu' tepat." },
      65: { score: 2, feedback: "Mabni majhul tepat." },
      66: { score: 2, feedback: "Syakkal fi'il dan na'ib fa'il benar." },
      67: { score: 2, feedback: "Khabar ma zala manshub bil ya' tepat." },
      69: { score: 2, feedback: "Harakat tepat." },
      71: { score: 2, feedback: "Tanwin fathah tepat." },
      73: { score: 2, feedback: "Maf'ul li-ajlih tepat." },
      75: { score: 2, feedback: "Zharf zaman tepat." }
    },
  };
}
