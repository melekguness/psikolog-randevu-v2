
import { useQuery } from "@tanstack/react-query";
import { dietitianService } from "@/services/dietitianService";
import { psychologistService } from "@/services/psychologistService";
import type { DepartmentId } from "@/types";

export const openSlotKeys = {
  all: ["open-slots"] as const,
  dates: (department: DepartmentId) =>
    [...openSlotKeys.all, "dates", department] as const,
  slots: (department: DepartmentId, date: string) =>
    [...openSlotKeys.all, "slots", department, date] as const,
};

export function useOpenDates(department: DepartmentId | null) {
  return useQuery({
    queryKey: openSlotKeys.dates(department ?? "dietitian"),
    queryFn: () =>
      department === "dietitian"
        ? dietitianService.listOpenDates()
        : psychologistService.listOpenDates(),
    enabled: Boolean(department),
  });
}

export function useOpenSlots(department: DepartmentId | null, date: string) {
  return useQuery({
    queryKey: openSlotKeys.slots(department ?? "dietitian", date),
    queryFn: () =>
      department === "dietitian"
        ? dietitianService.listOpenSlots(date)
        : psychologistService.listOpenSlots(date),
    enabled: Boolean(department && date),
  });
}
