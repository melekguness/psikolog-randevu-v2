export type DepartmentId = "dietitian" | "psychologist";

export type AvailabilityStatus = "available" | "limited" | "full" | "leave";

export interface SpecialistBase {
  id: string;
  fullName: string;
  title: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  availability: AvailabilityStatus;
  room?: string;
  active: boolean;
  experienceYears?: number;
  languages?: string[];
  rating?: number;
  workingDays?: string[];
  certificates?: string[];
}

export interface TimeSlot {
  id: string;
  specialistId: string;
  department: DepartmentId;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isClosed?: boolean;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface CitizenContact {
  fullName: string;
  phone: string;
  email?: string;
}

export type TimeRangePreference = "morning" | "afternoon" | "any";

export const TIME_RANGE_LABELS: Record<TimeRangePreference, string> = {
  morning: "Sabah (08:00 – 12:00)",
  afternoon: "Öğleden sonra (12:00 – 17:00)",
  any: "Fark etmez",
};

export type AppointmentRequestStatus = "received";

export interface AppointmentRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  department: DepartmentId;
  preferredDate: string;
  timeRange: TimeRangePreference;
  kvkkAccepted: boolean;
  createdAt: string;
  status: AppointmentRequestStatus;
}

export interface AppointmentBase {
  id: string;
  /** Randevu kodu, örn. ATK-20260910-001 */
  code?: string;
  department: DepartmentId;
  specialistId: string;
  specialistName: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  citizen: CitizenContact;
  status: AppointmentStatus;
  smsVerified: boolean;
  createdAt: string;
  notes?: string;
}

export interface MunicipalityInfo {
  name: string;
  shortName: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

export const DEPARTMENT_LABELS: Record<DepartmentId, string> = {
  dietitian: "Diyetisyen",
  psychologist: "Psikolog",
};
