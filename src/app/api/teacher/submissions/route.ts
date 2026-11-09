import { NextResponse } from "next/server";
import { getAllSubmissions, getSubmissionById, deleteSubmission, checkDatabaseHealth } from "@/lib/db";
import { isTeacherAuthenticated } from "@/lib/auth";

export async function GET(req: Request) {
  const isAuth = await isTeacherAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak. Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const submission = await getSubmissionById(id);
      if (!submission) {
        return NextResponse.json({ error: "Percobaan tidak ditemukan." }, { status: 404 });
      }
      return NextResponse.json({ submission });
    }

    const submissions = await getAllSubmissions();
    const dbHealth = await checkDatabaseHealth();
    return NextResponse.json({ submissions, dbHealth });
  } catch (error) {
    console.error("Error fetching teacher submissions:", error);
    return NextResponse.json({ error: "Gagal memuat data percobaan." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const isAuth = await isTeacherAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID percobaan diperlukan." }, { status: 400 });
    }

    const success = await deleteSubmission(id);
    if (!success) {
      return NextResponse.json({ error: "Percobaan tidak ditemukan atau sudah dihapus." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Percobaan berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Gagal menghapus percobaan." }, { status: 500 });
  }
}
