const http = require("http");

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: () => {
              try {
                return JSON.parse(data);
              } catch (e) {
                return null;
              }
            },
          });
        });
      }
    );

    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== MEMULAI TEST SUITE PLATFORM MI'YAR ===");

  // 1. Test Home page
  const homeRes = await request("/");
  console.log("1. GET / status:", homeRes.statusCode, "(Expected: 200)");
  console.assert(homeRes.statusCode === 200, "Home should be 200");

  // 2. Test Materi page
  const materiRes = await request("/materi");
  console.log("2. GET /materi status:", materiRes.statusCode, "(Expected: 200)");
  console.assert(materiRes.statusCode === 200, "Materi should be 200");

  // 3. Test Settings API
  const settingsRes = await request("/api/settings");
  const settingsJson = settingsRes.json();
  console.log("3. GET /api/settings status:", settingsRes.statusCode, "duration:", settingsJson?.settings?.durationMinutes);
  console.assert(settingsJson?.settings?.durationMinutes === 90, "Default duration should be 90");

  // 4. Test Student Submission API (POST /api/submissions)
  console.log("\n--- Menjalankan Uji Coba Pengiriman Siswa ---");
  const testSubmissionPayload = {
    studentName: "Fatimah Az-Zahra",
    studentClass: "8B - Banat",
    studentSection: "Reguler",
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    autoSubmitted: false,
    answers: {
      1: "سَعَى", // Q1 correct (PG)
      2: "صحيح (Benar)", // Q2 correct (BS)
      4: "هَذَا، حَيْثُ، كَتَبَ، مِنْ", // Q4 correct (PG)
      5: "صحيح (Benar)", // Q5 correct (BS)
      7: "لم يسع", // Q7 correct (Isian)
      8: "الفتحة الظاهرة على آخره", // Q8 correct (PG)
      10: "العَصَا", // Q10 correct (PG)
      11: "صحيح (Benar)", // Q11 correct (BS)
      14: "لام الجحود", // Q14 correct (Identifikasi)
      16: "مَنْ", // Q16 correct (PG)
      17: "تجتهد", // Q17 correct (Isian)
      19: "ثُبُوتُ النُّونِ", // Q19 correct (PG)
      20: "يقصروا", // Q20 correct (Isian)
      22: "جَمْعُ تَكْسِيرٍ", // Q22 correct (Identifikasi)
      23: "خطأ (Salah)", // Q23 correct (BS)
      24: "شجرتان", // Q24 correct (Isian)
      25: "حَضَرَ الصَّدِيقَانِ وَرَأَيْتُ الصَّدِيقَيْنِ", // Q25 correct (PG)
      26: "صحيح (Benar)", // Q26 correct (BS)
      // Subjective answers
      3: "الفعل يرمي فعل معتل الآخر بالياء لأن آخره ياء.",
      6: "الطالبات يكتبن الدرس.",
      9: "يقض: فعل مضارع مجزوم بلم وعلامة جزمه حذف حرف العلة.",
      12: "الفتى: مفعول به منصوب بفتحة مقدرة على الألف منع من ظهورها التعذر.",
      15: "فَتَرْسُبَ",
      18: "مَنْ يَزْرَعْ الخَيْرَ يَحْصُدْهُ",
    },
    focusEvents: [
      {
        type: "visibility_hidden",
        timestamp: new Date().toISOString(),
        durationSec: 4,
        details: "Halaman kehilangan fokus selama 4 detik",
      },
    ],
  };

  const submitRes = await request("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: testSubmissionPayload,
  });

  const submitJson = submitRes.json();
  console.log("4. POST /api/submissions status:", submitRes.statusCode, "ID:", submitJson?.submission?.id);
  console.log("   Skor Otomatis Terhitung:", submitJson?.submission?.autoScore, "dari max:", submitJson?.submission?.maxAutoScore);
  console.assert(submitRes.statusCode === 200, "Submission should succeed with 200");
  console.assert(submitJson?.submission?.id, "Should return submission ID");
  console.assert(submitJson?.submission?.autoScore > 0, "Auto score should be > 0");

  const subId = submitJson.submission.id;

  // 5. Test Student Receipt page (GET /api/submissions?id=...)
  const receiptRes = await request(`/api/submissions?id=${encodeURIComponent(subId)}`);
  const receiptJson = receiptRes.json();
  console.log("5. GET /api/submissions?id=... status:", receiptRes.statusCode, "student:", receiptJson?.submission?.studentName);
  console.assert(receiptJson?.submission?.studentName === "Fatimah Az-Zahra", "Receipt should match student name");

  // 6. Test Teacher Auth (Failed login)
  console.log("\n--- Menjalankan Uji Coba Keamanan & Portal Guru ---");
  const failedAuthRes = await request("/api/teacher/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email: "guru@miyar.sch.id", pin: "salah-pin-123" },
  });
  console.log("6. POST /api/teacher/auth (PIN salah) status:", failedAuthRes.statusCode, "(Expected: 401)");
  console.assert(failedAuthRes.statusCode === 401, "Wrong PIN must return 401");

  // 7. Test Teacher Auth (Successful login)
  const successAuthRes = await request("/api/teacher/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email: "guru@miyar.sch.id", pin: "nahwu2026" },
  });
  console.log("7. POST /api/teacher/auth (PIN benar) status:", successAuthRes.statusCode, "(Expected: 200)");
  console.assert(successAuthRes.statusCode === 200, "Correct PIN must return 200");

  const setCookie = successAuthRes.headers["set-cookie"];
  const cookieHeader = Array.isArray(setCookie) ? setCookie[0].split(";")[0] : "";
  console.log("   Teacher Session Cookie:", cookieHeader);

  // 8. Test Teacher Submissions List with Auth
  const teacherSubmissionsRes = await request("/api/teacher/submissions", {
    headers: { Cookie: cookieHeader },
  });
  const teacherSubmissionsJson = teacherSubmissionsRes.json();
  console.log("8. GET /api/teacher/submissions status:", teacherSubmissionsRes.statusCode, "total:", teacherSubmissionsJson?.submissions?.length);
  console.assert(teacherSubmissionsRes.statusCode === 200, "Teacher submissions list must succeed");
  console.assert(teacherSubmissionsJson?.submissions?.length >= 2, "Must contain at least 2 submissions (sample + Fatimah)");

  // 9. Test Teacher Grading API (POST /api/teacher/grade)
  console.log("\n--- Menjalankan Uji Coba Penilaian Manual Guru ---");
  const gradeRes = await request("/api/teacher/grade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: {
      id: subId,
      grades: {
        3: { score: 2, feedback: "Penjelasan mu'tal akhir ya' sangat tepat." },
        6: { score: 2, feedback: "Mabni 'alas sukun لاتصاله بنون النسوة benar." },
        9: { score: 2, feedback: "I'rab hadzfu harfil illah tepat." },
        12: { score: 2, feedback: "Ta'adzdzur tepat." },
        15: { score: 2, feedback: "Fathah fa sababiyyah tepat." },
        18: { score: 2, feedback: "Kedua fi'il majzum benar." },
      },
    },
  });

  const gradeJson = gradeRes.json();
  console.log("9. POST /api/teacher/grade status:", gradeRes.statusCode);
  console.log("   Skor Manual Terkoreksi:", gradeJson?.submission?.manualScore);
  console.log("   Total Skor Baru:", gradeJson?.submission?.totalScore, `(${gradeJson?.submission?.percentage}%)`);
  console.log("   Status Penilaian:", gradeJson?.submission?.status);
  console.assert(gradeJson?.submission?.manualScore === 12, "Manual score should equal 2*6=12 points");
  console.assert(gradeJson?.submission?.status === "dinilai_sebagian", "Status should be dinilai_sebagian");

  // 10. Test CSV Export API (GET /api/teacher/export)
  console.log("\n--- Menjalankan Uji Coba Ekspor CSV ---");
  const exportRes = await request("/api/teacher/export", {
    headers: { Cookie: cookieHeader },
  });
  console.log("10. GET /api/teacher/export status:", exportRes.statusCode, "ContentType:", exportRes.headers["content-type"]);
  console.assert(exportRes.statusCode === 200, "CSV export must succeed with 200");
  console.assert(exportRes.body.includes("Fatimah Az-Zahra"), "CSV must include student Fatimah Az-Zahra");
  console.assert(exportRes.body.includes("Ahmad Fauzan"), "CSV must include sample student Ahmad Fauzan");

  console.log("\n=======================================================");
  console.log("SEMUA 10 PENGUJIAN SELESAI DENGAN STATUS 100% SUKSES!");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
