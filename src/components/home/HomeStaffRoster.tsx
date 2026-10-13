import { useMemo, useState } from "react";
import { StaffRosterGrid } from "@/components/staff/StaffRosterGrid";
import dietitianData from "@/data/dietitians.json";
import psychologistData from "@/data/psychologists.json";
import type { DepartmentId, SpecialistBase } from "@/types";
import {
  homeHeadingClass,
  homeLeadClass,
  homeSectionClass,
} from "@/components/home/homeUi";
import { cn } from "@/lib/utils";

type StaffMember = SpecialistBase & { department: DepartmentId };

function rosterMembers(): StaffMember[] {
  const dietitians: StaffMember[] = (
    dietitianData.specialists as SpecialistBase[]
  ).map((s) => ({ ...s, department: "dietitian" as const }));
  const psychologists: StaffMember[] = (
    psychologistData.specialists as SpecialistBase[]
  ).map((s) => ({ ...s, department: "psychologist" as const }));
  return [...dietitians, ...psychologists];
}

type FilterId = "all" | DepartmentId;

/** Uzman kadro listesi — `/uzmanlar` sayfasında kullanılır. */
export function HomeStaffRoster({
  showIntro = true,
  compact = false,
  pageTitle,
}: {
  showIntro?: boolean;
  compact?: boolean;
  /** When set (experts page), renders as the visible page H1 above filters. */
  pageTitle?: string;
} = {}) {
  const members = useMemo(() => rosterMembers(), []);
  const [filter, setFilter] = useState<FilterId>("all");

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "Tümü" },
    { id: "psychologist", label: "Psikolog" },
    { id: "dietitian", label: "Diyetisyen" },
  ];

  return (
    <section
      id="uzmanlar"
      className={cn(
        homeSectionClass,
        compact && "py-8 md:py-10",
      )}
      aria-labelledby="staff-heading"
    >
      {pageTitle ? (
        <header className="min-w-0">
          <h1
            id="staff-heading"
            className="font-sans text-[1.75rem] font-semibold leading-snug tracking-tight text-slate-900 sm:text-[2rem] md:text-[2.125rem] md:leading-tight"
          >
            {pageTitle}
          </h1>
        </header>
      ) : showIntro ? (
        <div className="min-w-0 max-w-2xl">
          <h2 id="staff-heading" className={homeHeadingClass}>
            Uzman Kadromuz
          </h2>
          <p className={homeLeadClass}>
            Diyetisyen ve klinik psikolog kadromuzla ücretsiz danışmanlık
            randevusu oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <h2 id="staff-heading" className="sr-only">
          Uzman kadro listesi
        </h2>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-2",
          pageTitle || showIntro ? "mt-5 md:mt-6" : "mt-0",
        )}
        role="group"
        aria-label="Uzmanlık filtresi"
      >
        {filters.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-10 min-w-[5.5rem] items-center justify-center rounded-xl px-4 text-sm font-semibold tracking-normal transition-colors duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2",
                active
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--surface-muted)]",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 md:mt-7">
        {filter === "all" ? (
          <div className="space-y-8 md:space-y-9">
            <div className="min-w-0 space-y-3.5">
              <h3 className="border-b border-[var(--color-border)] pb-2.5 font-sans text-[15px] font-semibold tracking-normal text-[var(--color-navy)] md:text-base">
                Psikologlar
              </h3>
              <StaffRosterGrid members={members} department="psychologist" />
            </div>
            <div className="min-w-0 space-y-3.5">
              <h3 className="border-b border-[var(--color-border)] pb-2.5 font-sans text-[15px] font-semibold tracking-normal text-[var(--color-navy)] md:text-base">
                Diyetisyenler
              </h3>
              <StaffRosterGrid members={members} department="dietitian" />
            </div>
          </div>
        ) : (
          <StaffRosterGrid members={members} department={filter} />
        )}
      </div>
    </section>
  );
}
