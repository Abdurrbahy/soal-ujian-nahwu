import { NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/db";
import { isTeacherAuthenticated } from "@/lib/auth";

export async function GET(req: Request) {
  const isAuth = await isTeacherAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const className = searchParams.get("class");
    const status = searchParams.get("status");

    let submissions = await getAllSubmissions();

    if (search) {
      submissions = submissions.filter((s) => s.studentName.toLowerCase().includes(search));
    }
    if (className && className !== "all") {
      submissions = submissions.filter((s) => s.studentClass === className);
    }
    if (status && status !== "all") {
      submissions = submissions.filter((s) => s.status === status);
    }

    const headers = [
      "ID Percobaan",
      "Nama Siswa",
      "Kelas / Rombel",
      "Seksi / Catatan",
      "Waktu Mulai",
      "Waktu Kirim",
      "Durasi (Menit)",
      "Skor Otomatis",
      "Max Skor Otomatis",
      "Skor Manual",
      "Max Skor Manual",
      "Total Skor",
      "Max Total Skor",
      "Persentase (%)",
      "Status Penilaian",
      "Auto Submit (Waktu Habis)",
      "Jumlah Kehilangan Fokus",
    ];

    const escapeCsv = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = submissions.map((s) => [
      escapeCsv(s.id),
      escapeCsv(s.studentName),
      escapeCsv(s.studentClass),
      escapeCsv(s.studentSection || "-"),
      escapeCsv(new Date(s.startedAt).toLocaleString("id-ID")),
      escapeCsv(new Date(s.submittedAt).toLocaleString("id-ID")),
      escapeCsv(Math.round(s.durationSpentSec / 60)),
      escapeCsv(s.autoScore),
      escapeCsv(s.maxAutoScore),
      escapeCsv(s.manualScore),
      escapeCsv(s.maxManualScore),
      escapeCsv(s.totalScore),
      escapeCsv(s.maxTotalScore),
      escapeCsv(s.percentage),
      escapeCsv(
        s.status === "selesai_dinilai"
          ? "Selesai Dinilai"
          : s.status === "dinilai_sebagian"
          ? "Dinilai Sebagian"
          : "Menunggu Penilaian"
      ),
      escapeCsv(s.autoSubmitted ? "Ya (Waktu Habis)" : "Tidak (Kirim Manual)"),
      escapeCsv(s.focusEvents.length),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) for proper Excel display
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const filename = `hasil-ujian-nahwu-idn-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating CSV export:", error);
    return NextResponse.json({ error: "Gagal membuat berkas CSV." }, { status: 500 });
  }
}
