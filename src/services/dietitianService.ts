import { api } from "@/lib/api";
import type { Dietitian, DietitianAppointment } from "@/types/dietitian";
import type { TimeSlot } from "@/types";

export const dietitianService = {
  async listSpecialists(): Promise<Dietitian[]> {
    return api<Dietitian[]>("/api/specialists/dietitian");
  },

  async getSpecialist(id: string): Promise<Dietitian | undefined> {
    const list = await this.listSpecialists();
    return list.find((d) => d.id === id);
  },

  async listSlots(specialistId: string, date?: string): Promise<TimeSlot[]> {
    const q = new URLSearchParams({
      department: "dietitian",
      specialistId,
    });
    if (date) q.set("date", date);
    return api<TimeSlot[]>(`/api/slots?${q}`);
  },

  async listAvailableDates(specialistId: string): Promise<string[]> {
    const q = new URLSearchParams({
      department: "dietitian",
      specialistId,
    });
    return api<string[]>(`/api/availability/dates?${q}`);
  },

  async listOpenSlots(date?: string): Promise<TimeSlot[]> {
    const q = new URLSearchParams({
      department: "dietitian",
      openOnly: "1",
    });
    if (date) q.set("date", date);
    return api<TimeSlot[]>(`/api/slots?${q}`);
  },

  async listOpenDates(): Promise<string[]> {
    return api<string[]>(
      "/api/availability/dates?department=dietitian",
    );
  },

  async listScheduleDates(specialistId: string): Promise<string[]> {
    const q = new URLSearchParams({
      department: "dietitian",
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
        department: "dietitian",
        slotId,
        closed,
      }),
    });
  },

  async createAppointment(
    input: Omit<
      DietitianAppointment,
      "id" | "createdAt" | "status" | "department"
    >,
  ): Promise<DietitianAppointment> {
    return api<DietitianAppointment>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({
        department: "dietitian",
        slotId: input.slotId,
        specialistName: input.specialistName,
        citizen: input.citizen,
        consentAccepted: input.consentAccepted,
        assessment: input.assessment,
        smsVerified: input.smsVerified,
      }),
    });
  },

  async getAppointmentById(
    id: string,
  ): Promise<DietitianAppointment | undefined> {
    const list = await api<DietitianAppointment[]>(
      `/api/appointments?department=dietitian`,
    );
    return list.find((a) => a.id === id);
  },

  async lookupAppointment(
    id: string,
    phone: string,
  ): Promise<DietitianAppointment | undefined> {
    const list = await api<DietitianAppointment[]>(
      `/api/appointments?department=dietitian&phone=${encodeURIComponent(phone)}`,
    );
    return list.find((a) => a.id === id);
  },

  async listAppointments(
    date?: string,
    specialistId?: string,
  ): Promise<DietitianAppointment[]> {
    const q = new URLSearchParams({ department: "dietitian" });
    if (date) q.set("date", date);
    if (specialistId) q.set("specialistId", specialistId);
    return api<DietitianAppointment[]>(`/api/appointments?${q}`);
  },

  async listAppointmentsForCitizen(
    phone: string,
  ): Promise<DietitianAppointment[]> {
    return api<DietitianAppointment[]>(
      `/api/appointments?department=dietitian&phone=${encodeURIComponent(phone)}`,
    );
  },

  async cancelAppointment(id: string, phone: string): Promise<boolean> {
    await api(`/api/appointments/${encodeURIComponent(id)}?phone=${encodeURIComponent(phone)}`, {
      method: "DELETE",
    });
    return true;
  },

  async updateStatus(
    id: string,
    status: DietitianAppointment["status"],
    specialistId?: string,
  ): Promise<DietitianAppointment> {
    return api<DietitianAppointment>(
      `/api/appointments/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, specialistId }),
      },
    );
  },

};
