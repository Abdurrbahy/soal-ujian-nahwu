import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Arabic text for flexible matching in short answers.
 * Removes diacritics (tashkeel), normalizes hamza, alef maksura, and trims spaces.
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .trim()
    // Remove Arabic diacritics (fathah, kasrah, dhammah, sukun, shaddah, tanwin)
    .replace(/[\u064B-\u0652\u0670]/g, "")
    // Normalize Alefs: أ, إ, آ, ٱ -> ا
    .replace(/[أإآٱ]/g, "ا")
    // Normalize ta marbutah: ة -> ه (or keep, let's keep flexible)
    // Normalize ya / alef maksura: ى -> ي
    .replace(/ى/g, "ي")
    // Replace multiple spaces with single space
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Checks if student answer matches correct key or any accepted variant.
 */
export function checkAnswerMatch(studentAnswer: string, key: string, acceptedVariants?: string[]): boolean {
  if (!studentAnswer) return false;
  const sNorm = normalizeArabic(studentAnswer);
  const kNorm = normalizeArabic(key);

  if (sNorm === kNorm) return true;

  if (acceptedVariants && acceptedVariants.length > 0) {
    for (const v of acceptedVariants) {
      if (sNorm === normalizeArabic(v)) {
        return true;
      }
    }
  }

  // Also check without removing ta marbutah
  const sStrict = studentAnswer.trim().replace(/[\u064B-\u0652\u0670]/g, "").replace(/\s+/g, " ");
  const kStrict = key.trim().replace(/[\u064B-\u0652\u0670]/g, "").replace(/\s+/g, " ");
  return sStrict.toLowerCase() === kStrict.toLowerCase();
}
