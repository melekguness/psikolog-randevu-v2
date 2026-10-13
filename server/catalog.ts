import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DepartmentId, TimeSlot } from "../src/types/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Dynamic import of compiled-style TS via tsx: load JSON + slot factory helpers locally
// to avoid circular path issues. Slot ID format must match frontend slotFactory.

type SlotTemplate = { weekdays: string[]; hours: string[] };

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildSlots(params: {
  department: DepartmentId;
  specialistIds: string[];
  template: SlotTemplate;
  bookedSlotKeys: string[];
  daysAhead?: number;
  sessionDurationMin: number;
}): TimeSlot[] {
  const {
    department,
    specialistIds,
    template,
    bookedSlotKeys,
    daysAhead = 14,
    sessionDurationMin,
  } = params;
  const booked = new Set(bookedSlotKeys);
  const weekdaySet = new Set(template.weekdays.map(Number));
  const start = todayISO();
  const slots: TimeSlot[] = [];

  for (let offset = 0; offset < daysAhead; offset++) {
    const date = addDaysISO(start, offset);
    const jsDay = new Date(`${date}T12:00:00`).getDay();
    const isoDow = jsDay === 0 ? 7 : jsDay;
    if (!weekdaySet.has(isoDow)) continue;

    for (const specialistId of specialistIds) {
      for (const startTime of template.hours) {
        const endTime = addMinutes(startTime, sessionDurationMin);
        const key = `${specialistId}|${offset}|${startTime}`;
        slots.push({
          id: `${department}_${specialistId}_${date}_${startTime.replace(":", "")}`,
          specialistId,
          department,
          date,
          startTime,
          endTime,
          isBooked: booked.has(key),
        });
      }
    }
  }
  return slots;
}

function loadJson(rel: string) {
  return JSON.parse(readFileSync(path.join(root, rel), "utf8"));
}

const dietitianData = loadJson("src/data/dietitians.json");
const psychologistData = loadJson("src/data/psychologists.json");

const dietitianSlots = buildSlots({
  department: "dietitian",
  specialistIds: dietitianData.specialists
    .filter((d: { active: boolean }) => d.active)
    .map((d: { id: string }) => d.id),
  template: dietitianData.slotTemplate,
  bookedSlotKeys: dietitianData.bookedSlotKeys ?? [],
  sessionDurationMin: 45,
});

const psychologistSlots = buildSlots({
  department: "psychologist",
  specialistIds: psychologistData.specialists
    .filter((d: { active: boolean }) => d.active)
    .map((d: { id: string }) => d.id),
  template: psychologistData.slotTemplate,
  bookedSlotKeys: psychologistData.bookedSlotKeys ?? [],
  sessionDurationMin: 50,
});

export function getSpecialists(department: DepartmentId) {
  const data =
    department === "dietitian" ? dietitianData : psychologistData;
  return (data.specialists as Array<Record<string, unknown>>).filter(
    (s) => s.active,
  );
}

export function getSpecialist(department: DepartmentId, id: string) {
  return getSpecialists(department).find((s) => s.id === id);
}

export function getTemplateSlots(department: DepartmentId): TimeSlot[] {
  return department === "dietitian" ? dietitianSlots : psychologistSlots;
}

export function findSlot(
  department: DepartmentId,
  slotId: string,
): TimeSlot | undefined {
  return getTemplateSlots(department).find((s) => s.id === slotId);
}
