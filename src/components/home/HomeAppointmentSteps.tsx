import {
  CalendarDays,
  CheckCircle2,
  Smartphone,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { HOME_PROCESS_STEPS } from "@/data/homeContent";
import { cn } from "@/lib/utils";

const STEP_ICONS: LucideIcon[] = [
  Stethoscope,
  CalendarDays,
  Smartphone,
  CheckCircle2,
];

/** User-journey steps — horizontal on desktop, stacked on mobile. */
export function HomeAppointmentSteps({
  className,
}: {
  className?: string;
} = {}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute top-[1.375rem] right-6 left-6 z-0 hidden h-px bg-[var(--color-border)] lg:block"
      />
      <ol
        className="relative z-10 grid list-none grid-cols-1 gap-3 overflow-visible p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
        aria-label="Randevu alma adımları"
      >
        {HOME_PROCESS_STEPS.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? CheckCircle2;
          const stepLabel = String(step.id).padStart(2, "0");

          return (
            <li key={step.id} className="min-w-0 overflow-visible">
              <article
                className={cn(
                  "flex h-full min-w-0 flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm",
                  "transition-shadow duration-200 ease-out hover:shadow-md",
                  "motion-reduce:transition-none",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] font-sans text-xs font-semibold tabular-nums tracking-wide text-white">
                    {stepLabel}
                  </span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
                  </span>
                </div>

                <h3 className="mt-4 font-sans text-[15px] font-semibold leading-snug tracking-tight text-[var(--color-navy)]">
                  {step.label}
                </h3>
                <p className="mt-1.5 text-sm leading-6 tracking-normal text-[var(--color-text-secondary)] [overflow-wrap:break-word]">
                  {step.short}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
