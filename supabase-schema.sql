-- ========================================================
-- SKEMA DATABASE SUPABASE UNTUK PLATFORM UJIAN NAHWU MI'YAR
-- Jalankan skrip ini di SQL Editor di dashboard Supabase Anda
-- ========================================================

-- 1. Tabel Hasil Ujian Siswa (submissions)
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  student_section TEXT DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  duration_spent_sec INTEGER NOT NULL DEFAULT 0,
  auto_submitted BOOLEAN NOT NULL DEFAULT false,
  exam_version TEXT NOT NULL DEFAULT 'miyar-v1.0',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  auto_score INTEGER NOT NULL DEFAULT 0,
  max_auto_score INTEGER NOT NULL DEFAULT 46,
  manual_score INTEGER NOT NULL DEFAULT 0,
  max_manual_score INTEGER NOT NULL DEFAULT 58,
  total_score INTEGER NOT NULL DEFAULT 0,
  max_total_score INTEGER NOT NULL DEFAULT 104,
  percentage INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'menunggu_penilaian',
  focus_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  manual_grading JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk mempermudah pencarian nama & filter kelas
CREATE INDEX IF NOT EXISTS idx_submissions_class ON submissions(student_class);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);

-- 2. Tabel Pengaturan Ujian (exam_settings)
CREATE TABLE IF NOT EXISTS exam_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  duration_minutes INTEGER NOT NULL DEFAULT 90,
  exam_title TEXT NOT NULL DEFAULT 'Ujian Nahwu Semester: Al-Nahw al-Wadih Juz 2 (Pelajaran 1–26)',
  target_chapter_min INTEGER NOT NULL DEFAULT 1,
  target_chapter_max INTEGER NOT NULL DEFAULT 26,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Masukkan pengaturan default jika belum ada
INSERT INTO exam_settings (id, duration_minutes, exam_title, target_chapter_min, target_chapter_max)
VALUES ('default', 90, 'Ujian Nahwu Semester: Al-Nahw al-Wadih Juz 2 (Pelajaran 1–26)', 1, 26)
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security (RLS) & Hak Akses
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_settings ENABLE ROW LEVEL SECURITY;

-- Berikan izin akses ke tabel untuk anon, authenticated, dan service_role
GRANT ALL ON TABLE submissions TO anon, authenticated, service_role;
GRANT ALL ON TABLE exam_settings TO anon, authenticated, service_role;

-- Beri akses insert, select, update melalui policy publik
DROP POLICY IF EXISTS "Allow public insert and read submissions" ON submissions;
CREATE POLICY "Allow public insert and read submissions"
  ON submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read and update settings" ON exam_settings;
CREATE POLICY "Allow read and update settings"
  ON exam_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
