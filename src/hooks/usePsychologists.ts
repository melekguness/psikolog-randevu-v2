
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { psychologistService } from "@/services/psychologistService";
import type { PsychologistAppointment } from "@/types/psychologist";
import { openSlotKeys } from "@/hooks/useOpenSlots";

export const psychologistKeys = {
  all: ["psychologist"] as const,
  specialists: () => [...psychologistKeys.all, "specialists"] as const,
  slots: (specialistId: string, date?: string) =>
    [...psychologistKeys.all, "slots", specialistId, date ?? "all"] as const,
  dates: (specialistId: string) =>
    [...psychologistKeys.all, "dates", specialistId] as const,
  scheduleDates: (specialistId: string) =>
    [...psychologistKeys.all, "scheduleDates", specialistId] as const,
  appointments: (date?: string, specialistId?: string) =>
    [
      ...psychologistKeys.all,
      "appointments",
      date ?? "all",
      specialistId ?? "any",
    ] as const,
};

export function usePsychologists() {
  return useQuery({
    queryKey: psychologistKeys.specialists(),
    queryFn: () => psychologistService.listSpecialists(),
  });
}

export function usePsychologistSlots(specialistId: string, date?: string) {
  return useQuery({
    queryKey: psychologistKeys.slots(specialistId, date),
    queryFn: () => psychologistService.listSlots(specialistId, date),
    enabled: Boolean(specialistId),
  });
}

export function usePsychologistDates(specialistId: string) {
  return useQuery({
    queryKey: psychologistKeys.dates(specialistId),
    queryFn: () => psychologistService.listAvailableDates(specialistId),
    enabled: Boolean(specialistId),
  });
}

export function usePsychologistScheduleDates(specialistId: string) {
  return useQuery({
    queryKey: psychologistKeys.scheduleDates(specialistId),
    queryFn: () => psychologistService.listScheduleDates(specialistId),
    enabled: Boolean(specialistId),
  });
}

export function usePsychologistAppointments(
  date?: string,
  specialistId?: string,
) {
  return useQuery({
    queryKey: psychologistKeys.appointments(date, specialistId),
    queryFn: () => psychologistService.listAppointments(date, specialistId),
    enabled: Boolean(specialistId),
  });
}

export function useCreatePsychologistAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      input: Omit<
        PsychologistAppointment,
        "id" | "createdAt" | "status" | "department"
      >,
    ) => psychologistService.createAppointment(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: psychologistKeys.all });
      void qc.invalidateQueries({ queryKey: openSlotKeys.all });
    },
  });
}

export function useCancelPsychologistAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, phone }: { id: string; phone: string }) =>
      psychologistService.cancelAppointment(id, phone),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: psychologistKeys.all });
    },
  });
}

export function useSetPsychologistSlotClosed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, closed }: { slotId: string; closed: boolean }) =>
      psychologistService.setSlotClosed(slotId, closed),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: psychologistKeys.all });
      void qc.invalidateQueries({ queryKey: openSlotKeys.all });
    },
  });
}

export function useUpdatePsychologistAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      specialistId,
    }: {
      id: string;
      status: PsychologistAppointment["status"];
      specialistId?: string;
    }) => psychologistService.updateStatus(id, status, specialistId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: psychologistKeys.all });
      void qc.invalidateQueries({ queryKey: openSlotKeys.all });
    },
  });
}
