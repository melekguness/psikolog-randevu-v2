import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const APPOINTMENT_STEPS = [
  { id: "service", label: "Hizmet" },
  { id: "schedule", label: "Tarih & Saat" },
  { id: "personal", label: "Bilgiler" },
  { id: "verify", label: "Doğrulama" },
  { id: "review", label: "Onay" },
] as const;

export type AppointmentStepId = (typeof APPOINTMENT_STEPS)[number]["id"];

export function AppointmentProgress({
  current,
}: {
  current: AppointmentStepId;
}) {
  const currentIndex = APPOINTMENT_STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Randevu adımları" className="w-full">
      {/* Mobile compact */}
      <p className="text-sm font-medium text-slate-600 lg:hidden" aria-live="polite">
        <span className="tabular-nums text-[var(--accent)]">
          {currentIndex + 1} / {APPOINTMENT_STEPS.length}
        </span>
        <span className="mx-2 text-slate-300" aria-hidden>
          ·
        </span>
        {APPOINTMENT_STEPS[currentIndex]?.label}
      </p>

      {/* Desktop stepper */}
      <ol className="hidden list-none gap-2 p-0 lg:flex lg:items-center lg:justify-between">
        {APPOINTMENT_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 items-center gap-2"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                  done && "bg-[var(--accent)] text-white",
                  active && "bg-[var(--accent-soft)] text-[var(--accent)] ring-2 ring-[var(--accent)]/30",
                  !done && !active && "bg-slate-100 text-slate-400",
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "truncate text-sm",
                  active ? "font-semibold text-[#162536]" : "font-medium text-slate-500",
                  done && "text-[var(--accent)]",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
