import type { DepartmentId, TimeSlot } from "@/types";
import { addDaysISO, todayISO } from "@/lib/utils";

export interface SlotTemplate {
  weekdays: string[];
  hours: string[];
}
export function buildSlotsFromTemplate(params: {
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

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}
