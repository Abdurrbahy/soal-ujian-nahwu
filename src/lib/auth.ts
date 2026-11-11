import { cookies } from "next/headers";

export const TEACHER_CREDENTIALS = {
  // Allowed teacher emails
  allowedEmails: [
    "guru@idn.sch.id",
    "ustadz.nahwu@idn.sch.id",
    "admin@idn.sch.id",
    "guru@miyar.sch.id",
    "ustadz.nahwu@miyar.sch.id",
    "admin@miyar.sch.id"
  ],
  // Master access PIN / Password
  defaultPin: process.env.TEACHER_PIN || "nahwu2026",
};

export const AUTH_COOKIE_NAME = "miyar_teacher_token";
const SECRET_TOKEN = "miyar_auth_valid_teacher_session_2026";

export function verifyTeacherAuth(pinOrToken: string, email?: string): boolean {
  if (pinOrToken === SECRET_TOKEN) return true;
  if (pinOrToken === TEACHER_CREDENTIALS.defaultPin) {
    if (!email) return true;
    return TEACHER_CREDENTIALS.allowedEmails.includes(email.trim().toLowerCase());
  }
  return false;
}

export function generateTeacherToken(): string {
  return SECRET_TOKEN;
}

export async function isTeacherAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token === SECRET_TOKEN;
}
