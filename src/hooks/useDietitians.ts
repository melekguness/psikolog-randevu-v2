
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dietitianService } from "@/services/dietitianService";
import type { DietitianAppointment } from "@/types/dietitian";
import { openSlotKeys } from "@/hooks/useOpenSlots";

export const dietitianKeys = {
  all: ["dietitian"] as const,
  specialists: () => [...dietitianKeys.all, "specialists"] as const,
  slots: (specialistId: string, date?: string) =>
    [...dietitianKeys.all, "slots", specialistId, date ?? "all"] as const,
  dates: (specialistId: string) =>
    [...dietitianKeys.all, "dates", specialistId] as const,
  scheduleDates: (specialistId: string) =>
    [...dietitianKeys.all, "scheduleDates", specialistId] as const,
  appointments: (date?: string, specialistId?: string) =>
    [
      ...dietitianKeys.all,
      "appointments",
      date ?? "all",
      specialistId ?? "any",
    ] as const,
};

export function useDietitians() {
  return useQuery({
    queryKey: dietitianKeys.specialists(),
    queryFn: () => dietitianService.listSpecialists(),
  });
}

export function useDietitianSlots(specialistId: string, date?: string) {
  return useQuery({
    queryKey: dietitianKeys.slots(specialistId, date),
    queryFn: () => dietitianService.listSlots(specialistId, date),
    enabled: Boolean(specialistId),
  });
}

export function useDietitianDates(specialistId: string) {
  return useQuery({
    queryKey: dietitianKeys.dates(specialistId),
    queryFn: () => dietitianService.listAvailableDates(specialistId),
    enabled: Boolean(specialistId),
  });
}

export function useDietitianScheduleDates(specialistId: string) {
  return useQuery({
    queryKey: dietitianKeys.scheduleDates(specialistId),
    queryFn: () => dietitianService.listScheduleDates(specialistId),
    enabled: Boolean(specialistId),
  });
}

export function useDietitianAppointments(
  date?: string,
  specialistId?: string,
) {
  return useQuery({
    queryKey: dietitianKeys.appointments(date, specialistId),
    queryFn: () => dietitianService.listAppointments(date, specialistId),
    enabled: Boolean(specialistId),
  });
}

export function useCreateDietitianAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      input: Omit<
        DietitianAppointment,
        "id" | "createdAt" | "status" | "department"
      >,
    ) => dietitianService.createAppointment(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dietitianKeys.all });
      void qc.invalidateQueries({ queryKey: openSlotKeys.all });
    },
  });
}

export function useCancelDietitianAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, phone }: { id: string; phone: string }) =>
      dietitianService.cancelAppointment(id, phone),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dietitianKeys.all });
    },
  });
}

export function useSetDietitianSlotClosed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, closed }: { slotId: string; closed: boolean }) =>
      dietitianService.setSlotClosed(slotId, closed),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dietitianKeys.all });
      void qc.invalidateQueries({ queryKey: openSlotKeys.all });
    },
  });
}

export function useUpdateDietitianAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      specialistId,
    }: {
      id: string;
      status: DietitianAppointment["status"];
      specialistId?: string;
    }) => dietitianService.updateStatus(id, status, specialistId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dietitianKeys.all });
      void qc.invalidateQueries({ queryKey: openSlotKeys.all });
    },
  });
}
