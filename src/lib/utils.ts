import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Arabic text for flexible matching in short answers.
 * Removes diacritics (tashkeel), normalizes hamza, alef maksura, and trims spaces.
 */
export function normalizeArabic(text: unknown): string {
  if (text === null || text === undefined) return "";
  return String(text)
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
export function checkAnswerMatch(studentAnswer: unknown, key: unknown, acceptedVariants?: unknown[]): boolean {
  if (studentAnswer === null || studentAnswer === undefined) return false;
  const sStr = String(studentAnswer);
  const kStr = String(key || "");

  const sNorm = normalizeArabic(sStr);
  const kNorm = normalizeArabic(kStr);

  if (sNorm && sNorm === kNorm) return true;

  if (Array.isArray(acceptedVariants) && acceptedVariants.length > 0) {
    for (const v of acceptedVariants) {
      if (v !== undefined && v !== null && sNorm === normalizeArabic(v)) {
        return true;
      }
    }
  }

  // Also check without removing ta marbutah
  const sStrict = sStr.trim().replace(/[\u064B-\u0652\u0670]/g, "").replace(/\s+/g, " ");
  const kStrict = kStr.trim().replace(/[\u064B-\u0652\u0670]/g, "").replace(/\s+/g, " ");
  return sStrict.toLowerCase() === kStrict.toLowerCase();
}
