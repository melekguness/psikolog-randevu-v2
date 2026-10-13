import type { AppointmentBase, SpecialistBase } from "./index";
export type NutritionGoal =
  | "weight_loss"
  | "weight_gain"
  | "healthy_eating"
  | "sports_nutrition"
  | "medical_nutrition"
  | "child_nutrition";

export const NUTRITION_GOAL_LABELS: Record<NutritionGoal, string> = {
  weight_loss: "Kilo Verme",
  weight_gain: "Kilo Alma",
  healthy_eating: "Sağlıklı Beslenme",
  sports_nutrition: "Sporcu Beslenmesi",
  medical_nutrition: "Tıbbi Beslenme (Diyabet, Tansiyon vb.)",
  child_nutrition: "Çocuk Beslenmesi",
};

export interface Dietitian extends SpecialistBase {
  department: "dietitian";
  sessionDurationMin: number;
  acceptsOnline: boolean;
}

export interface DietitianAssessment {
  goal: NutritionGoal;
  ageRange: "18-30" | "31-45" | "46-60" | "60+";
  hasChronicCondition: boolean;
  chronicNote?: string;
  previousDietitian: boolean;
  heightCm?: number;
  weightKg?: number;
  foodAllergies?: string;
  activityLevel?: "sedentary" | "light" | "moderate" | "active";
  bmi?: number;
}

export interface DietitianAppointment extends AppointmentBase {
  department: "dietitian";
  assessment: DietitianAssessment;
  consentAccepted: boolean;
}
