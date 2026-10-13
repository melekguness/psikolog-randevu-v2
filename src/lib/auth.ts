import type { DepartmentId } from "@/types";

export type DoctorSession = {
  role: "doctor";
  specialistId: string;
  department: DepartmentId;
  fullName: string;
  title?: string;
  photoUrl?: string;
};

const DOCTOR_KEY = "atakum_doctor_session";

export const DOCTOR_DEMO_PIN = "1234";

export function readDoctorSession(): DoctorSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DOCTOR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DoctorSession;
    if (
      parsed?.role !== "doctor" ||
      !parsed.specialistId ||
      !parsed.department
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeDoctorSession(session: DoctorSession | null) {
  if (typeof window === "undefined") return;
  if (!session) sessionStorage.removeItem(DOCTOR_KEY);
  else sessionStorage.setItem(DOCTOR_KEY, JSON.stringify(session));
}
