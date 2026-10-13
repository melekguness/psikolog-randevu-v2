import dietitianData from "@/data/dietitians.json";
import psychologistData from "@/data/psychologists.json";
import type { DepartmentId } from "@/types";

type SpecialistLite = {
  id: string;
  fullName: string;
  photoUrl: string;
};

const roster: SpecialistLite[] = [
  ...(dietitianData.specialists as SpecialistLite[]),
  ...(psychologistData.specialists as SpecialistLite[]),
];

export const SPECIALIST_BY_ID = new Map(roster.map((s) => [s.id, s]));

/** Yerel uzman görselleri (erkek / kadın illüstrasyon). */
export const DOCTOR_MALE_AVATAR = "/avatars/doctor-male.jpg";
export const DOCTOR_FEMALE_AVATAR = "/avatars/doctor-female.jpg";

export const PLACEHOLDER_AVATAR_BY_ID: Record<string, string> = {
  dt_ayse_yilmaz: DOCTOR_FEMALE_AVATAR,
  dt_mehmet_kaya: DOCTOR_FEMALE_AVATAR,
  dt_elif_demir: DOCTOR_FEMALE_AVATAR,
  ps_mehmet_akgun: DOCTOR_MALE_AVATAR,
  ps_giray_gundogdu: DOCTOR_MALE_AVATAR,
  ps_selin_aksoy: DOCTOR_FEMALE_AVATAR,
};

const TITLE_TOKENS = new Set([
  "dyt",
  "uzm",
  "psk",
  "dr",
  "prof",
  "doç",
  "doc",
  "uzman",
]);

export function isUnsplashPortraitUrl(url?: string): boolean {
  return Boolean(url?.startsWith("https://images.unsplash.com/"));
}

export function isRemotePortraitUrl(url?: string): boolean {
  return Boolean(url && /^https?:\/\//i.test(url));
}

export function specialistInitials(fullName?: string): string {
  if (!fullName?.trim()) return "";
  const parts = fullName
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.]/g, ""))
    .filter((part) => part && !TITLE_TOKENS.has(part.toLocaleLowerCase("tr-TR")));
  const letters = parts.map((part) => part.charAt(0)).filter(Boolean);
  return (letters.slice(0, 2).join("") || "U").toLocaleUpperCase("tr-TR");
}

export function resolveSpecialistIdByName(fullName?: string): string | undefined {
  const name = fullName?.trim();
  if (!name) return undefined;
  for (const [id, specialist] of SPECIALIST_BY_ID) {
    if (specialist.fullName === name) return id;
  }
  return undefined;
}

export function resolveSpecialistName(
  specialistId?: string,
  fullName?: string,
): string {
  return fullName?.trim() || SPECIALIST_BY_ID.get(specialistId ?? "")?.fullName || "";
}

export function resolveSpecialistPhotoSrc(
  specialistId?: string,
  photoUrl?: string,
): string | undefined {
  // Never use /specialists/ portrait assets.
  if (photoUrl?.startsWith("/specialists/")) return undefined;

  if (photoUrl?.startsWith("/avatars/")) return photoUrl;
  if (specialistId && PLACEHOLDER_AVATAR_BY_ID[specialistId]) {
    return PLACEHOLDER_AVATAR_BY_ID[specialistId];
  }

  // Prefer roster remote stock only as last resort.
  if (isUnsplashPortraitUrl(photoUrl)) return photoUrl;
  if (specialistId) {
    const fromRoster = SPECIALIST_BY_ID.get(specialistId)?.photoUrl;
    if (fromRoster?.startsWith("/avatars/") || isUnsplashPortraitUrl(fromRoster)) {
      return fromRoster;
    }
  }

  return undefined;
}

export const STAFF_DEPARTMENT_BADGE: Record<DepartmentId, string> = {
  psychologist: "Psikolog",
  dietitian: "Diyetisyen",
};
