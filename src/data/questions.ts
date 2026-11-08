import { Question } from "@/types/exam";

export const QUESTIONS: Question[] = [
  // --- BAB 1: تقسيم الفعل إلى صحيح الآخر ومعتل الآخر (Hal. 3-6) ---
  {
    id: 1,
    babNumber: 1,
    babTitle: "تقسيم الفعل إلى صحيح الآخر ومعتل الآخر",
    pageRef: "Hal. 3–6",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Pilihlah fi'il yang tergolong mu'tal akhir (معتل الآخر) dari kelompok kata berikut:",
    prompt: "أيّ الأفعال الآتية يُعَدُّ فِعْلاً مُعْتَلَّ الآخِرِ؟",
    options: [
      "سَعَى",
      "كَتَبَ",
      "جَلَسَ",
      "فَهِمَ"
    ],
    key: "سَعَى"
  },
  {
    id: 2,
    babNumber: 1,
    babTitle: "تقسيم الفعل إلى صحيح الآخر ومعتل الآخر",
    pageRef: "Hal. 3–6",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan apakah pernyataan mengenai pembagian fi'il berikut Benar atau Salah:",
    prompt: "الفعلُ (يَرْضَى) فِعْلٌ مُعْتَلُّ الآخِرِ؛ لِأَنَّ فِي آخِرِهِ أَلِفاً.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 3,
    babNumber: 1,
    babTitle: "تقسيم الفعل إلى صحيح الآخر ومعتل الآخر",
    pageRef: "Hal. 3–6",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan pernyataan klasifikasi fi'il berikut ini:",
    prompt: "صَحِّحِ الخَطَأَ فِي القَوْلِ الآتِي: (الفِعْلُ 'يَرْمِي' فِعْلٌ صَحِيحُ الآخِرِ لِأَنَّهُ لَيْسَ مَهْمُوزاً).",
    rubric: {
      modelAnswer: "الصواب: الفعل (يَرْمِي) فعل معتل الآخر بالياء؛ لأن آخره حرف علة وهو الياء، وليس فعلاً صحيح الآخر.",
      criteria: [
        "Menyatakan bahwa 'يَرْمِي' adalah fi'il mu'tal akhir",
        "Menyebutkan huruf illatnya adalah ya' (معتل الآخر بالياء)"
      ],
      fullCredit: "Menjelaskan bahwa 'يَرْمِي' adalah mu'tal akhir بالياء karena berakhiran huruf 'illat.",
      partialCredit: "Hanya menyebutkan 'mu'tal' tanpa menyebutkan huruf illatnya.",
      noCredit: "Membenarkan bahwa fi'il tersebut shahih akhir."
    }
  },

  // --- BAB 2: المبني والمعرب (Hal. 7-19) ---
  {
    id: 4,
    babNumber: 2,
    babTitle: "المبني والمعرب",
    pageRef: "Hal. 7–19",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah di antara kelompok kata berikut yang semuanya tergolong kata mabni (مبني)?",
    prompt: "أَيُّ مَجْمُوعَةٍ مِنَ الكَلِمَاتِ الآتِيَةِ كُلُّهَا مَبْنِيَّةٌ؟",
    options: [
      "هَذَا، حَيْثُ، كَتَبَ، مِنْ",
      "الكِتَابُ، القَلَمُ، سَعِيدٌ، مَدْرَسَةٌ",
      "يَكْتُبُ، يَقْرَأُ، يَجْلِسُ، يَقُومُ",
      "زَيْدٌ، عَلِيٌّ، عُمَرُ، خَالِدٌ"
    ],
    key: "هَذَا، حَيْثُ، كَتَبَ، مِنْ"
  },
  {
    id: 5,
    babNumber: 2,
    babTitle: "المبني والمعرب",
    pageRef: "Hal. 7–19",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan apakah kaidah hukum fi'il amr berikut Benar atau Salah:",
    prompt: "فِعْلُ الأَمْرِ كُلُّهُ مَبْنِيٌّ دَائِماً وَلا يَكُونُ مُعْرَباً أَبَداً.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 6,
    babNumber: 2,
    babTitle: "المبني والمعرب",
    pageRef: "Hal. 7–19",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah fi'il mudhari' mu'rab pada kalimat berikut menjadi mabni dengan menyambungkannya ke Nun Inats (نُون النِّسْوَة):",
    prompt: "حَوِّلِ الفِعْلَ المُعْرَبَ (يَكْتُبُ الطُّلابُ) بِحَيْثُ يُسْنَدُ إِلَى جَمْعِ المُؤَنَّثِ وَيَكُونُ مَبْنِيّاً عَلَى السُّكُونِ مَعَ نُونِ النِّسْوَةِ:",
    rubric: {
      modelAnswer: "الطَّالِبَاتُ يَكْتُبْنَ الدَّرْسَ (بناء الفعل المضارع على السكون لاتصاله بنون النسوة).",
      criteria: [
        "Menyambungkan fi'il mudhari' dengan nun inats secara tepat (يكتبن)",
        "Sukun pada huruf sebelum nun (يَكْتُبْنَ)",
        "Kesesuaian mubtada'/fa'il muannats jamak"
      ],
      fullCredit: "Menulis kalimat yang benar dengan fi'il مبني على السكون لاتصاله بنون النسوة (الطالبات يكتبن).",
      partialCredit: "Menulis 'يكتبن' namun mubtada' tidak disesuaikan.",
      noCredit: "Jawaban keliru atau tidak menyambungkan nun inats."
    }
  },

  // --- BAB 3: الفعل المضارع المعتل الآخر وأحوال إعرابه (Hal. 20-25) ---
  {
    id: 7,
    babNumber: 3,
    babTitle: "الفعل المضارع المعتل الآخر وأحوال إعرابه",
    pageRef: "Hal. 20–25",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tuliskan bentuk fi'il (يَسْعَى) setelah dimasuki huruf jazm (لَمْ):",
    prompt: "اكْتُبِ الفِعْلَ (يَسْعَى) بَعْدَ دُخُولِ (لَمْ) الجَازِمَةِ عَلَيْهِ مُضْبُوطاً:",
    key: "لم يسع",
    acceptedVariants: ["لَمْ يَسْعَ", "يسع", "يَسْعَ"]
  },
  {
    id: 8,
    babNumber: 3,
    babTitle: "الفعل المضارع المعتل الآخر وأحوال إعرابه",
    pageRef: "Hal. 20–25",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Bagaimanakah tanda nashab fi'il mudhari' mu'tal akhir bil-waw seperti (يَدْعُوَ) setelah (لَنْ)?",
    prompt: "عَلامَةُ نَصْبِ الفِعْلِ المُضَارِعِ المَعْتَلِّ الآخِرِ بِالوَاوِ فِي نَحْوِ (لَنْ يَدْعُوَ) هِيَ:",
    options: [
      "الفتحة الظاهرة على آخره",
      "الفتحة المقدرة للتعذر",
      "حذف حرف العلة",
      "ثبوت النون"
    ],
    key: "الفتحة الظاهرة على آخره"
  },
  {
    id: 9,
    babNumber: 3,
    babTitle: "الفعل المضارع المعتل الآخر وأحوال إعرابه",
    pageRef: "Hal. 20–25",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah kata yang bergaris bawah pada kalimat: (لَمْ يَقْضِ القَاضِي بِالبَاطِلِ)",
    prompt: "أَعْرِبْ مَا تَحْتَهُ خَطٌّ: لَمْ [يَقْضِ] القَاضِي بِالبَاطِلِ.",
    rubric: {
      modelAnswer: "يَقْضِ: فعل مضارع مجزوم بـ (لم) وعلامة جزمه حذف حرف العلة (الياء)، والكسرة دليل عليها.",
      criteria: [
        "Menyebutkan status fi'il mudhari' majzum dengan 'lam'",
        "Menyebutkan tanda jazm: hadzfu harfil-'illah (membuang huruf illat ya')"
      ],
      fullCredit: "Fi'il mudhari' majzum bi-lam wa 'alamatu jazmihi hadzfu harfil 'illah (al-ya').",
      partialCredit: "Menyebutkan majzum namun keliru menyebutkan tanda jazmnya (misal: sukun).",
      noCredit: "Jawaban keliru atau tidak menyebutkan majzum."
    }
  },

  // --- BAB 4: الاسم المعتل الآخر: المقصور وأحوال إعرابه (Hal. 26-30) ---
  {
    id: 10,
    babNumber: 4,
    babTitle: "الاسم المعتل الآخر: المقصور وأحوال إعرابه",
    pageRef: "Hal. 26–30",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah di antara kata-kata berikut yang merupakan isim maqshur (الاسم المقصور)?",
    prompt: "أَيُّ الاسْمَاءِ الآتِيَةِ يُعَدُّ اسْماً مَقْصُوراً؟",
    options: [
      "العَصَا",
      "القَاضِي",
      "الكِتَابُ",
      "السَّمَاءُ"
    ],
    key: "العَصَا"
  },
  {
    id: 11,
    babNumber: 4,
    babTitle: "الاسم المعتل الآخر: المقصور وأحوال إعرابه",
    pageRef: "Hal. 26–30",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan kebenaran pernyataan i'rab isim maqshur berikut:",
    prompt: "تُقَدَّرُ جَمِيعُ حَرَكَاتِ الإِعْرَابِ (الضَّمَّةُ وَالفَتْحَةُ وَالكَسْرَةُ) عَلَى آخِرِ الاسْمِ المَقْصُورِ لِلتَّعَذُّرِ.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 12,
    babNumber: 4,
    babTitle: "الاسم المعتل الآخر: المقصور وأحوال إعرابه",
    pageRef: "Hal. 26–30",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah kedudukan dan tanda i'rab kata (الفَتَى) pada kalimat: (نَصَحَ الأَبُ الفَتَى)",
    prompt: "أَعْرِبْ كَلِمَةَ (الفَتَى) فِي الجُمْلَةِ: نَصَحَ الأَبُ [الفَتَى].",
    rubric: {
      modelAnswer: "الفَتَى: مفعول به منصوب، وعلامة نصبه الفتحة المقدرة على الألف منع من ظهورها التعذر.",
      criteria: [
        "Kedudukan: maf'ul bih manshub",
        "Tanda i'rab: fathah muqaddarah 'alal alif",
        "Alasan: ta'adzdzur"
      ],
      fullCredit: "Maf'ul bih manshub bil-fathah al-muqaddarah 'alal alif li at-ta'adzdzur.",
      partialCredit: "Menyebutkan maf'ul bih tapi tanda i'rab keliru.",
      noCredit: "Kedudukan salah total."
    }
  },

  // --- BAB 5: نصب المضارع بأن المضمرة (Hal. 31-41) ---
  {
    id: 13,
    babNumber: 5,
    babTitle: "نصب المضارع بأن المضمرة",
    pageRef: "Hal. 31–41",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah fi'il mudhari' (لِأَبْتَغِيَ) pada kalimat: (خَرَجْتُ لِأَبْتَغِيَ العِلْمَ):",
    prompt: "أَعْرِبِ الفِعْلَ [لِأَبْتَغِيَ] فِي قَوْلِكَ: خَرَجْتُ لِأَبْتَغِيَ العِلْمَ.",
    rubric: {
      modelAnswer: "اللام: لام التعليل. أَبْتَغِيَ: فعل مضارع منصوب بأن مضمرة جوازاً بعد لام التعليل، وعلامة نصبه الفتحة الظاهرة على آخره.",
      criteria: [
        "Menyebutkan Lam Ta'lil",
        "Fi'il mudhari' manshub bi 'an' mudhmarah jawazan",
        "Tanda nashab: Fathah zhahirah pada ya'"
      ],
      fullCredit: "I'rab lengkap mencakup fi'il mudhari' manshub bi an mudhmarah jawazan ba'da lam ta'lil bil fathah.",
      partialCredit: "Menyebutkan manshub bi lam ta'lil tanpa menyebutkan an mudhmarah.",
      noCredit: "Menyebutkan marfu' atau majzum."
    }
  },
  {
    id: 14,
    babNumber: 5,
    babTitle: "نصب المضارع بأن المضمرة",
    pageRef: "Hal. 31–41",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Identifikasi jenis huruf Lam pada kalimat: (مَا كَانَ المُعَلِّمُ لِيُهْمِلَ الطُّلابَ):",
    prompt: "مَا نَوْعُ اللامِ الدَّاخِلَةِ عَلَى الفِعْلِ فِي قَوْلِهِ: (مَا كَانَ المُعَلِّمُ لِيُهْمِلَ الطُّلابَ)؟",
    options: [
      "لام الجحود",
      "لام التعليل",
      "لام الأمر",
      "لام الابتداء"
    ],
    key: "لام الجحود"
  },
  {
    id: 15,
    babNumber: 5,
    babTitle: "نصب المضارع بأن المضمرة",
    pageRef: "Hal. 31–41",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) lengkap pada fi'il mudhari' setelah fa' sababiyyah pada kalimat berikut:",
    prompt: "اضْبِطْ بِالشَّكْلِ الفِعْلَ بَعْدَ فَاءِ السَّبَبِيَّةِ فِي: (لا تَتَكَاسَلْ فَتَرْسُبَ)",
    rubric: {
      modelAnswer: "فَتَرْسُبَ (بفتح الباء؛ لأنه مضارع منصوب بأن مضمرة وجوباً بعد فاء السببية المسبوقة بنهي)",
      criteria: [
        "Harakat fathah pada huruf akhir ba' (فَتَرْسُبَ)",
        "Memahami kaidah nashab setelah fa' sababiyyah"
      ],
      fullCredit: "Menuliskan harakat fathah pada akhir fi'il (فَتَرْسُبَ) dengan tepat.",
      partialCredit: "Harakat akhir benar namun ada salah harakat pada huruf sebelumnya.",
      noCredit: "Memberikan sukun atau dhammah (فترسبُ / فترسبْ)."
    }
  },

  // --- BAB 6: جوازم الفعل المضارع (Hal. 42-49) ---
  {
    id: 16,
    babNumber: 6,
    babTitle: "جوازم الفعل المضارع",
    pageRef: "Hal. 42–49",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah di antara perangkat berikut yang menjazamkan DUA fi'il mudhari' (fi'il syarat dan jawab syarat)?",
    prompt: "أَيُّ الأَدَوَاتِ الآتِيَةِ تَجْزِمُ فِعْلَيْنِ مُضَارِعَيْنِ (فِعْلَ الشَّرْطِ وَجَوَابَ الشَّرْطِ)؟",
    options: [
      "مَنْ",
      "لَمَّا",
      "لامُ الأَمْرِ",
      "لا النَّاهِيَةُ"
    ],
    key: "مَنْ"
  },
  {
    id: 17,
    babNumber: 6,
    babTitle: "جوازم الفعل المضارع",
    pageRef: "Hal. 42–49",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tuliskan fi'il syarat (فعل الشرط) pada kalimat: (إِنْ تَجْتَهِدْ تَنْجَحْ):",
    prompt: "اسْتَخْرِجْ فِعْلَ الشَّرْطِ مِنَ الجُمْلَةِ: (إِنْ تَجْتَهِدْ تَنْجَحْ):",
    key: "تجتهد",
    acceptedVariants: ["تَجْتَهِدْ", "تَجْتَهِدُ", "تَجْتَهِد"]
  },
  {
    id: 18,
    babNumber: 6,
    babTitle: "جوازم الفعل المضارع",
    pageRef: "Hal. 42–49",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan gramatikal pada kalimat syarat berikut ini:",
    prompt: "صَحِّحِ الخَطَأَ النَّحْوِيَّ فِي الجُمْلَةِ الآتِيَةِ: (مَنْ يَزْرَعُ الخَيْرَ يَحْصُدُهُ).",
    rubric: {
      modelAnswer: "الصواب: مَنْ يَزْرَعْ الخَيْرَ يَحْصُدْهُ (بسكون العين في يزرع وسكون الدال في يحصد؛ لأنهما مجزومان بأداة الشرط 'من').",
      criteria: [
        "Menjazamkan fi'il syarat (يَزْرَعْ) dengan sukun",
        "Menjazamkan jawab syarat (يَحْصُدْ / يحصده) dengan sukun",
        "Memahami fungsi adawat syarat jazimah"
      ],
      fullCredit: "Memperbaiki kedua fi'il menjadi majzum dengan sukun (مَنْ يَزْرَعْ الخَيْرَ يَحْصُدْهُ).",
      partialCredit: "Hanya memperbaiki salah satu fi'il saja.",
      noCredit: "Tidak memperbaiki tanda jazm."
    }
  },

  // --- BAB 7: الأفعال الخمسة وإعرابها (Hal. 50-54) ---
  {
    id: 19,
    babNumber: 7,
    babTitle: "الأفعال الخمسة وإعرابها",
    pageRef: "Hal. 50–54",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Apakah tanda rafa' bagi al-af'al al-khamsah (الأفعال الخمسة)?",
    prompt: "عَلامَةُ رَفْعِ الأَفْعَالِ الخَمْسَةِ هِيَ:",
    options: [
      "ثُبُوتُ النُّونِ",
      "حَذْفُ النُّونِ",
      "الضَّمَّةُ الظَّاهِرَةُ",
      "الوَاوُ"
    ],
    key: "ثُبُوتُ النُّونِ"
  },
  {
    id: 20,
    babNumber: 7,
    babTitle: "الأفعال الخمسة وإعرابها",
    pageRef: "Hal. 50–54",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Lengkapilah kalimat berikut dengan bentuk fi'il yang tepat: (العُمَّالُ لَمْ .... فِي عَمَلِهِمْ) dari fi'il (يُقَصِّرُونَ):",
    prompt: "أَكْمِلِ الفَرَاغَ بِالفِعْلِ المُنَاسِبِ: العُمَّالُ لَمْ [....] فِي عَمَلِهِمْ.",
    key: "يقصروا",
    acceptedVariants: ["يُقَصِّرُوا", "يقصّروا", "يقصروا "]
  },
  {
    id: 21,
    babNumber: 7,
    babTitle: "الأفعال الخمسة وإعرابها",
    pageRef: "Hal. 50–54",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah kalimat berikut agar ditujukan kepada mukhatabah mufradah (kamu seorang perempuan): (أَنْتَ تَكْتُبُ الدَّرْسَ)",
    prompt: "حَوِّلِ الجُمْلَةَ الآتِيَةَ إِلَى المُخَاطَبَةِ المُؤَنَّثَةِ: (أَنْتَ تَكْتُبُ الدَّرْسَ).",
    rubric: {
      modelAnswer: "أَنْتِ تَكْتُبِينَ الدَّرْسَ (بياء المخاطبة وثبوت النون في الفعل؛ لأنه من الأفعال الخمسة المرفوعة)",
      criteria: [
        "Mengubah dhamir menjadi 'أَنْتِ'",
        "Mengubah fi'il menjadi af'al khamsah dengan tsubut nun: 'تَكْتُبِينَ'"
      ],
      fullCredit: "Menulis: أَنْتِ تَكْتُبِينَ الدَّرْسَ dengan tsubut nun.",
      partialCredit: "Menulis 'أنتِ تكتبي' tanpa nun padahal marfu'.",
      noCredit: "Jawaban salah atau tidak menggunakan pola af'al khamsah."
    }
  },

  // --- BAB 8: تقسيم الاسم إلى مفرد ومثنى وجمع (Hal. 55-61) ---
  {
    id: 22,
    babNumber: 8,
    babTitle: "تقسيم الاسم إلى مفرد ومثنى وجمع",
    pageRef: "Hal. 55–61",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan jenis jamak dari kata (عُلَمَاء):",
    prompt: "مَا نَوْعُ الجَمْعِ فِي كَلِمَةِ (عُلَمَاء)؟",
    options: [
      "جَمْعُ تَكْسِيرٍ",
      "جَمْعُ مُذَكَّرٍ سَالِمٌ",
      "جَمْعُ مُؤَنَّثٍ سَالِمٌ",
      "مُثَنًّى"
    ],
    key: "جَمْعُ تَكْسِيرٍ"
  },
  {
    id: 23,
    babNumber: 8,
    babTitle: "تقسيم الاسم إلى مفرد ومثنى وجمع",
    pageRef: "Hal. 55–61",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan apakah pernyataan mengenai jenis jamak kata (مَسَاكِين) berikut Benar atau Salah:",
    prompt: "كَلِمَةُ (مَسَاكِين) جَمْعُ مُذَكَّرٍ سَالِمٌ؛ لِأَنَّ فِي آخِرِهَا يَاءً وَنُوناً.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "خطأ (Salah)"
  },
  {
    id: 24,
    babNumber: 8,
    babTitle: "تقسيم الاسم إلى مفرد ومثنى وجمع",
    pageRef: "Hal. 55–61",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tuliskan bentuk mutsanna (marfu') dari kata (شَجَرَةٌ):",
    prompt: "هَاتِ المُثَنَّى المَرْفُوعَ مِنْ كَلِمَةِ (شَجَرَةٌ):",
    key: "شجرتان",
    acceptedVariants: ["شَجَرَتَانِ", "شَجَرَتَان", "الشجرتان"]
  },

  // --- BAB 9: إعراب المثنى (Hal. 62-66) ---
  {
    id: 25,
    babNumber: 9,
    babTitle: "إعراب المثنى",
    pageRef: "Hal. 62–66",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Pilihlah kalimat yang menggunakan bentuk mutsanna secara benar sesuai hukum i'rabnya:",
    prompt: "اخْتَرِ الجُمْلَةَ الصَّحِيحَةَ إِعْرَابِيّاً مِمَّا يَأْتِي:",
    options: [
      "حَضَرَ الصَّدِيقَانِ وَرَأَيْتُ الصَّدِيقَيْنِ",
      "حَضَرَ الصَّدِيقَيْنِ وَرَأَيْتُ الصَّدِيقَانِ",
      "حَضَرَ الصَّدِيقَانِ وَرَأَيْتُ الصَّدِيقَانِ",
      "حَضَرَ الصَّدِيقَيْنِ وَرَأَيْتُ الصَّدِيقَيْنِ"
    ],
    key: "حَضَرَ الصَّدِيقَانِ وَرَأَيْتُ الصَّدِيقَيْنِ"
  },
  {
    id: 26,
    babNumber: 9,
    babTitle: "إعراب المثنى",
    pageRef: "Hal. 62–66",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan kebenaran hukum tanda nashab mutsanna berikut:",
    prompt: "يُنْصَبُ المُثَنَّى بِاليَاءِ المَفْتُوحِ مَا قَبْلَهَا المَكْسُورِ مَا بَعْدَهَا نِيَابَةً عَنِ الفَتْحَةِ.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 27,
    babNumber: 9,
    babTitle: "إعراب المثنى",
    pageRef: "Hal. 62–66",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan i'rab mutsanna pada kalimat: (قَرَأْتُ كِتَابَانِ مُفِيدَانِ)",
    prompt: "صَحِّحِ الخَطَأَ الإِعْرَابِيَّ فِي الجُمْلَةِ: (قَرَأْتُ كِتَابَانِ مُفِيدَانِ).",
    rubric: {
      modelAnswer: "الصواب: قَرَأْتُ كِتَابَيْنِ مُفِيدَيْنِ (بالياء؛ لأن كتابين مفعول به منصوب، ومفيدين نعت منصوب وعلامة نصبهما الياء لأنهما مثنى).",
      criteria: [
        "Mengubah 'كتابان' menjadi manshub dengan ya' -> 'كتابين'",
        "Mengubah na'at 'مفيدان' menjadi manshub dengan ya' -> 'مفيدين'"
      ],
      fullCredit: "Menulis: قَرَأْتُ كِتَابَيْنِ مُفِيدَيْنِ dengan tepat.",
      partialCredit: "Hanya mengubah salah satu kata.",
      noCredit: "Tetap membiarkan dalam bentuk marfu' dengan alif."
    }
  },

  // --- BAB 10: إعراب جمع المذكر السالم (Hal. 67-71) ---
  {
    id: 28,
    babNumber: 10,
    babTitle: "إعراب جمع المذكر السالم",
    pageRef: "Hal. 67–71",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Apakah tanda rafa' dan tanda nashab bagi Jamak Mudzakkar Salim?",
    prompt: "عَلامَةُ إِعْرَابِ جَمْعِ المُذَكَّرِ السَّالِمِ هِيَ:",
    options: [
      "يُرْفَعُ بِالوَاوِ، وَيُنْصَبُ وَيُجَرُّ بِاليَاءِ",
      "يُرْفَعُ بِالضَّمَّةِ، وَيُنْصَبُ بِالفَتْحَةِ",
      "يُرْفَعُ بِالأَلِفِ، وَيُنْصَبُ بِاليَاءِ",
      "يُرْفَعُ بِالوَاوِ، وَيُنْصَبُ بِالأَلِفِ"
    ],
    key: "يُرْفَعُ بِالوَاوِ، وَيُنْصَبُ وَيُجَرُّ بِاليَاءِ"
  },
  {
    id: 29,
    babNumber: 10,
    babTitle: "إعراب جمع المذكر السالم",
    pageRef: "Hal. 67–71",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Lengkapilah kalimat berikut dengan jamak mudzakkar salim dari kata (المُجْتَهِد) sebagai maf'ul bih: (يُثِيبُ اللهُ ....)",
    prompt: "أَكْمِلِ الجُمْلَةَ بِجَمْعِ مُذَكَّرٍ سَالِمٍ مَنْصُوبٍ: يُثِيبُ اللهُ [....].",
    key: "المجتهدين",
    acceptedVariants: ["المُجْتَهِدِينَ", "مجتهدين", "مُجْتَهِدِينَ"]
  },
  {
    id: 30,
    babNumber: 10,
    babTitle: "إعراب جمع المذكر السالم",
    pageRef: "Hal. 67–71",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah kata (المُهَنْدِسُونَ) pada kalimat: (أَقْبَلَ المُهَنْدِسُونَ إِلَى العَمَلِ)",
    prompt: "أَعْرِبْ كَلِمَةَ (المُهَنْدِسُونَ) فِي: أَقْبَلَ [المُهَنْدِسُونَ] إِلَى العَمَلِ.",
    rubric: {
      modelAnswer: "المُهَنْدِسُونَ: فاعل مرفوع، وعلامة رفعه الواو نيابة عن الضمة لأنه جمع مذكر سالم، والنون عوض عن التنوين في الاسم المفرد.",
      criteria: [
        "Kedudukan: Fa'il marfu'",
        "Tanda rafa': Wawu",
        "Alasan: Jamak Mudzakkar Salim"
      ],
      fullCredit: "Fa'il marfu' bil-wawi li-annahu jam'u mudzakkarin salim.",
      partialCredit: "Menyebutkan fa'il tapi tanda rafa' salah atau tidak menyebutkan alasan.",
      noCredit: "Kedudukan salah total."
    }
  },

  // --- BAB 11: إعراب جمع المؤنث السالم (Hal. 72-76) ---
  {
    id: 31,
    babNumber: 11,
    babTitle: "إعراب جمع المؤنث السالم",
    pageRef: "Hal. 72–76",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Apakah tanda nashab bagi Jamak Muannats Salim?",
    prompt: "يُنْصَبُ جَمْعُ المُؤَنَّثِ السَّالِمُ بِـ:",
    options: [
      "الكَسْرَةِ نِيَابَةً عَنِ الفَتْحَةِ",
      "الفَتْحَةِ الظَّاهِرَةِ",
      "اليَاءِ",
      "حَذْفِ النُّونِ"
    ],
    key: "الكَسْرَةِ نِيَابَةً عَنِ الفَتْحَةِ"
  },
  {
    id: 32,
    babNumber: 11,
    babTitle: "إعراب جمع المؤنث السالم",
    pageRef: "Hal. 72–76",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan kebenaran i'rab pada kalimat: (شَكَرْتُ المُعَلِّمَاتِ)",
    prompt: "كَلِمَةُ (المُعَلِّمَاتِ) فِي جُمْلَةِ (شَكَرْتُ المُعَلِّمَاتِ) مَفْعُولٌ بِهِ مَنْصُوبٌ بِالكَسْرَةِ.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 33,
    babNumber: 11,
    babTitle: "إعراب جمع المؤنث السالم",
    pageRef: "Hal. 72–76",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) pada huruf akhir kata jamak muannats salim pada kalimat: (رَأَيْتُ السَّيَّارَاتِ المُسْرِعَاتِ)",
    prompt: "اضْبِطْ آخِرَ جَمْعِ المُؤَنَّثِ السَّالِمِ فِي: (رَأَيْتُ السَّيَّارَات... المُسْرِعَات...)",
    rubric: {
      modelAnswer: "رَأَيْتُ السَّيَّارَاتِ المُسْرِعَاتِ (بكسر التاء في الكلمتين؛ لأن الأولى مفعول به منصوب بالكسرة، والثانية نعت منصوب بالكسرة).",
      criteria: [
        "Kasrah pada akhir kata 'السياراتِ'",
        "Kasrah pada akhir kata na'at 'المسرعاتِ'"
      ],
      fullCredit: "Keduanya diberi harakat kasrah dengan benar (السياراتِ المسرعاتِ).",
      partialCredit: "Hanya satu kata yang diberi kasrah dengan benar.",
      noCredit: "Memberi harakat fathah atau dhammah pada keduanya."
    }
  },

  // --- BAB 12: المضاف والمضاف إليه (Hal. 77-83) ---
  {
    id: 34,
    babNumber: 12,
    babTitle: "المضاف والمضاف إليه",
    pageRef: "Hal. 77–83",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Apa yang terjadi pada isim mutsanna atau jamak mudzakkar salim ketika dijadikan Mudhaf (مضاف)?",
    prompt: "عِنْدَ إِضَافَةِ المُثَنَّى أَوْ جَمْعِ المُذَكَّرِ السَّالِمِ، فَإِنَّهُ:",
    options: [
      "تُحْذَفُ نُونُهُ",
      "تَثْبُتُ نُونُهُ",
      "يُحْذَفُ حَرْفُ العِلَّةِ",
      "يُلْحَقُ بِهِ التَّنْوِينُ"
    ],
    key: "تُحْذَفُ نُونُهُ"
  },
  {
    id: 35,
    babNumber: 12,
    babTitle: "المضاف والمضاف إليه",
    pageRef: "Hal. 77–83",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Gabungkan kata (طَالِبَانِ) dengan (العِلْمِ) menjadi susunan idhafah yang benar (marfu'):",
    prompt: "رَكِّبْ (طَالِبَانِ) مَعَ (العِلْمِ) تَرْكِيباً إِضَافِيّاً مَرْفُوعاً:",
    key: "طالبا العلم",
    acceptedVariants: ["طَالِبَا العِلْمِ", "طَالِبَا الْعِلْمِ", "طالبا علم"]
  },
  {
    id: 36,
    babNumber: 12,
    babTitle: "المضاف والمضاف إليه",
    pageRef: "Hal. 77–83",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan pada susunan idhafah berikut: (جَاءَ مُعَلِّمُونَ المَدْرَسَةِ)",
    prompt: "صَحِّحِ الخَطَأَ فِي الجُمْلَةِ الإِضَافِيَّةِ الآتِيَةِ: (جَاءَ مُعَلِّمُونَ المَدْرَسَةِ).",
    rubric: {
      modelAnswer: "الصواب: جَاءَ مُعَلِّمُو المَدْرَسَةِ (بحذف نون جمع المذكر السالم للإضافة وبدون ألف بعد الواو).",
      criteria: [
        "Menghapus huruf nun pada kata 'معلمون' karena mudhaf -> 'معلمو'",
        "Tidak menambahkan alif setelah wawu jamak mudhaf"
      ],
      fullCredit: "Menulis: جَاءَ مُعَلِّمُو المَدْرَسَةِ secara tepat.",
      partialCredit: "Menghapus nun tetapi menambahkan alif (معلموا المدرسة).",
      noCredit: "Membiarkan nun tetap ada."
    }
  },

  // --- BAB 13: الأسماء الخمسة وإعرابها (Hal. 84-89) ---
  {
    id: 37,
    babNumber: 13,
    babTitle: "الأسماء الخمسة وإعرابها",
    pageRef: "Hal. 84–89",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah kalimat yang memuat asmaul khamsah dalam keadaan majrur secara tepat?",
    prompt: "أَيُّ الجُمَلِ الآتِيَةِ اشْتَمَلَتْ عَلَى اسْمٍ مِنَ الأَسْمَاءِ الخَمْسَةِ فِي حَالَةِ جَرٍّ؟",
    options: [
      "سَلَّمْتُ عَلَى أَبِيكَ",
      "جَاءَ أَبُوكَ",
      "رَأَيْتُ أَبَاكَ",
      "أَبُوكَ رَجُلٌ كَرِيمٌ"
    ],
    key: "سَلَّمْتُ عَلَى أَبِيكَ"
  },
  {
    id: 38,
    babNumber: 13,
    babTitle: "الأسماء الخمسة وإعرابها",
    pageRef: "Hal. 84–89",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Lengkapilah kalimat berikut dengan kata (أَخُو) dalam posisi manshub: (إِنَّ .... طَيِّبٌ)",
    prompt: "أَكْمِلِ الجُمْلَةَ بِكَلِمَةِ (أَخُو) مَنْصُوبَةً مَعَ كَافِ الخِطَابِ: إِنَّ [....] طَيِّبٌ.",
    key: "أخاك",
    acceptedVariants: ["أَخَاكَ", "اخاك", "أخاك "]
  },
  {
    id: 39,
    babNumber: 13,
    babTitle: "الأسماء الخمسة وإعرابها",
    pageRef: "Hal. 84–89",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah kata (ذَا) pada kalimat: (كَانَ عَلِيٌّ ذَا خُلُقٍ حَسَنٍ)",
    prompt: "أَعْرِبْ كَلِمَةَ (ذَا) فِي الجُمْلَةِ: كَانَ عَلِيٌّ [ذَا] خُلُقٍ حَسَنٍ.",
    rubric: {
      modelAnswer: "ذَا: خبر كان منصوب، وعلامة نصبه الألف نيابة عن الفتحة لأنه من الأسماء الخمسة، وهو مضاف.",
      criteria: [
        "Kedudukan: Khabar 'kaana' manshub",
        "Tanda nashab: Alif",
        "Alasan: Asma'ul Khamsah"
      ],
      fullCredit: "Khabar kaana manshub bil-alifi niダウンiyatan 'anil fathati li-annahu minal asma'il khamsah.",
      partialCredit: "Menyebutkan khabar kaana tapi keliru tanda nashabnya.",
      noCredit: "Menyebutkan isim kaana atau fa'il."
    }
  },

  // --- BAB 14: علامات التأنيث في الأفعال (Hal. 90-94) ---
  {
    id: 40,
    babNumber: 14,
    babTitle: "علامات التأنيث في الأفعال",
    pageRef: "Hal. 90–94",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Di manakah letak tanda ta'nits pada fi'il madhi?",
    prompt: "أَيْنَ تَقَعُ عَلامَةُ التَّأْنِيثِ فِي الفِعْلِ المَاضِي؟",
    options: [
      "تَاءٌ سَاكِنَةٌ فِي آخِرِهِ (نَحْوُ: كَتَبَتْ)",
      "تَاءٌ فِي أَوَّلِهِ (نَحْوُ: تَكْتُبُ)",
      "أَلِفٌ فِي آخِرِهِ",
      "نُونٌ فِي أَوَّلِهِ"
    ],
    key: "تَاءٌ سَاكِنَةٌ فِي آخِرِهِ (نَحْوُ: كَتَبَتْ)"
  },
  {
    id: 41,
    babNumber: 14,
    babTitle: "علامات التأنيث في الأفعال",
    pageRef: "Hal. 90–94",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan kebenaran kaidah tanda ta'nits pada fi'il mudhari':",
    prompt: "تَكُونُ عَلامَةُ التَّأْنِيثِ فِي أَوَّلِ الفِعْلِ المُضَارِعِ تَاءً مُتَحَرِّكَةً (مِثْلُ: تَقْرَأُ فَاطِمَةُ).",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 42,
    babNumber: 14,
    babTitle: "علامات التأنيث في الأفعال",
    pageRef: "Hal. 90–94",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah kalimat muzakkar berikut ke bentuk muannats dengan memberikan tanda ta'nits yang sesuai pada fi'ilnya: (سَافَرَ أَخِي إِلَى مَكَّةَ)",
    prompt: "حَوِّلِ الجُمْلَةَ الآتِيَةَ إِلَى المُؤَنَّثِ مُغَيِّراً مَا يَلْزَمُ: (سَافَرَ أَخِي إِلَى مَكَّةَ).",
    rubric: {
      modelAnswer: "سَافَرَتْ أُخْتِي إِلَى مَكَّةَ (بلحوق تاء التأنيث الساكنة في آخر الفعل الماضي).",
      criteria: [
        "Menambahkan ta' ta'nits sakinah pada fi'il madhi: 'سَافَرَتْ'",
        "Mengganti fa'il muzakkar 'أخي' menjadi muannats 'أختي'"
      ],
      fullCredit: "Menulis: سَافَرَتْ أُخْتِي إِلَى مَكَّةَ secara tepat.",
      partialCredit: "Mengubah fa'il tapi fi'ilnya tidak diberi ta' sakinah.",
      noCredit: "Jawaban salah atau tidak berubah."
    }
  },

  // --- BAB 15: علامات التأنيث في الأسماء (Hal. 95-99) ---
  {
    id: 43,
    babNumber: 15,
    babTitle: "علامات التأنيث في الأسماء",
    pageRef: "Hal. 95–99",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Identifikasi tanda ta'nits pada isim (صَحْرَاء):",
    prompt: "مَا هِيَ عَلامَةُ التَّأْنِيثِ فِي كَلِمَةِ (صَحْرَاء)؟",
    options: [
      "الأَلِفُ المَمْدُودَةُ",
      "الأَلِفُ المَقْصُورَةُ",
      "التَّاءُ المَرْبُوطَةُ",
      "اليَاءُ"
    ],
    key: "الأَلِفُ المَمْدُودَةُ"
  },
  {
    id: 44,
    babNumber: 15,
    babTitle: "علامات التأنيث في الأسماء",
    pageRef: "Hal. 95–99",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah kata sifat muzakkar (أَكْبَر) menjadi isim muannats yang berakhiran tanda ta'nits alif maqshurah (الألف المقصورة):",
    prompt: "حَوِّلِ الصِّفَةَ (أَكْبَر) إِلَى اسْمٍ مُؤَنَّثٍ عَلامَةُ تَأْنِيثِهِ الأَلِفُ المَقْصُورَةُ:",
    rubric: {
      modelAnswer: "كُبْرَى (على وزن فُعْلَى، والألف المقصورة في آخرها هي علامة التأنيث).",
      criteria: [
        "Menulis kata 'كُبْرَى'",
        "Mengenali alif maqshurah sebagai tanda ta'nits isim"
      ],
      fullCredit: "Menulis 'كُبْرَى' dengan benar.",
      partialCredit: "Menulis dengan ta marbuthah (كبيرة).",
      noCredit: "Jawaban keliru."
    }
  },
  {
    id: 45,
    babNumber: 15,
    babTitle: "علامات التأنيث في الأسماء",
    pageRef: "Hal. 95–99",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tuliskan bentuk muannats dari kata (أَحْمَر) yang berakhiran alif mamdudah:",
    prompt: "هَاتِ مُؤَنَّثَ كَلِمَةِ (أَحْمَر) المَخْتُومَ بِأَلِفِ التَّأْنِيثِ المَمْدُودَةِ:",
    key: "حمراء",
    acceptedVariants: ["حَمْرَاءُ", "حَمْرَاء", "حمراء "]
  },

  // --- BAB 16: النكرة والمعرفة (Hal. 100-104) ---
  {
    id: 46,
    babNumber: 16,
    babTitle: "النكرة والمعرفة",
    pageRef: "Hal. 100–104",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan status isim pada kata (كِتَابٌ) dalam kalimat: (اشْتَرَيْتُ كِتَاباً):",
    prompt: "مَا نَوْعُ كَلِمَةِ (كِتَاباً) فِي جُمْلَةِ (اشْتَرَيْتُ كِتَاباً) مِنْ حَيْثُ التَّعْرِيفُ وَالتَّنْكِيرُ؟",
    options: [
      "نَكِرَةٌ",
      "مَعْرِفَةٌ"
    ],
    key: "نَكِرَةٌ"
  },
  {
    id: 47,
    babNumber: 16,
    babTitle: "النكرة والمعرفة",
    pageRef: "Hal. 100–104",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah definisi isim nakirah yang benar menurut Al-Nahw al-Wadih?",
    prompt: "تَعْرِيفُ الاسْمِ النَّكِرَةِ هُوَ:",
    options: [
      "اسْمٌ يَدُلُّ عَلَى شَيْءٍ غَيْرِ مُعَيَّنٍ",
      "اسْمٌ يَدُلُّ عَلَى شَيْءٍ مُعَيَّنٍ",
      "كُلُّ اسْمٍ لَيْسَ فِي آخِرِهِ تَنْوِينٌ",
      "كُلُّ اسْمٍ اقْتَرَنَ بِـ (أَلْ)"
    ],
    key: "اسْمٌ يَدُلُّ عَلَى شَيْءٍ غَيْرِ مُعَيَّنٍ"
  },
  {
    id: 48,
    babNumber: 16,
    babTitle: "النكرة والمعرفة",
    pageRef: "Hal. 100–104",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah isim nakirah pada kalimat: (رَكِبْتُ حِصَاناً سَرِيعاً) menjadi isim ma'rifah bi-al:",
    prompt: "حَوِّلِ الاسْمَ النَّكِرَةَ فِي الجُمْلَةِ إِلَى مَعْرِفَةٍ بِأَلْ: (رَكِبْتُ حِصَاناً سَرِيعاً).",
    rubric: {
      modelAnswer: "رَكِبْتُ الحِصَانَ السَّرِيعَ (بدخول 'أل' وحذف التنوين من الموصوف والصفة).",
      criteria: [
        "Memasukkan 'Al' pada kata حصان -> الحصان",
        "Menghapus tanwin saat kemasukan 'Al'",
        "Menyesuaikan sifat (السريع)"
      ],
      fullCredit: "Menulis: رَكِبْتُ الحِصَانَ السَّرِيعَ dengan benar.",
      partialCredit: "Memasukkan Al pada isim pertama tapi masih mempertahankan tanwin.",
      noCredit: "Tidak memasukkan Al atau kalimat tidak berubah."
    }
  },

  // --- BAB 17: العلم (Hal. 105-108) ---
  {
    id: 49,
    babNumber: 17,
    babTitle: "العلم",
    pageRef: "Hal. 105–108",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah di antara kata-kata berikut yang termasuk isim 'Alam (العَلَم)?",
    prompt: "أَيُّ الكَلِمَاتِ الآتِيَةِ يُعَدُّ اسْمَ عَلَمٍ؟",
    options: [
      "مَكَّةُ",
      "مَدِينَةٌ",
      "جَبَلٌ",
      "رَجُلٌ"
    ],
    key: "مَكَّةُ"
  },
  {
    id: 50,
    babNumber: 17,
    babTitle: "العلم",
    pageRef: "Hal. 105–108",
    type: "benar_salah",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan kebenaran definisi 'Alam berikut:",
    prompt: "العَلَمُ اسْمٌ مَعْرِفَةٌ يُعَيِّنُ مُسَمَّاهُ تَعْيِيناً مُطْلَقاً كَأَسْمَاءِ الأَشْخَاصِ وَالبُلْدَانِ.",
    options: [
      "صحيح (Benar)",
      "خطأ (Salah)"
    ],
    key: "صحيح (Benar)"
  },
  {
    id: 51,
    babNumber: 17,
    babTitle: "العلم",
    pageRef: "Hal. 105–108",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Sebutkan isim 'alam yang terdapat pada kalimat: (سَافَرَ يُوسُفُ إِلَى القَاهِرَةِ) - tulis salah satu:",
    prompt: "اسْتَخْرِجِ اسْمَ عَلَمٍ لِشَخْصٍ مِنَ الجُمْلَةِ: (سَافَرَ يُوسُفُ إِلَى القَاهِرَةِ):",
    key: "يوسف",
    acceptedVariants: ["يُوسُفُ", "يُوسُف"]
  },

  // --- BAB 18: المعرف بالألف واللام (Hal. 109-112) ---
  {
    id: 52,
    babNumber: 18,
    babTitle: "المعرف بالألف واللام",
    pageRef: "Hal. 109–112",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Bagaimanakah pengaruh masuknya 'Al' (أل) terhadap harakat tanwin pada isim nakirah?",
    prompt: "إِذَا دَخَلَتْ (أَلْ) عَلَى الاسْمِ المُنَوَّنِ، فَإِنَّ التَّنْوِينَ:",
    options: [
      "يُحْذَفُ فَلَا يَجْتَمِعُ مَعَ (أَلْ)",
      "يَبْقَى كَمَا هُوَ",
      "يَتَحَوَّلُ إِلَى سُكُونٍ دَائِماً",
      "يُسْتَبْدَلُ بِيَاءٍ"
    ],
    key: "يُحْذَفُ فَلَا يَجْتَمِعُ مَعَ (أَلْ)"
  },
  {
    id: 53,
    babNumber: 18,
    babTitle: "المعرف بالألف واللام",
    pageRef: "Hal. 109–112",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) huruf akhir yang benar pada kalimat: (أَغْلَقْتُ البَابَ)",
    prompt: "اضْبِطْ بِالشَّكْلِ آخِرَ كَلِمَةِ (البَاب) فِي: (أَغْلَقْتُ البَاب...)",
    rubric: {
      modelAnswer: "البَابَ (بالفتحة الواحدة دون تنوين؛ لأنه مفعول به منصوب معرف بأل)",
      criteria: [
        "Memberikan fathah tunggal tanpa tanwin pada ba' akhir (البَابَ)",
        "Memahami kaidah bahwa isim ber-Al tidak boleh bertanwin"
      ],
      fullCredit: "Menulis البَابَ dengan fathah tunggal tanpa tanwin.",
      partialCredit: "Memberi fathah namun bertanwin (الباباً).",
      noCredit: "Memberi dhammah atau kasrah."
    }
  },
  {
    id: 54,
    babNumber: 18,
    babTitle: "المعرف بالألف واللام",
    pageRef: "Hal. 109–112",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan pada penulisan isim berikut: (قَرَأْتُ الكِتَاباً)",
    prompt: "صَحِّحِ الخَطَأَ الوَاقِعَ فِي كَلِمَةِ: (الكِتَاباً).",
    rubric: {
      modelAnswer: "الصواب: الكِتَابَ (أو: كِتَاباً بدون أل)؛ لأن 'أل' والتنوين لا يجتمعان في اسم واحد أبداً.",
      criteria: [
        "Menghilangkan tanwin jika memakai 'Al' -> الكِتَابَ",
        "Atau menghilangkan 'Al' jika bertanwin -> كِتَاباً",
        "Menyebutkan kaidah: Al dan tanwin tidak boleh bersatu"
      ],
      fullCredit: "Menulis: الكِتَابَ مع بيان امتناع اجتماع أل مع التنوين.",
      partialCredit: "Menulis kata yang benar tanpa penjelasan singkat.",
      noCredit: "Membenarkan penulisan 'الكتاباً'."
    }
  },

  // --- BAB 19: الضمير (Hal. 113-125) ---
  {
    id: 55,
    babNumber: 19,
    babTitle: "الضمير: المنفصل والمتصل والمستتر",
    pageRef: "Hal. 113–125",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Identifikasi jenis dhamir pada kata (كَتَبْتُ):",
    prompt: "التَّاءُ فِي (كَتَبْتُ) هِيَ ضَمِيرٌ:",
    options: [
      "مُتَّصِلٌ",
      "مُنْفَصِلٌ",
      "مُسْتَتِرٌ"
    ],
    key: "مُتَّصِلٌ"
  },
  {
    id: 56,
    babNumber: 19,
    babTitle: "الضمير: المنفصل والمتصل والمستتر",
    pageRef: "Hal. 113–125",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah dhamir mustatir wujuban (wajib tersembunyi)?",
    prompt: "فِي أَيِّ جُمْلَةٍ يَكُونُ الضَّمِيرُ المُسْتَتِرُ وَاجِبَ الاسْتِتَارِ؟",
    options: [
      "نَحْنُ نَكْتُبُ (الفاعل ضمير مستتر تقديره نحن)",
      "مُحَمَّدٌ كَتَبَ (الفاعل ضمير مستتر تقديره هو)",
      "فَاطِمَةُ كَتَبَتْ (الفاعل ضمير مستتر تقديره هي)",
      "الكِتَابُ أُغْلِقَ (نائب الفاعل مستتر تقديره هو)"
    ],
    key: "نَحْنُ نَكْتُبُ (الفاعل ضمير مستتر تقديره نحن)"
  },
  {
    id: 57,
    babNumber: 19,
    babTitle: "الضمير: المنفصل والمتصل والمستتر",
    pageRef: "Hal. 113–125",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah dhamir kaf (كَ) pada kata: (أَكْرَمَكَ المُعَلِّمُ)",
    prompt: "أَعْرِبِ الضَّمِيرَ (الكَافَ) فِي قَوْلِكَ: أَكْرَمَ[كَ] المُعَلِّمُ.",
    rubric: {
      modelAnswer: "الكاف: ضمير متصل مبني على الفتح في محل نصب مفعول به.",
      criteria: [
        "Menyebutkan dhamir muttashil",
        "Mabni 'alal fathi",
        "Fi mahalli nashbin maf'ul bih"
      ],
      fullCredit: "Dhamir muttashil mabni 'alal fathi fi mahalli nashbin maf'ul bih.",
      partialCredit: "Menyebutkan maf'ul bih tanpa menyebutkan mabni fi mahalli.",
      noCredit: "Menyebutkan fa'il atau majrur."
    }
  },

  // --- BAB 20: الاسم الموصول (Hal. 126-131) ---
  {
    id: 58,
    babNumber: 20,
    babTitle: "الاسم الموصول",
    pageRef: "Hal. 126–131",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Manakah isim maushul yang diperuntukkan bagi jama' muannats?",
    prompt: "الاسْمُ المَوْصُولُ الخَاصُّ بِجَمْعِ المُؤَنَّثِ هُوَ:",
    options: [
      "اللَّاتِي / اللَّائِي",
      "الَّذِينَ",
      "اللَّتَانِ",
      "الَّتِي"
    ],
    key: "اللَّاتِي / اللَّائِي"
  },
  {
    id: 59,
    babNumber: 20,
    babTitle: "الاسم الموصول",
    pageRef: "Hal. 126–131",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan dhamir 'a'id (العائد) pada kalimat: (جَاءَ الطَّالِبُ الَّذِي كَرَّمْتُهُ):",
    prompt: "عَيِّنِ الضَّمِيرَ العَائِدَ عَلَى الاسْمِ المَوْصُولِ فِي: (جَاءَ الطَّالِبُ الَّذِي كَرَّمْتُهُ):",
    options: [
      "الهاء في (كرمته)",
      "التاء في (كرمته)",
      "الضمير المستتر في (جاء)",
      "لا يوجد عائد"
    ],
    key: "الهاء في (كرمته)"
  },
  {
    id: 60,
    babNumber: 20,
    babTitle: "الاسم الموصول",
    pageRef: "Hal. 126–131",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah kalimat berikut ke bentuk mutsanna mudzakkar: (فَازَ التِّلْمِيذُ الَّذِي اجْتَهَدَ)",
    prompt: "حَوِّلِ الجُمْلَةَ الآتِيَةَ إِلَى المُثَنَّى المُذَكَّرِ: (فَازَ التِّلْمِيذُ الَّذِي اجْتَهَدَ).",
    rubric: {
      modelAnswer: "فَازَ التِّلْمِيذَانِ اللَّذَانِ اجْتَهَدَا (بإعراب المثنى بالألف وإضافة ألف الاثنين للفعل).",
      criteria: [
        "Mengubah isim menjadi mutsanna marfu': التلميذان",
        "Mengubah isim maushul menjadi mutsanna: اللذان",
        "Menyambungkan alif tatsniyah pada fi'il: اجتهدا"
      ],
      fullCredit: "Menulis: فَازَ التِّلْمِيذَانِ اللَّذَانِ اجْتَهَدَا secara lengkap.",
      partialCredit: "Mengubah sebagian komponen saja.",
      noCredit: "Jawaban keliru."
    }
  },

  // --- BAB 21: اسم الإشارة (Hal. 132-136) ---
  {
    id: 61,
    babNumber: 21,
    babTitle: "اسم الإشارة",
    pageRef: "Hal. 132–136",
    type: "pilihan_ganda",
    gradingType: "otomatis",
    points: 1,
    instruction: "Isim isyarah manakah yang digunakan untuk menunjuk mutsanna muannats (dua perempuan dekat)?",
    prompt: "اسْمُ الإِشَارَةِ المُسْتَخْدَمُ لِلْمُثَنَّى المُؤَنَّثِ فِي حَالَةِ الرَّفْعِ هُوَ:",
    options: [
      "هَاتَانِ",
      "هَذَانِ",
      "هَؤُلاءِ",
      "تِلْكَ"
    ],
    key: "هَاتَانِ"
  },
  {
    id: 62,
    babNumber: 21,
    babTitle: "اسم الإشارة",
    pageRef: "Hal. 132–136",
    type: "isian_singkat",
    gradingType: "otomatis",
    points: 1,
    instruction: "Isilah titik-titik dengan isim isyarah yang tepat untuk jamak tidak berakal: (.... أَشْجَارٌ مُثْمِرَةٌ)",
    prompt: "ضَعِ اسْمَ الإِشَارَةِ المُنَاسِبَ لِجَمْعِ غَيْرِ العَاقِلِ: [....] أَشْجَارٌ مُثْمِرَةٌ.",
    key: "هذه",
    acceptedVariants: ["هَذِهِ", "تلك", "تِلْكَ"]
  },
  {
    id: 63,
    babNumber: 21,
    babTitle: "اسم الإشارة",
    pageRef: "Hal. 132–136",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan penggunaan isim isyarah pada kalimat: (هَذَانِ بِنْتَانِ مُهَذَّبَتَانِ)",
    prompt: "صَحِّحِ الخَطَأَ فِي اسْتِعْمَالِ اسْمِ الإِشَارَةِ فِي: (هَذَانِ بِنْتَانِ مُهَذَّبَتَانِ).",
    rubric: {
      modelAnswer: "الصواب: هَاتَانِ بِنْتَانِ مُهَذَّبَتَانِ (باستعمال 'هاتان' للمثنى المؤنث بدلاً من 'هذان' للمذكر).",
      criteria: [
        "Mengganti 'هذان' menjadi 'هاتان'",
        "Menjelaskan bahwa 'بنتان' adalah mutsanna muannats"
      ],
      fullCredit: "Menulis: هَاتَانِ بِنْتَانِ مُهَذَّبَتَانِ مع صحة الإشارة للمثنى المؤنث.",
      partialCredit: "Hanya menulis kata 'هاتان' tanpa kalimat lengkap.",
      noCredit: "Mengganti dengan kata yang keliru."
    }
  },

  // --- BAB 22: نائب الفاعل (Hal. 137-143) ---
  {
    id: 64,
    babNumber: 22,
    babTitle: "نائب الفاعل",
    pageRef: "Hal. 137–143",
    type: "irab",
    gradingType: "manual",
    points: 2,
    instruction: "I'rab-lah kata (الوَاجِبُ) pada kalimat pasif: (كُتِبَ الوَاجِبُ)",
    prompt: "أَعْرِبْ كَلِمَةَ [الوَاجِبُ] فِي الجُمْلَةِ: كُتِبَ الوَاجِبُ.",
    rubric: {
      modelAnswer: "الوَاجِبُ: نائب فاعل مرفوع، وعلامة رفعه الضمة الظاهرة على آخره.",
      criteria: [
        "Kedudukan: Na'ib fa'il marfu'",
        "Tanda rafa': Dhammah zhahirah pada akhir kata"
      ],
      fullCredit: "نائب فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره.",
      partialCredit: "Menyebutkan fa'il atau maf'ul bih marfu'.",
      noCredit: "Kedudukan salah total."
    }
  },
  {
    id: 65,
    babNumber: 22,
    babTitle: "نائب الفاعل",
    pageRef: "Hal. 137–143",
    type: "transformasi",
    gradingType: "manual",
    points: 2,
    instruction: "Ubahlah kalimat aktif berikut menjadi kalimat pasif (mabni lil-majhul) dan tentukan harakat na'ib fa'ilnya: (فَتَحَ الوَلَدُ البَابَ)",
    prompt: "ابْنِ الجُمْلَةَ الآتِيَةَ لِلْمَجْهُولِ وَاضْبِطْ نَائِبَ الفَاعِلِ: (فَتَحَ الوَلَدُ البَابَ).",
    rubric: {
      modelAnswer: "فُتِحَ البَابُ (بضم أول الفعل وكسر ما قبل آخره، وحذف الفاعل، ورفع المفعول به ليصير نائب فاعل).",
      criteria: [
        "Mengubah fi'il menjadi mabni majhul: فُتِحَ",
        "Menghapus fa'il (الولد)",
        "Merofa'kan na'ib fa'il: البَابُ"
      ],
      fullCredit: "Menulis: فُتِحَ البَابُ بضبط الفعل ونائب الفاعل تماماً.",
      partialCredit: "Mengubah kalimat namun na'ib fa'il masih manshub (فتح البابَ).",
      noCredit: "Jawaban salah total."
    }
  },
  {
    id: 66,
    babNumber: 22,
    babTitle: "نائب الفاعل",
    pageRef: "Hal. 137–143",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) pada fi'il mudhari' mabni lil majhul dan na'ib fa'ilnya pada: (يُحْتَرَمُ المُعَلِّمُ)",
    prompt: "اضْبِطْ بِالشَّكْلِ الكَامِلِ الفِعْلَ وَنَائِبَ الفَاعِلِ فِي: (يحترم المعلم)",
    rubric: {
      modelAnswer: "يُحْتَرَمُ المُعَلِّمُ (بضم ياء المضارعة وفتح الراء، وضم ميم المعلم لأنه نائب فاعل مرفوع).",
      criteria: [
        "Harakat fi'il mudhari' majhul: dhommah awal, fathah sebelum akhir (يُحْتَرَمُ)",
        "Harakat na'ib al-fa'il: dhommah (المُعَلِّمُ)"
      ],
      fullCredit: "Harakat lengkap dan benar: يُحْتَرَمُ المُعَلِّمُ.",
      partialCredit: "Hanya fi'il atau na'ib fa'il yang benar.",
      noCredit: "Harakat keliru total."
    }
  },

  // --- BAB 23: أفعال الاستمرار الناسخة و"ما دام" (Hal. 144-150) ---
  {
    id: 67,
    babNumber: 23,
    babTitle: "أفعال الاستمرار الناسخة و\"ما دام\"",
    pageRef: "Hal. 144–150",
    type: "koreksi",
    gradingType: "manual",
    points: 2,
    instruction: "Koreksilah kesalahan i'rab khabar (مَا زَالَ) pada kalimat: (مَا زَالَ المُسَافِرُونَ قَادِمُونَ)",
    prompt: "صَحِّحِ الخَطَأَ الإِعْرَابِيَّ فِي الجُمْلَةِ الآتِيَةِ: (مَا زَالَ المُسَافِرُونَ قَادِمُونَ).",
    rubric: {
      modelAnswer: "الصواب: مَا زَالَ المُسَافِرُونَ قَادِمِينَ (بنصب خبر ما زال بالياء لأنه جمع مذكر سالم).",
      criteria: [
        "Mengubah 'قادمون' menjadi manshub dengan ya' -> 'قَادِمِينَ'",
        "Menyebutkan bahwa khabar ma zala harus manshub"
      ],
      fullCredit: "Menulis: مَا زَالَ المُسَافِرُونَ قَادِمِينَ مع ضبط النصب بالياء.",
      partialCredit: "Menulis 'قادمين' tanpa menyertakan kalimat lengkap.",
      noCredit: "Membiarkan dalam bentuk marfu'."
    }
  },
  {
    id: 68,
    babNumber: 23,
    babTitle: "أفعال الاستمرار الناسخة و\"ما دام\"",
    pageRef: "Hal. 144–150",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan makna dari kata kerja nasikh (مَا زَالَ) pada kalimat: (مَا زَالَ المَطَرُ نَازِلاً):",
    prompt: "مَا المَعْنَى الَّذِي يُفِيدُهُ الفِعْلُ (مَا زَالَ) فِي جُمْلَةِ (مَا زَالَ المَطَرُ نَازِلاً)؟",
    options: [
      "الاسْتِمْرَارُ (مُلازَمَةُ الخَبَرِ لِلْمُخْبَرِ عَنْهُ)",
      "بَيَانُ المُدَّةِ",
      "التَّحَوُّلُ وَالصَّيْرُورَةُ",
      "النَّفْيُ المُطْلَقُ"
    ],
    key: "الاسْتِمْرَارُ (مُلازَمَةُ الخَبَرِ لِلْمُخْبَرِ عَنْهُ)"
  },
  {
    id: 69,
    babNumber: 23,
    babTitle: "أفعال الاستمرار الناسخة و\"ما دام\"",
    pageRef: "Hal. 144–150",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) pada isim dan khabar dari (مَا زَالَ) pada kalimat: (مَا زَالَ الجَوُّ مُعْتَدِلاً)",
    prompt: "اضْبِطْ بِالشَّكْلِ آخِرَ الاسْمِ وَالخَبَرِ فِي: (مَا زَالَ الجَو... مُعْتَدِل...)",
    rubric: {
      modelAnswer: "مَا زَالَ الجَوُّ مُعْتَدِلاً (بضم واو الجو؛ لأنه اسم ما زال مرفوع، وتنصيب معتدلاً بالفتح؛ لأنه خبرها منصوب).",
      criteria: [
        "Harakat isim ma zala marfu' dengan dhammah (الجَوُّ)",
        "Harakat khabar ma zala manshub dengan fathatain (مُعْتَدِلاً)"
      ],
      fullCredit: "Menuliskan tanda harakat keduanya dengan tepat (الجَوُّ مُعْتَدِلاً).",
      partialCredit: "Hanya satu kata yang harakatnya benar.",
      noCredit: "Keduanya salah harakat."
    }
  },

  // --- BAB 24: المفعول المطلق (Hal. 151-157) ---
  {
    id: 70,
    babNumber: 24,
    babTitle: "المفعول المطلق",
    pageRef: "Hal. 151–157",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan jenis maf'ul muthlaq pada kalimat: (وَقَفْتُ وُقُوفاً):",
    prompt: "مَا نَوْعُ المَفْعُولِ المُطْلَقِ فِي: (وَقَفْتُ وُقُوفاً)؟",
    options: [
      "مُؤَكِّدٌ لِفِعْلِهِ",
      "مُبَيِّنٌ لِنَوْعِهِ",
      "مُبَيِّنٌ لِعَدَدِهِ",
      "مَفْعُولٌ لأَجْلِهِ"
    ],
    key: "مُؤَكِّدٌ لِفِعْلِهِ"
  },
  {
    id: 71,
    babNumber: 24,
    babTitle: "المفعول المطلق",
    pageRef: "Hal. 151–157",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) yang tepat pada kata maf'ul muthlaq berikut: (حَفِظْتُ القُرْآنَ حِفْظاً حَسَناً)",
    prompt: "اضْبِطْ بِالشَّكْلِ كَلِمَتَيْ (حفظاً حسناً) فِي الجُمْلَةِ: حَفِظْتُ القُرْآنَ [حفظاً حسناً].",
    rubric: {
      modelAnswer: "حِفْظاً حَسَناً (بتنوين الفتح؛ حفظاً مفعول مطلق مبين للنوع منصوب، وحسناً نعت منصوب).",
      criteria: [
        "Harakat fathatain pada 'حِفْظاً'",
        "Harakat fathatain pada na'at 'حَسَناً'"
      ],
      fullCredit: "Menulis حِفْظاً حَسَناً بتنوين النصب في الكلمتين.",
      partialCredit: "Memberi tanwin fathah pada kata pertama saja.",
      noCredit: "Memberi dhammah atau kasrah."
    }
  },

  // --- BAB 25: المفعول لأجله (Hal. 158-162) ---
  {
    id: 72,
    babNumber: 25,
    babTitle: "المفعول لأجله",
    pageRef: "Hal. 158–162",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan kedudukan kata (رَغْبَةً) pada kalimat: (سَافَرْتُ رَغْبَةً فِي العِلْمِ):",
    prompt: "مَا إِعْرَابُ كَلِمَةِ (رَغْبَةً) فِي قَوْلِكَ: سَافَرْتُ [رَغْبَةً] فِي العِلْمِ؟",
    options: [
      "مَفْعُولٌ لأَجْلِهِ مَنْصُوبٌ",
      "مَفْعُولٌ مُطْلَقٌ مَنْصُوبٌ",
      "حَالٌ مَنْصُوبَةٌ",
      "تَمْيِيزٌ مَنْصُوبٌ"
    ],
    key: "مَفْعُولٌ لأَجْلِهِ مَنْصُوبٌ"
  },
  {
    id: 73,
    babNumber: 25,
    babTitle: "المفعول لأجله",
    pageRef: "Hal. 158–162",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) pada maf'ul li-ajlih di kalimat: (قُمْتُ إِجْلالاً لِلأُسْتَاذِ)",
    prompt: "اضْبِطْ بِالشَّكْلِ كَلِمَةَ (إجلالاً) فِي الجُمْلَةِ: قُمْتُ [إجلالاً] لِلأُسْتَاذِ.",
    rubric: {
      modelAnswer: "إِجْلالاً (بتنوين الفتح؛ لأنه مفعول لأجله منصوب يبين علة القيام).",
      criteria: [
        "Harakat fathatain pada akhir kata إِجْلالاً",
        "Mengetahui bahwa maf'ul li-ajlih manshub"
      ],
      fullCredit: "Menulis إِجْلالاً بتنوين الفتح.",
      partialCredit: "Menulis dengan fathah satu tanpa tanwin (إجلالَ).",
      noCredit: "Memberi dhammah atau kasrah."
    }
  },

  // --- BAB 26: ظرف الزمان وظرف المكان (Hal. 163-170) ---
  {
    id: 74,
    babNumber: 26,
    babTitle: "ظرف الزمان وظرف المكان (المفعول فيه)",
    pageRef: "Hal. 163–170",
    type: "identifikasi",
    gradingType: "otomatis",
    points: 1,
    instruction: "Tentukan klasifikasi zharf pada kata (فَوْقَ) dalam kalimat: (وَقَفَ العُصْفُورُ فَوْقَ الشَّجَرَةِ):",
    prompt: "مَا نَوْعُ الظَّرْفِ فِي كَلِمَةِ (فَوْقَ)؟",
    options: [
      "ظَرْفُ مَكَانٍ",
      "ظَرْفُ زَمَانٍ",
      "مَفْعُولٌ بِهِ",
      "مَفْعُولٌ مُطْلَقٌ"
    ],
    key: "ظَرْفُ مَكَانٍ"
  },
  {
    id: 75,
    babNumber: 26,
    babTitle: "ظرف الزمان وظرف المكان (المفعول فيه)",
    pageRef: "Hal. 163–170",
    type: "tashkeel",
    gradingType: "manual",
    points: 2,
    instruction: "Berikan harakat (syakkal) pada zharf zaman pada kalimat: (سَافَرْتُ لَيْلاً)",
    prompt: "اضْبِطْ بِالشَّكْلِ كَلِمَةَ (ليلاً) فِي جُمْلَةِ: (سَافَرْتُ ليلاً).",
    rubric: {
      modelAnswer: "لَيْلاً (بتنوين الفتح؛ لأنه ظرف زمان / مفعول فيه منصوب).",
      criteria: [
        "Harakat fathatain pada kata لَيْلاً",
        "Mengetahui bahwa zharf zaman manshub"
      ],
      fullCredit: "Menulis لَيْلاً بتنوين الفتح.",
      partialCredit: "Menulis ليلاً بفتحة واحدة دون تنوين.",
      noCredit: "Memberi kasrah atau dhammah."
    }
  }
];
