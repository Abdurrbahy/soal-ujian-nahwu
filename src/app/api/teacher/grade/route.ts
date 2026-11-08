import { NextResponse } from "next/server";
import { updateSubmissionGrading } from "@/lib/db";
import { isTeacherAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  const isAuth = await isTeacherAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak. Sesi guru telah berakhir." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, grades } = body;

    if (!id || !grades) {
      return NextResponse.json({ error: "ID dan data penilaian wajib disertakan." }, { status: 400 });
    }

    const updated = await updateSubmissionGrading(id, grades);
    if (!updated) {
      return NextResponse.json({ error: "Percobaan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Penilaian berhasil disimpan.",
      submission: updated,
    });
  } catch (error) {
    console.error("Error updating grading:", error);
    return NextResponse.json({ error: "Gagal menyimpan penilaian." }, { status: 500 });
  }
}
