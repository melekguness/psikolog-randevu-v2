import { api } from "@/lib/api";
import type {
  Psychologist,
  PsychologistAppointment,
} from "@/types/psychologist";
import type { TimeSlot } from "@/types";

export const psychologistService = {
  async listSpecialists(): Promise<Psychologist[]> {
    return api<Psychologist[]>("/api/specialists/psychologist");
  },

  async getSpecialist(id: string): Promise<Psychologist | undefined> {
    const list = await this.listSpecialists();
    return list.find((d) => d.id === id);
  },

  async listSlots(specialistId: string, date?: string): Promise<TimeSlot[]> {
    const q = new URLSearchParams({
      department: "psychologist",
      specialistId,
    });
    if (date) q.set("date", date);
    return api<TimeSlot[]>(`/api/slots?${q}`);
  },

  async listAvailableDates(specialistId: string): Promise<string[]> {
    const q = new URLSearchParams({
      department: "psychologist",
      specialistId,
    });
    return api<string[]>(`/api/availability/dates?${q}`);
  },

  async listOpenSlots(date?: string): Promise<TimeSlot[]> {
    const q = new URLSearchParams({
      department: "psychologist",
      openOnly: "1",
    });
    if (date) q.set("date", date);
    return api<TimeSlot[]>(`/api/slots?${q}`);
  },

  async listOpenDates(): Promise<string[]> {
    return api<string[]>(
      "/api/availability/dates?department=psychologist",
    );
  },

  async listScheduleDates(specialistId: string): Promise<string[]> {
    const q = new URLSearchParams({
      department: "psychologist",
      specialistId,
      schedule: "1",
    });
    return api<string[]>(`/api/availability/dates?${q}`);
  },

  async setSlotClosed(
    slotId: string,
    closed: boolean,
  ): Promise<TimeSlot | undefined> {
    return api<TimeSlot>("/api/slots/block", {
      method: "POST",
      body: JSON.stringify({
        department: "psychologist",
        slotId,
        closed,
      }),
    });
  },

  async createAppointment(
    input: Omit<
      PsychologistAppointment,
      "id" | "createdAt" | "status" | "department"
    >,
  ): Promise<PsychologistAppointment> {
    return api<PsychologistAppointment>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({
        department: "psychologist",
        slotId: input.slotId,
        specialistName: input.specialistName,
        citizen: input.citizen,
        kvkkAccepted: input.kvkkAccepted,
        assessment: input.assessment,
        smsVerified: input.smsVerified,
      }),
    });
  },

  async getAppointmentById(
    id: string,
  ): Promise<PsychologistAppointment | undefined> {
    const list = await api<PsychologistAppointment[]>(
      `/api/appointments?department=psychologist`,
    );
    return list.find((a) => a.id === id);
  },

  async lookupAppointment(
    id: string,
    phone: string,
  ): Promise<PsychologistAppointment | undefined> {
    const list = await api<PsychologistAppointment[]>(
      `/api/appointments?department=psychologist&phone=${encodeURIComponent(phone)}`,
    );
    return list.find((a) => a.id === id);
  },

  async listAppointments(
    date?: string,
    specialistId?: string,
  ): Promise<PsychologistAppointment[]> {
    const q = new URLSearchParams({ department: "psychologist" });
    if (date) q.set("date", date);
    if (specialistId) q.set("specialistId", specialistId);
    return api<PsychologistAppointment[]>(`/api/appointments?${q}`);
  },

  async listAppointmentsForCitizen(
    phone: string,
  ): Promise<PsychologistAppointment[]> {
    return api<PsychologistAppointment[]>(
      `/api/appointments?department=psychologist&phone=${encodeURIComponent(phone)}`,
    );
  },

  async cancelAppointment(id: string, phone: string): Promise<boolean> {
    await api(
      `/api/appointments/${encodeURIComponent(id)}?phone=${encodeURIComponent(phone)}`,
      { method: "DELETE" },
    );
    return true;
  },

  async updateStatus(
    id: string,
    status: PsychologistAppointment["status"],
    specialistId?: string,
  ): Promise<PsychologistAppointment> {
    return api<PsychologistAppointment>(
      `/api/appointments/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, specialistId }),
      },
    );
  },

};
