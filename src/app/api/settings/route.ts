import { NextResponse } from "next/server";
import { getExamSettings, updateExamSettings } from "@/lib/db";
import { isTeacherAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await getExamSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Gagal memuat pengaturan." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAuth = await isTeacherAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateExamSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengaturan." }, { status: 500 });
  }
}
