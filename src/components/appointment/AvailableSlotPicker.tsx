import type { ReactNode } from "react";
import { Check } from "lucide-react";
import {
  formatTurkishDateMedium,
  formatTurkishDateShort,
  cn,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { SpecialistAvatar } from "@/components/brand/SpecialistAvatar";
import type { DepartmentId, SpecialistBase, TimeSlot } from "@/types";

const chipFocus =
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-1";

const chipTransition =
  "transition-colors duration-200 ease-out motion-reduce:transition-none";

function DateSkeletonRow() {
  return (
    <div className="flex gap-2.5 overflow-hidden" aria-hidden>
      <Skeleton className="h-12 w-28 shrink-0 rounded-xl" />
      <Skeleton className="h-12 w-28 shrink-0 rounded-xl" />
      <Skeleton className="h-12 w-24 shrink-0 rounded-xl" />
    </div>
  );
}

function TimeSkeletonGrid() {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/80 p-4">
      <Skeleton className="h-4 w-40 rounded-md" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)]/80 px-3.5 py-4 text-sm leading-relaxed text-[var(--color-text-secondary)]"
      role="status"
    >
      <p>{children}</p>
      {action}
    </div>
  );
}

export function AvailableSlotPicker({
  dates,
  slots,
  specialists,
  department,
  selectedDate,
  selectedSlotId,
  onSelectDate,
  onSelectSlot,
  loading,
  error,
}: {
  dates: string[];
  slots: TimeSlot[];
  specialists: Pick<SpecialistBase, "id" | "fullName">[];
  department: DepartmentId;
  selectedDate: string;
  selectedSlotId: string | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
  loading?: boolean;
  error?: string;
}) {
  const nameById = new Map(specialists.map((s) => [s.id, s.fullName]));
  const isPsych = department === "psychologist";
  const selectedChip = isPsych
    ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-white shadow-[0_4px_12px_-6px_rgba(22,37,54,0.55)]"
    : "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_4px_12px_-6px_rgba(74,107,93,0.55)]";
  const idleChip =
    "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]/45 hover:bg-[var(--accent-soft)]";
  const accentLabel = isPsych
    ? "text-[var(--color-navy)]"
    : "text-[var(--color-primary)]";

  const grouped = specialists
    .map((specialist) => ({
      specialist,
      slots: slots
        .filter((s) => s.specialistId === specialist.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime, "tr")),
    }))
    .filter((g) => g.slots.length > 0);

  return (
    <div
      className={cn(
        "min-w-0 space-y-4",
        error && "rounded-2xl border border-[#C43D3D]/35 p-3",
      )}
    >
      <div className="space-y-1.5">
        <p className="text-sm font-semibold tracking-tight text-[var(--color-navy)]">
          Müsait randevu saatleri
          <span className="text-[#C43D3D]"> *</span>
        </p>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          Önce günü, ardından uygun saati seçiniz.
        </p>
      </div>

      {loading && dates.length === 0 ? (
        <div
          className="space-y-3.5"
          role="status"
          aria-busy="true"
          aria-label="Müsait saatler yükleniyor"
        >
          <DateSkeletonRow />
          <TimeSkeletonGrid />
        </div>
      ) : dates.length > 0 ? (
        <div className="space-y-2">
          <p
            className={cn(
              "text-[11px] font-semibold tracking-[0.12em] uppercase",
              accentLabel,
            )}
          >
            Tarih
          </p>
          <div
            className="scroll-x flex max-w-full gap-2.5 pb-0.5"
            role="listbox"
            aria-label="Müsait tarihler"
          >
            {dates.map((date) => {
              const selected = selectedDate === date;
              return (
                <button
                  key={date}
                  type="button"
                  role="option"
                  onClick={() => onSelectDate(date)}
                  aria-label={`${formatTurkishDateMedium(date)} tarihini seç`}
                  aria-selected={selected}
                  className={cn(
                    "inline-flex h-12 min-h-12 shrink-0 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold tabular-nums",
                    chipTransition,
                    chipFocus,
                    selected ? selectedChip : idleChip,
                  )}
                >
                  {selected ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : null}
                  {formatTurkishDateShort(date)}
                </button>
              );
            })}
          </div>
          {selectedDate ? (
            <p
              className="text-sm font-semibold text-[var(--color-navy)]"
              aria-live="polite"
            >
              {formatTurkishDateMedium(selectedDate)}
            </p>
          ) : null}
        </div>
      ) : (
        <EmptyState>Bu birim için şu an müsait saat bulunmuyor.</EmptyState>
      )}

      {selectedDate && loading && dates.length > 0 ? (
        <div
          role="status"
          aria-busy="true"
          aria-label="Müsait saatler yükleniyor"
        >
          <TimeSkeletonGrid />
        </div>
      ) : null}

      {selectedDate && !loading && grouped.length === 0 ? (
        <EmptyState>
          Bu tarihte uygun randevu bulunmuyor. Başka bir tarih seçiniz.
        </EmptyState>
      ) : null}

      {!loading ? (
        <div key={selectedDate || "slots"} className="animate-fade-in space-y-4">
          {grouped.map(({ specialist, slots: openSlots }) => (
            <div
              key={specialist.id}
              className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
            >
              <div className="flex items-center gap-3">
                <SpecialistAvatar
                  specialistId={specialist.id}
                  department={department}
                  size="sm"
                  title={`${specialist.fullName} uzman simgesi`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight text-[var(--color-text)]">
                    {nameById.get(specialist.id) ?? specialist.fullName}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[11px] font-semibold tracking-[0.12em] uppercase",
                      accentLabel,
                    )}
                  >
                    Uygun saatler
                  </p>
                </div>
              </div>
              <div
                className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
                role="group"
                aria-label={`${specialist.fullName} müsait saatleri`}
              >
                {openSlots.map((slot) => {
                  const selected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => onSelectSlot(slot)}
                      aria-label={`${nameById.get(specialist.id) ?? specialist.fullName} ${slot.startTime} saatini seç`}
                      aria-pressed={selected}
                      className={cn(
                        "inline-flex h-11 min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border px-3 text-[15px] font-semibold tabular-nums tracking-tight",
                        chipTransition,
                        chipFocus,
                        selected ? selectedChip : idleChip,
                      )}
                    >
                      {selected ? (
                        <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      ) : null}
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="text-sm font-medium text-[#C43D3D]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
