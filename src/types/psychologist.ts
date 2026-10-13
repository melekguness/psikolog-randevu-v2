import type { AppointmentBase, SpecialistBase } from "./index";
export type SessionType =
  | "individual"
  | "couple"
  | "family"
  | "child_adolescent"
  | "crisis_support";

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  individual: "Bireysel Seans",
  couple: "Çift Danışmanlığı",
  family: "Aile Danışmanlığı",
  child_adolescent: "Çocuk / Ergen",
  crisis_support: "Kriz Destek Görüşmesi",
};

export interface Psychologist extends SpecialistBase {
  department: "psychologist";
  sessionDurationMin: number;
  languages: string[];
  acceptsCrisis: boolean;
}

export interface PsychologistAssessment {
  sessionType: SessionType;
  preferredTimeOfDay: "morning" | "afternoon" | "any";
  isFirstVisit: boolean;
  urgency: "routine" | "soon" | "urgent";
  briefNote?: string;
  stressLevel?: 1 | 2 | 3 | 4 | 5;
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  visitReason?: string;
  emergencyRisk?: boolean;
  previousTherapy?: boolean;
}

export interface PsychologistAppointment extends AppointmentBase {
  department: "psychologist";
  assessment: PsychologistAssessment;
  kvkkAccepted: boolean;
}
