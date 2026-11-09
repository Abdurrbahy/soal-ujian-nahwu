import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ExamModeProvider } from "@/context/exam-mode-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Mi‘yar — Platform Ujian Nahwu",
  description:
    "Platform ujian nahwu berbasis web bersumber dari An-Nahw al-Wadih lil-Madaris al-Ibtida'iyyah Juz 2 (Pelajaran 1–20)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ExamModeProvider>
          {/* Dynamic Navigation Bar (hides action buttons during active exam) */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer (hides during active exam) */}
          <Footer />
        </ExamModeProvider>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
