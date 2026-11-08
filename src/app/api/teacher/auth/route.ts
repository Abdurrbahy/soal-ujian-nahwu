import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyTeacherAuth, generateTeacherToken, AUTH_COOKIE_NAME, isTeacherAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin, email } = body;

    const isValid = verifyTeacherAuth(pin, email);
    if (!isValid) {
      return NextResponse.json(
        { error: "PIN atau kata sandi guru tidak cocok. Hubungi administrator." },
        { status: 401 }
      );
    }

    const token = generateTeacherToken();
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, message: "Berhasil masuk portal guru." });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}

export async function GET() {
  const isAuth = await isTeacherAuthenticated();
  return NextResponse.json({ authenticated: isAuth });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  return NextResponse.json({ success: true, message: "Berhasil keluar." });
}
