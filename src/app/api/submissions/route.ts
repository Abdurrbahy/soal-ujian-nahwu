import { NextResponse } from "next/server";
import { saveNewSubmission, getSubmissionById } from "@/lib/db";
import { isTeacherAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, studentClass, startedAt, answers } = body;

    if (!studentName || !studentName.trim()) {
      return NextResponse.json({ error: "Nama lengkap wajib diisi." }, { status: 400 });
    }
    if (!studentClass || !studentClass.trim()) {
      return NextResponse.json({ error: "Kelas/Rombel wajib diisi." }, { status: 400 });
    }
    if (!startedAt) {
      return NextResponse.json({ error: "Waktu mulai tidak valid." }, { status: 400 });
    }

    const durationSpentSec = Math.max(
      0,
      Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    );

    const submission = await saveNewSubmission({
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      studentSection: body.studentSection || "",
      startedAt,
      submittedAt: new Date().toISOString(),
      durationSpentSec: isNaN(durationSpentSec) ? 0 : durationSpentSec,
      autoSubmitted: Boolean(body.autoSubmitted),
      answers: answers || {},
      focusEvents: body.focusEvents || [],
    });

    if (!submission) {
      throw new Error("Gagal membuat dan menyimpan rekaman ujian.");
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        studentName: submission.studentName,
        studentClass: submission.studentClass,
        studentSection: submission.studentSection,
        submittedAt: submission.submittedAt,
        durationSpentSec: submission.durationSpentSec,
        autoSubmitted: submission.autoSubmitted,
        autoScore: submission.autoScore,
        maxAutoScore: submission.maxAutoScore,
        maxManualScore: submission.maxManualScore,
        status: submission.status,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    const stack = error instanceof Error ? error.stack : "";
    console.error("Error saving submission:", errorMsg, stack);
    
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      await fs.writeFile(
        path.join(process.cwd(), "submission_error.log"),
        `Time: ${new Date().toISOString()}\nError: ${errorMsg}\nStack: ${stack}\n\n`,
        { flag: "a" }
      );
    } catch {}

    return NextResponse.json(
      { error: `Gagal menyimpan hasil ujian: ${errorMsg}` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID percobaan diperlukan." }, { status: 400 });
    }

    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: "Percobaan tidak ditemukan." }, { status: 404 });
    }

    const isTeacher = await isTeacherAuthenticated();

    // If teacher, return full object. If student, return receipt view
    if (isTeacher) {
      return NextResponse.json({ submission });
    }

    // Student view (omits raw teacher credentials/internal notes)
    return NextResponse.json({
      submission: {
        id: submission.id,
        studentName: submission.studentName,
        studentClass: submission.studentClass,
        studentSection: submission.studentSection,
        startedAt: submission.startedAt,
        submittedAt: submission.submittedAt,
        durationSpentSec: submission.durationSpentSec,
        autoSubmitted: submission.autoSubmitted,
        autoScore: submission.autoScore,
        maxAutoScore: submission.maxAutoScore,
        manualScore: submission.manualScore,
        maxManualScore: submission.maxManualScore,
        totalScore: submission.totalScore,
        maxTotalScore: submission.maxTotalScore,
        percentage: submission.percentage,
        status: submission.status,
        focusEventsCount: submission.focusEvents.length,
      },
    });
  } catch (error) {
    console.error("Error getting submission:", error);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}
