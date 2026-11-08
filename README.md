# Platform Ujian Nahwu Mi‘yar (مِعْيار)

Platform ujian nahwu berbasis web modern, responsif, dan terstandarisasi untuk siswa madrasah/pesantren dan pengajar bahasa Arab. Seluruh materi ujian diverifikasi dan bersumber langsung dari kitab:
**النحو الواضح في قواعد اللغة العربية للمرحلة الابتدائية، الجزء الثاني** (*An-Nahw al-Wadih lil-Marhalah al-Ibtida'iyyah - Juz 2*, karya Ali al-Jarim & Mustafa Amin), terbatas secara ketat pada **Pelajaran 1 hingga 26**.

---

## 1. Fitur Utama & Keunggulan

### Bagi Siswa:
- **Pendaftaran Identitas Terstruktur:** Wajib mengisi Nama Lengkap dan Kelas/Rombel, serta opsional untuk Seksi/Catatan.
- **Transparansi Aturan & Kebijakan Fokus:** Penjelasan ramah dan terbuka sebelum memulai ujian mengenai durasi, distribusi soal, serta pencatatan kehilangan fokus tab (bukan spyware, tidak mengunci browser, dan bukan bukti otomatis pelanggaran).
- **Timer Hitung Mundur 90 Menit:** Timer tetap terlihat di bagian atas dengan penanda visual saat waktu tersisa sedikit, serta fungsi *auto-submit* saat waktu habis.
- **Bank 75 Soal Lengkap:** Navigasi kisi nomor (Grid 1–75), indikator soal terjawab, belum terjawab, serta tombol penanda soal (*bookmark/flag* untuk ditinjau).
- **Tipografi Arab Berkualitas Tinggi:** Huruf Arab yang jelas dengan harakat lengkap menggunakan font tradisional Arab (*Amiri*, *Scheherazade New*) serta dukungan tata letak RTL tanpa mengacaukan teks bahasa Indonesia.
- **Penyimpanan Lokal Anti-Hilang:** Kemajuan ujian dan timer disimpan secara otomatis di browser (*localStorage*) sehingga bila browser tidak sengaja tertutup atau ter-refresh, jawaban tidak hilang.
- **Tanda Terima Resmi:** Bukti pengiriman instan dengan ID resi unik, waktu pengerjaan, skor objektif sementara, serta catatan bahwa soal uraian sedang menunggu koreksi guru.

### Bagi Guru:
- **Autentikasi Aman:** Masuk portal guru dilindungi dengan PIN akses (`nahwu2026`) dan filter *allowlist* email pengajar terdaftar.
- **Dashboard Hasil Ujian:** Menampilkan ringkasan metrik (total peserta, menunggu koreksi, selesai dinilai, rata-rata skor), pencarian nama siswa, serta filter berdasarkan kelas dan status penilaian.
- **Format Responsif:** Tampilan tabel rapi pada layar komputer desktop dan kartu interaktif pada ponsel/tablet.
- **Analisis Aktivitas Fokus:** Menampilkan log peristiwa kehilangan fokus siswa lengkap dengan cap waktu (*timestamp*) dan durasi detik.
- **Lembar Penilaian Berbasis Rubrik Kitab:** Menyediakan pedoman kunci jawaban model dan rubrik resmi untuk memeriksa 29 soal subjektif (Tashkeel, Transformasi Kalimat, Koreksi Kesalahan, dan I‘rab).
- **Kalkulasi Nilai Otomatis:** Sistem langsung menjumlahkan skor otomatis (maks 46 poin) dan skor manual (maks 58 poin), memperbarui persentase, dan memperbarui status penilaian.
- **Ekspor Hasil ke CSV:** Mengunduh berkas spreadsheet CSV lengkap dengan *UTF-8 BOM* (kompatibel langsung dengan Microsoft Excel) yang mengikuti filter aktif.
- **Pengaturan Durasi Ujian:** Guru dapat mengubah batas durasi ujian (30–180 menit) langsung dari dasbor untuk sesi ujian berikutnya.

---

## 2. Cakupan 26 Pelajaran Al-Nahw al-Wadih Juz 2

Setiap pelajaran 1–26 terwakili sekurangnya 2 soal (23 pelajaran memuat 3 soal, 3 pelajaran memuat 2 soal, total 75 soal):

| No | Nama Bab (Arab) | Topik Pembahasan | Rujukan PDF |
|:---:|---|---|:---:|
| 1 | تقسيم الفعل إلى صحيح الآخر ومعتل الآخر | Fi'il shahih akhir dan mu'tal akhir (alif, waw, ya') | Hal. 3–6 |
| 2 | المبني والمعرب | Kaidah mabni dan mu'rab (madhi, amr, mudhari') | Hal. 7–19 |
| 3 | الفعل المضارع المعتل الآخر وأحوال إعرابه | I'rab mudhari' mu'tal akhir (rafa', nashab, jazm) | Hal. 20–25 |
| 4 | الاسم المعتل الآخر: المقصور وأحوال إعرابه | Isim maqshur dan ta'adzdzur tanda i'rab | Hal. 26–30 |
| 5 | نصب المضارع بأن المضمرة | Nashab mudhari' dengan 'an' mudhmarah (jawazan & wujuban) | Hal. 31–41 |
| 6 | جوازم الفعل المضارع | Jazm satu fi'il dan adawat syarat jazimah | Hal. 42–49 |
| 7 | الأفعال الخمسة وإعرابها | Al-Af'al al-Khamsah (tsubut nun & hadzfu nun) | Hal. 50–54 |
| 8 | تقسيم الاسم إلى مفرد ومثنى وجمع | Pembagian isim mufrad, mutsanna, dan jamak | Hal. 55–61 |
| 9 | إعراب المثنى | Rafa' bil-alif, nashab & jar bil-ya' | Hal. 62–66 |
| 10 | إعراب جمع المذكر السالم | Rafa' bil-waw, nashab & jar bil-ya' | Hal. 67–71 |
| 11 | إعراب جمع المؤنث السالم | Rafa' bidh-dhammah, nashab & jar bil-kasrah | Hal. 72–76 |
| 12 | المضاف والمضاف إليه | Tarkib idhafi, pembuangan tanwin & nun | Hal. 77–83 |
| 13 | الأسماء الخمسة وإعرابها | Asma'ul khamsah (waw, alif, ya') | Hal. 84–89 |
| 14 | علامات التأنيث في الأفعال | Ta' sakinah pada madhi & ta' mudhara'ah | Hal. 90–94 |
| 15 | علامات التأنيث في الأسماء | Ta' marbuthah, alif maqshurah, alif mamdudah | Hal. 95–99 |
| 16 | النكرة والمعرفة | Pengertian & perbedaan nakirah dan ma'rifah | Hal. 100–104 |
| 17 | العلم | Isim 'alam nama orang & tempat | Hal. 105–108 |
| 18 | المعرف بالألف واللام | Pengaruh masuknya Al dan penghapusan tanwin | Hal. 109–112 |
| 19 | الضمير: المنفصل والمتصل والمستتر | Dhamir munfashil, muttashil, dan mustatir | Hal. 113–125 |
| 20 | الاسم الموصول | Alladzi, allati, shilah maushul, dan 'a'id | Hal. 126–131 |
| 21 | اسم الإشارة | Isim isyarah dekat & jauh, mufrad, mutsanna, jamak | Hal. 132–136 |
| 22 | نائب الفاعل | Fi'il mabni lil-majhul & marfu'nya na'ib fa'il | Hal. 137–143 |
| 23 | أفعال الاستمرار الناسخة و"ما دام" | Ma zala, ma bariha, ma fati'a, ma infakka, ma dama | Hal. 144–150 |
| 24 | المفعول المطلق | Penegas fi'il, penjelas jenis, dan penjelas bilangan | Hal. 151–157 |
| 25 | المفعول لأجله | Mashdar manshub penjelas alasan sebab perbuatan | Hal. 158–162 |
| 26 | ظرف الزمان وظرف المكان | Zharf zaman & makan (al-maf'ul fih) | Hal. 163–170 |

---

## 3. Distribusi Tepat 75 Soal Sesuai PRD

| No | Jenis Soal | Jumlah | Metode Penilaian | Bobot per Soal | Subtotal Poin |
|:---:|---|:---:|:---:|:---:|:---:|
| 1 | Pilihan Ganda | 18 | Otomatis | 1 Poin | 18 Poin |
| 2 | Benar / Salah | 8 | Otomatis | 1 Poin | 8 Poin |
| 3 | Isian Singkat | 10 | Otomatis | 1 Poin | 10 Poin |
| 4 | Identifikasi / Klasifikasi | 10 | Otomatis | 1 Poin | 10 Poin |
| 5 | Tashkeel (Pemberian Harakat) | 8 | Manual (Guru) | 2 Poin | 16 Poin |
| 6 | Transformasi Kalimat | 7 | Manual (Guru) | 2 Poin | 14 Poin |
| 7 | Koreksi Kesalahan Nahwu | 7 | Manual (Guru) | 2 Poin | 14 Poin |
| 8 | I‘rab / Analisis Kedudukan | 7 | Manual (Guru) | 2 Poin | 14 Poin |
| **Total** | **8 Variasi Soal** | **75 Soal** | **Campuran** | — | **104 Poin (Skala 100%)** |

---

## 4. Struktur Proyek

```
Soal Ujian Nahwu/
├── data/
│   ├── settings.json            # Pengaturan ujian (durasi, dll)
│   └── submissions.json         # Penyimpanan database bersama
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── settings/        # API GET/POST pengaturan ujian
│   │   │   ├── submissions/     # API POST submit & GET tanda terima
│   │   │   └── teacher/
│   │   │       ├── auth/        # API autentikasi guru (PIN & session cookie)
│   │   │       ├── export/      # API ekspor CSV dinamis dengan filter
│   │   │       ├── grade/       # API simpan nilai manual & hitung ulang
│   │   │       └── submissions/ # API daftar percobaan & hapus
│   │   ├── guru/
│   │   │   ├── dashboard/       # Halaman dashboard hasil ujian guru
│   │   │   ├── login/           # Halaman masuk guru
│   │   │   └── nilai/[id]/      # Lembar koreksi & rubrik per siswa
│   │   ├── materi/              # Halaman eksplorasi 26 pelajaran
│   │   ├── tanda-terima/[id]/   # Bukti pengiriman siswa
│   │   ├── ujian/               # Layar ujian siswa 75 soal + timer
│   │   ├── globals.css          # Palet akademik & tipografi Arab
│   │   ├── layout.tsx           # Layout utama + navigasi navbar
│   │   └── page.tsx             # Halaman beranda
│   ├── components/
│   │   └── ui/                  # Komponen shadcn/ui (Button, Card, Dialog, dll)
│   ├── data/
│   │   ├── chapters.ts          # Metadata 26 bab Al-Nahw al-Wadih Juz 2
│   │   └── questions.ts         # Bank tepat 75 soal terverifikasi
│   ├── lib/
│   │   ├── auth.ts              # Konfigurasi keamanan guru
│   │   ├── db.ts                # Layanan database file atomic
│   │   └── utils.ts             # Normalisasi bahasa Arab & styling cn
│   └── types/
│       └── exam.ts              # Interface TypeScript model data
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat:
- Node.js versi 18 ke atas (disarankan Node.js 20 atau 24)
- npm versi 9 ke atas

### Langkah Instalasi:
1. Masuk ke direktori proyek:
   ```bash
   cd "Soal Ujian Nahwu"
   ```

2. Jalankan instalasi dependensi (bila belum):
   ```bash
   npm install
   ```

3. Jalankan server pengembangan (*Development Mode*):
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

4. Atau jalankan *Production Build*:
   ```bash
   npm run build
   npm start
   ```

---

## 6. Kredensial Akses Pengajar (Guru / Administrator)

Untuk membuka Portal Guru di `/guru/login` atau `/guru/dashboard`:
- **Email Terdaftar:** `guru@miyar.sch.id` (atau `ustadz.nahwu@miyar.sch.id` / `admin@miyar.sch.id`)
- **PIN Akses Default:** `nahwu2026`

*Catatan: PIN dapat diubah dengan mengatur variabel lingkungan `TEACHER_PIN` pada lingkungan server Anda.*

---

## 7. Panduan Penerbitan & Deploy

Aplikasi ini dibangun menggunakan arsitektur mandiri (*self-contained full-stack Next.js*).

### A. Deploy ke Vercel:
1. Hubungkan repositori Git ke akun [Vercel](https://vercel.com).
2. Tambahkan Environment Variable di dashboard Vercel:
   - `TEACHER_PIN` = kata sandi rahasia guru Anda.
3. Klik **Deploy**. Vercel akan otomatis menjalankan `npm run build` dan mempublikasikan situs dengan tautan HTTPS publik.
   *Catatan penyimpanan:* Untuk persistensi jangka panjang di lingkungan serverless Vercel (karena filesystem serverless bersifat ephemeral), data dapat dihubungkan ke Vercel Postgres atau Supabase melalui adapter di `src/lib/db.ts`.

### B. Deploy ke Railway / Render / Fly.io / VPS:
1. Deploy repositori sebagai Node.js container atau service.
2. Build command: `npm run build`
3. Start command: `npm start`
4. Port: `3000`
5. Filesystem lokal pada direktori `./data` akan tersimpan persisten secara langsung.

---

## 8. Lisensi & Rujukan
- Konten materi kaidah bersumber dari kitab *النحو الواضح في قواعد اللغة العربية للمرحلة الابتدائية - الجزء الثاني* (Ali al-Jarim & Mustafa Amin).
- Dibangun dengan Next.js, TypeScript, Tailwind CSS, Radix UI, dan Lucide Icons.
