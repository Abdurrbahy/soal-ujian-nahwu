import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ExamModeProvider } from "@/context/exam-mode-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "IDN Mekkah Madinah — Platform Ujian Nahwu",
  description:
    "Platform ujian nahwu santri IDN Mekkah Madinah bersumber dari An-Nahw al-Wadih lil-Madaris al-Ibtida'iyyah Juz 2 (Pelajaran 1–20)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
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
