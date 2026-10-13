import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/lib/router";
import { CalendarDays, ClipboardList, LogOut } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { SpecialistAvatar } from "@/components/brand/SpecialistAvatar";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { SkeletonLines } from "@/components/ui/Skeleton";
import {
  PanelCard,
  PanelNotice,
  PanelShell,
  PanelStat,
} from "@/components/panel/PanelChrome";
import {
  useDietitianAppointments,
  useDietitianScheduleDates,
  useDietitianSlots,
  useSetDietitianSlotClosed,
  useUpdateDietitianAppointmentStatus,
} from "@/hooks/useDietitians";
import {
  usePsychologistAppointments,
  usePsychologistScheduleDates,
  usePsychologistSlots,
  useSetPsychologistSlotClosed,
  useUpdatePsychologistAppointmentStatus,
} from "@/hooks/usePsychologists";
import { formatTurkishDate, cn, todayISO } from "@/lib/utils";
import { obscureTrMobile } from "@/lib/phone";
import { ApiError } from "@/lib/api";
import { APP_ROUTES } from "@/data/municipality";
import {
  DEPARTMENT_LABELS,
  type AppointmentBase,
  type AppointmentStatus,
} from "@/types";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  completed: "Tamamlandı",
  cancelled: "İptal edildi",
  no_show: "Gelmedi",
};

const STATUS_OPTIONS: AppointmentStatus[] = [
  "confirmed",
  "pending",
  "completed",
  "cancelled",
];

const STATUS_PILL: Record<AppointmentStatus, string> = {
  pending: "bg-amber-600 text-white",
  confirmed: "bg-[var(--atakum-ink)] text-white",
  completed: "bg-emerald-600 text-white",
  cancelled: "bg-rose-600 text-white",
  no_show: "bg-slate-600 text-white",
};

type ApptView = "overview" | "today" | "upcoming" | "completed" | "cancelled";

function isOpenStatus(status: AppointmentStatus) {
  return status === "pending" || status === "confirmed";
}

function sortByDateAsc(a: AppointmentBase, b: AppointmentBase) {
  return `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`);
}

function sortByDateDesc(a: AppointmentBase, b: AppointmentBase) {
  return `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`);
}

export function DoctorSchedulePanel() {
  const router = useRouter();
  const { toast } = useToast();
  const { ready, doctor, logoutDoctor } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [apptView, setApptView] = useState<ApptView>("overview");

  const isDiet = doctor?.department === "dietitian";
  const specialistId = doctor?.specialistId ?? "";
  const today = todayISO();

  const dietAppts = useDietitianAppointments(
    undefined,
    isDiet ? specialistId : "",
  );
  const psychAppts = usePsychologistAppointments(
    undefined,
    !isDiet ? specialistId : "",
  );
  const appointments = useMemo(
    () => (isDiet ? (dietAppts.data ?? []) : (psychAppts.data ?? [])),
    [isDiet, dietAppts.data, psychAppts.data],
  );
  const apptsLoading = isDiet ? dietAppts.isLoading : psychAppts.isLoading;

  const dietDates = useDietitianScheduleDates(isDiet ? specialistId : "");
  const psychDates = usePsychologistScheduleDates(
    !isDiet && specialistId ? specialistId : "",
  );
  const dates = useMemo(
    () => (isDiet ? (dietDates.data ?? []) : (psychDates.data ?? [])),
    [isDiet, dietDates.data, psychDates.data],
  );
  const effectiveDate =
    selectedDate && dates.includes(selectedDate)
      ? selectedDate
      : (dates[0] ?? "");

  const dietSlots = useDietitianSlots(
    isDiet ? specialistId : "",
    effectiveDate || undefined,
  );
  const psychSlots = usePsychologistSlots(
    !isDiet && specialistId ? specialistId : "",
    effectiveDate || undefined,
  );
  const slots = useMemo(
    () => (isDiet ? (dietSlots.data ?? []) : (psychSlots.data ?? [])),
    [isDiet, dietSlots.data, psychSlots.data],
  );
  const slotsLoading = isDiet ? dietSlots.isLoading : psychSlots.isLoading;

  const setDietClosed = useSetDietitianSlotClosed();
  const setPsychClosed = useSetPsychologistSlotClosed();
  const updateDiet = useUpdateDietitianAppointmentStatus();
  const updatePsych = useUpdatePsychologistAppointmentStatus();
  const toggling = setDietClosed.isPending || setPsychClosed.isPending;
  const updating = updateDiet.isPending || updatePsych.isPending;

  useEffect(() => {
    if (ready && !doctor) router.replace(APP_ROUTES.doctor);
  }, [ready, doctor, router]);

  const daySlots = useMemo(
    () =>
      slots
        .filter((s) => s.date === effectiveDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [slots, effectiveDate],
  );

  const daySlotStats = useMemo(() => {
    const open = daySlots.filter((s) => !s.isBooked && !s.isClosed).length;
    const closed = daySlots.filter((s) => !s.isBooked && s.isClosed).length;
    const booked = daySlots.filter((s) => s.isBooked).length;
    return { open, closed, booked };
  }, [daySlots]);

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [appointments, today],
  );

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date > today && isOpenStatus(a.status))
        .sort(sortByDateAsc),
    [appointments, today],
  );

  const completedAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "completed")
        .sort(sortByDateDesc),
    [appointments],
  );

  const cancelledAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "cancelled")
        .sort(sortByDateDesc),
    [appointments],
  );

  const historyAppointments = useMemo(
    () =>
      appointments
        .filter(
          (a) =>
            a.date < today ||
            (a.date > today && !isOpenStatus(a.status)),
        )
        .sort(sortByDateDesc)
        .slice(0, 20),
    [appointments, today],
  );

  const stats = useMemo(
    () => ({
      today: todayAppointments.length,
      upcoming: upcomingAppointments.length,
      completed: completedAppointments.length,
      cancelled: cancelledAppointments.length,
    }),
    [
      todayAppointments.length,
      upcomingAppointments.length,
      completedAppointments.length,
      cancelledAppointments.length,
    ],
  );

  if (!ready || !doctor) {
    return (
      <p className="text-sm text-[var(--atakum-muted)]">
        Oturum doğrulanıyor…
      </p>
    );
  }

  const toggle = async (slotId: string, closed: boolean) => {
    try {
      if (isDiet) {
        await setDietClosed.mutateAsync({ slotId, closed });
      } else {
        await setPsychClosed.mutateAsync({ slotId, closed });
      }
      toast(closed ? "Saat dilimi kapatıldı." : "Saat dilimi açıldı.", "success");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "İşlem tamamlanamadı.", "error");
    }
  };

  const setStatus = async (apt: AppointmentBase, status: AppointmentStatus) => {
    try {
      if (apt.department === "dietitian") {
        await updateDiet.mutateAsync({
          id: apt.id,
          status,
          specialistId: doctor.specialistId,
        });
      } else {
        await updatePsych.mutateAsync({
          id: apt.id,
          status,
          specialistId: doctor.specialistId,
        });
      }
      toast("Randevu durumu güncellendi.", "success");
    } catch (e) {
      toast(
        e instanceof ApiError ? e.message : "Durum güncellenemedi.",
        "error",
      );
    }
  };

  const selectView = (view: ApptView) => {
    setApptView((prev) => (prev === view && view !== "overview" ? "overview" : view));
  };

  return (
    <PanelShell
      badge="Uzman"
      title="Uzman paneli"
      subtitle={
        <span className="block space-y-1.5">
          <span className="block font-medium text-[var(--atakum-ink)]">
            {doctor.fullName}
          </span>
          <span className="block text-xs leading-relaxed">
            {doctor.title || DEPARTMENT_LABELS[doctor.department]}
          </span>
        </span>
      }
      breadcrumbs={[
        { label: "Giriş", href: APP_ROUTES.doctor },
        { label: "Panel" },
      ]}
      actions={
        <button
          type="button"
          onClick={() => {
            logoutDoctor();
            router.push(APP_ROUTES.doctor);
          }}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--atakum-ink)] hover:bg-[var(--hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Oturumu kapat
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm sm:px-5">
        <SpecialistAvatar
          specialistId={doctor.specialistId}
          department={doctor.department}
          size="lg"
          title={`${doctor.fullName} uzman simgesi`}
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--atakum-muted)]">
            Oturum
            <span className="mx-1.5 font-normal text-[var(--atakum-muted)]/60" aria-hidden>
              ·
            </span>
            {DEPARTMENT_LABELS[doctor.department]}
          </p>
          <p className="text-base font-bold leading-snug text-[var(--atakum-ink)]">
            {doctor.fullName}
          </p>
          <p className="text-sm leading-relaxed text-[var(--atakum-muted)]">
            Size atanmış randevular ve çalışma saatleri
          </p>
        </div>
      </div>

      <Tabs.Root value={tab} onValueChange={setTab} className="space-y-4">
        <Tabs.List className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-1.5">
          <Tabs.Trigger
            value="dashboard"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--atakum-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] data-[state=active]:bg-[var(--atakum-ink)] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
            Randevular
          </Tabs.Trigger>
          <Tabs.Trigger
            value="availability"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--atakum-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] data-[state=active]:bg-[var(--atakum-ink)] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            Müsaitlik
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="dashboard" className="space-y-4 outline-none">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PanelStat
              label="Bugün"
              value={stats.today}
              tone="info"
              active={apptView === "today"}
              onClick={() => selectView("today")}
            />
            <PanelStat
              label="Yaklaşan"
              value={stats.upcoming}
              active={apptView === "upcoming"}
              onClick={() => selectView("upcoming")}
            />
            <PanelStat
              label="Tamamlanan"
              value={stats.completed}
              tone="success"
              active={apptView === "completed"}
              onClick={() => selectView("completed")}
            />
            <PanelStat
              label="İptal"
              value={stats.cancelled}
              tone="warning"
              active={apptView === "cancelled"}
              onClick={() => selectView("cancelled")}
            />
          </div>

          {apptView !== "overview" ? (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-xs font-medium text-[var(--atakum-muted)] hover:text-[var(--atakum-ink)]"
                onClick={() => setApptView("overview")}
              >
                Özete dön
              </Button>
            </div>
          ) : null}

          {apptsLoading ? (
            <SkeletonLines count={5} />
          ) : apptView === "overview" ? (
            <>
              <AppointmentSection
                title="Bugünkü randevular"
                description={formatTurkishDate(today)}
                appointments={todayAppointments}
                empty="Bugün için kayıtlı randevu bulunmamaktadır."
                showDate={false}
                updating={updating}
                onStatus={setStatus}
              />
              <AppointmentSection
                title="Yaklaşan randevular"
                description={`${upcomingAppointments.length} kayıt, en yakından uzağa`}
                appointments={upcomingAppointments}
                empty="Yaklaşan randevunuz bulunmamaktadır."
                showDate
                updating={updating}
                onStatus={setStatus}
              />
              {historyAppointments.length > 0 ? (
                <AppointmentSection
                  title="Geçmiş kayıtlar"
                  description="Tamamlanan, iptal edilen ve geçmiş tarihli kayıtlar"
                  appointments={historyAppointments}
                  empty=""
                  showDate
                  updating={updating}
                  onStatus={setStatus}
                  compact
                />
              ) : null}
            </>
          ) : apptView === "today" ? (
            <AppointmentSection
              title="Bugünkü randevular"
              description={formatTurkishDate(today)}
              appointments={todayAppointments}
              empty="Bugün için kayıtlı randevu bulunmamaktadır."
              showDate={false}
              updating={updating}
              onStatus={setStatus}
            />
          ) : apptView === "upcoming" ? (
            <AppointmentSection
              title="Yaklaşan randevular"
              description="Aktif (beklemede / onaylı) kayıtlar"
              appointments={upcomingAppointments}
              empty="Yaklaşan randevu bulunmamaktadır. Vatandaş randevu oluşturduğunda burada listelenir."
              showDate
              updating={updating}
              onStatus={setStatus}
            />
          ) : apptView === "completed" ? (
            <AppointmentSection
              title="Tamamlanan randevular"
              description="Durumu tamamlandı olarak işaretlenen kayıtlar"
              appointments={completedAppointments}
              empty="Tamamlanan randevu bulunmamaktadır."
              showDate
              updating={updating}
              onStatus={setStatus}
            />
          ) : (
            <AppointmentSection
              title="İptal edilen randevular"
              description="İptal edilmiş kayıtlar"
              appointments={cancelledAppointments}
              empty="İptal edilen randevu bulunmamaktadır."
              showDate
              updating={updating}
              onStatus={setStatus}
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="availability" className="space-y-4 outline-none">
          <div className="grid gap-3 sm:grid-cols-3">
            <PanelStat label="Müsait" value={daySlotStats.open} tone="success" />
            <PanelStat label="Dolu" value={daySlotStats.booked} tone="info" />
            <PanelStat
              label="Kapalı"
              value={daySlotStats.closed}
              tone="warning"
            />
          </div>

          <PanelCard
            title="Çalışma takvimi"
            description="Tarih seçerek saat dilimlerini kapatabilir veya açabilirsiniz."
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--atakum-ink)]">
                <CalendarDays
                  className="h-4 w-4 text-[var(--accent)]"
                  aria-hidden
                />
                Çalışma günleri
              </p>
              <div className="flex flex-wrap gap-1.5">
                <SlotBadge booked={false} closed={false} />
                <SlotBadge booked closed={false} />
                <SlotBadge booked={false} closed />
              </div>
            </div>
            {dates.length === 0 ? (
              <PanelNotice tone="warning">
                Tanımlı çalışma günü bulunamadı.
              </PanelNotice>
            ) : (
              <div className="scroll-x flex gap-2 pb-1">
                {dates.map((date) => {
                  const d = new Date(`${date}T12:00:00`);
                  const weekday = d.toLocaleDateString("tr-TR", {
                    weekday: "short",
                  });
                  const day = d.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                  });
                  const active = date === effectiveDate;
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      aria-label={`${formatTurkishDate(date)} tarihini seç`}
                      aria-pressed={active}
                      className={cn(
                        "flex h-[4.25rem] w-[4.75rem] shrink-0 flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                        active
                          ? "border-[var(--atakum-ink)] bg-[var(--atakum-ink)] text-white"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--atakum-ink)] hover:bg-[var(--hover)]",
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.08em]",
                          active ? "text-white/80" : "text-[var(--atakum-muted)]",
                        )}
                      >
                        {weekday}
                      </span>
                      <span className="mt-0.5 text-sm font-bold leading-none">{day}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </PanelCard>

          {effectiveDate ? (
            <PanelCard
              title="Saat dilimleri"
              description={formatTurkishDate(effectiveDate)}
            >
              {slotsLoading ? (
                <SkeletonLines count={5} />
              ) : daySlots.length === 0 ? (
                <PanelNotice tone="warning">
                  Bu gün için tanımlı randevu saati bulunmamaktadır.
                </PanelNotice>
              ) : (
                <>
                  <ul className="space-y-2.5 lg:hidden">
                    {daySlots.map((slot) => (
                      <li
                        key={slot.id}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold tabular-nums text-[var(--atakum-ink)]">
                            {slot.startTime} – {slot.endTime}
                          </p>
                          <SlotBadge
                            booked={slot.isBooked}
                            closed={Boolean(slot.isClosed)}
                          />
                        </div>
                        <div className="mt-3">
                          {slot.isBooked ? (
                            <p className="text-xs font-medium text-[var(--atakum-muted)]">
                              Randevu nedeniyle dolu; açılamaz
                            </p>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={toggling}
                              className="h-9 min-w-[4.5rem]"
                              onClick={() =>
                                void toggle(slot.id, !slot.isClosed)
                              }
                            >
                              {slot.isClosed ? "Aç" : "Kapat"}
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="hidden min-w-0 overflow-x-auto rounded-xl border border-[var(--border)] lg:block">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-[var(--atakum-ink)] text-white">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Saat aralığı
                          </th>
                          <th className="px-4 py-3 font-semibold">Durum</th>
                          <th className="px-4 py-3 font-semibold">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daySlots.map((slot, i) => (
                          <tr
                            key={slot.id}
                            className={cn(
                              "border-t border-[var(--border)]",
                              i % 2 === 0
                                ? "bg-[var(--surface)]"
                                : "bg-[var(--surface-muted)]",
                            )}
                          >
                            <td className="whitespace-nowrap px-4 py-3.5 font-bold tabular-nums text-[var(--atakum-ink)]">
                              {slot.startTime} – {slot.endTime}
                            </td>
                            <td className="px-4 py-3.5">
                              <SlotBadge
                                booked={slot.isBooked}
                                closed={Boolean(slot.isClosed)}
                              />
                            </td>
                            <td className="px-4 py-3.5">
                              {slot.isBooked ? (
                                <span className="text-xs font-medium text-[var(--atakum-muted)]">
                                  Randevu nedeniyle dolu
                                </span>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  disabled={toggling}
                                  className="h-9 min-w-[4.5rem]"
                                  onClick={() =>
                                    void toggle(slot.id, !slot.isClosed)
                                  }
                                >
                                  {slot.isClosed ? "Aç" : "Kapat"}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </PanelCard>
          ) : null}
        </Tabs.Content>
      </Tabs.Root>
    </PanelShell>
  );
}

function AppointmentSection({
  title,
  description,
  appointments,
  empty,
  showDate,
  updating,
  onStatus,
  compact = false,
}: {
  title: string;
  description: string;
  appointments: AppointmentBase[];
  empty: string;
  showDate: boolean;
  updating: boolean;
  onStatus: (apt: AppointmentBase, status: AppointmentStatus) => void;
  compact?: boolean;
}) {
  return (
    <PanelCard title={title} description={description}>
      {appointments.length === 0 ? (
        empty ? <PanelNotice>{empty}</PanelNotice> : null
      ) : compact ? (
        <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-3 bg-[var(--surface)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs font-bold text-[var(--accent)]">
                    {a.code ?? a.id}
                  </p>
                  <StatusPill status={a.status} />
                </div>
                <p className="text-sm font-semibold leading-snug text-[var(--atakum-ink)]">
                  {a.citizen.fullName}
                </p>
                <div className="space-y-1 text-xs leading-relaxed text-[var(--atakum-muted)]">
                  <p>
                    {formatTurkishDate(a.date)}
                    <span className="mx-1.5 text-[var(--atakum-muted)]/50" aria-hidden>
                      ·
                    </span>
                    {a.startTime} – {a.endTime}
                  </p>
                  <p className="tabular-nums">
                    {obscureTrMobile(a.citizen.phone)}
                  </p>
                </div>
              </div>
              <StatusSelect
                value={a.status}
                disabled={updating}
                onChange={(s) => onStatus(a, s)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul className="space-y-3 lg:hidden">
            {appointments.map((a) => (
              <AppointmentCard
                key={a.id}
                apt={a}
                showDate={showDate}
                disabled={updating}
                onStatus={(s) => onStatus(a, s)}
              />
            ))}
          </ul>
          <div className="hidden min-w-0 overflow-x-auto rounded-xl border border-[var(--border)] lg:block">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[var(--atakum-ink)] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Randevu no</th>
                  <th className="px-4 py-3 font-semibold">Vatandaş</th>
                  <th className="px-4 py-3 font-semibold">Telefon</th>
                  {showDate ? (
                    <th className="px-4 py-3 font-semibold">Tarih</th>
                  ) : null}
                  <th className="px-4 py-3 font-semibold">Saat</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr
                    key={a.id}
                    className={cn(
                      "border-t border-[var(--border)]",
                      i % 2 === 0
                        ? "bg-[var(--surface)]"
                        : "bg-[var(--surface-muted)]",
                    )}
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-bold text-[var(--accent)]">
                      {a.code ?? a.id}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[var(--atakum-ink)]">
                      {a.citizen.fullName}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-[var(--atakum-muted)]">
                      {obscureTrMobile(a.citizen.phone)}
                    </td>
                    {showDate ? (
                      <td className="whitespace-nowrap px-4 py-3.5 text-[var(--atakum-ink)]">
                        {formatTurkishDate(a.date)}
                      </td>
                    ) : null}
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold tabular-nums text-[var(--atakum-ink)]">
                      {a.startTime} – {a.endTime}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-2">
                        <StatusPill status={a.status} />
                        <StatusSelect
                          value={a.status}
                          disabled={updating}
                          onChange={(s) => onStatus(a, s)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PanelCard>
  );
}

function SlotBadge({ booked, closed }: { booked: boolean; closed: boolean }) {
  if (booked) {
    return (
      <span className="inline-flex rounded-md bg-sky-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white">
        Dolu
      </span>
    );
  }
  if (closed) {
    return (
      <span className="inline-flex rounded-md bg-amber-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white">
        Kapalı
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white">
      Müsait
    </span>
  );
}

function StatusPill({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-bold tracking-wide",
        STATUS_PILL[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: AppointmentStatus;
  disabled?: boolean;
  onChange: (s: AppointmentStatus) => void;
}) {
  return (
    <label className="block min-w-[9.5rem]">
      <span className="sr-only">Randevu durumunu değiştir</span>
      <select
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-semibold text-[var(--atakum-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        value={value}
        disabled={disabled}
        aria-label="Randevu durumu"
        onChange={(e) => onChange(e.target.value as AppointmentStatus)}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </label>
  );
}

function AppointmentCard({
  apt,
  showDate = false,
  disabled,
  onStatus,
}: {
  apt: AppointmentBase;
  showDate?: boolean;
  disabled?: boolean;
  onStatus: (s: AppointmentStatus) => void;
}) {
  return (
    <li className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-mono text-xs font-bold text-[var(--accent)]">
          {apt.code ?? apt.id}
        </p>
        <StatusPill status={apt.status} />
      </div>
      <p className="mt-2.5 text-sm font-bold leading-snug text-[var(--atakum-ink)]">
        {apt.citizen.fullName}
      </p>
      <div className="mt-1.5 space-y-1 text-xs leading-relaxed text-[var(--atakum-muted)]">
        {showDate ? <p>{formatTurkishDate(apt.date)}</p> : null}
        <p>
          {apt.startTime} – {apt.endTime}
        </p>
        <p className="tabular-nums">
          {obscureTrMobile(apt.citizen.phone)}
        </p>
      </div>
      <div className="mt-3.5">
        <StatusSelect
          value={apt.status}
          disabled={disabled}
          onChange={onStatus}
        />
      </div>
    </li>
  );
}
