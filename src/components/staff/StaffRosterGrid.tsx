
import { Link } from "@/components/ui/AppLink";
import { SpecialistAvatar } from "@/components/brand/SpecialistAvatar";
import { availabilityLabel } from "@/components/ui/Badge";
import { STAFF_DEPARTMENT_BADGE } from "@/lib/specialistAvatars";
import type { AvailabilityStatus, DepartmentId, SpecialistBase } from "@/types";
import { bookingHref } from "@/data/municipality";
import { cn } from "@/lib/utils";

type StaffMember = SpecialistBase & { department: DepartmentId };

const AVAILABILITY_DOT: Record<AvailabilityStatus, string> = {
  available: "bg-[#4A6B5D]",
  limited: "bg-amber-400",
  full: "bg-slate-400",
  leave: "bg-slate-400",
};

export function StaffRosterGrid({
  members,
  department,
}: {
  members: StaffMember[];
  department?: DepartmentId;
}) {
  const filtered = department
    ? members.filter((m) => m.department === department && m.active)
    : members.filter((m) => m.active);

  if (filtered.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--surface-muted)]/80 px-5 py-8 text-center"
        role="status"
      >
        <p className="text-sm font-medium text-[var(--color-navy)]">
          Şu anda görüntülenecek uzman bulunmuyor.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Lütfen daha sonra tekrar deneyin veya diğer birimi seçin.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((member) => {
        const href = bookingHref(member.department);
        const available = member.availability === "available";
        const diet = member.department === "dietitian";

        return (
          <li key={member.id} className="min-w-0">
            <article
              className={cn(
                "group flex h-full min-w-0 flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm",
                "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md",
                "motion-reduce:transform-none motion-reduce:transition-none",
              )}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <SpecialistAvatar
                    specialistId={member.id}
                    fullName={member.fullName}
                    photoUrl={member.photoUrl}
                    department={member.department}
                    size="lg"
                    showDeptMark
                    title={`${member.fullName} doktor illüstrasyonu`}
                    className="transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                  />
                  <span
                    className={cn(
                      "absolute top-1 right-2 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-surface)] shadow-sm",
                      AVAILABILITY_DOT[member.availability],
                      available && "ring-2 ring-[#4A6B5D]/25",
                    )}
                    title={availabilityLabel(member.availability)}
                    aria-hidden
                  />
                </div>

                <p
                  className={cn(
                    "mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
                    diet
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[var(--psychology-soft)] text-[var(--psychology)]",
                  )}
                >
                  {STAFF_DEPARTMENT_BADGE[member.department]}
                </p>

                <h3 className="mt-3 text-base font-semibold leading-snug break-words text-[var(--atakum-ink)] hyphens-auto sm:text-lg">
                  {member.fullName}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--atakum-muted)]">
                  {member.title}
                </p>

                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--atakum-muted)]">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      AVAILABILITY_DOT[member.availability],
                    )}
                    aria-hidden
                  />
                  <span>
                    {available
                      ? "Müsait"
                      : availabilityLabel(member.availability)}
                  </span>
                </p>
              </div>

              <p className="mt-4 hidden text-sm leading-relaxed text-[var(--atakum-muted)] sm:block">
                {member.bio}
              </p>

              <div className="mt-4 hidden flex-wrap justify-center gap-1.5 sm:flex">
                {member.specialties.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      diet
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "bg-[var(--psychology-soft)] text-[var(--psychology)]",
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {(member.experienceYears || member.workingDays?.length) && (
                <div className="mt-3 space-y-1 text-center text-xs font-medium leading-relaxed text-[var(--atakum-muted)]">
                  {member.experienceYears ? (
                    <p>{member.experienceYears} yıl deneyim</p>
                  ) : null}
                  {member.workingDays?.length ? (
                    <p className="hidden sm:block">
                      {member.workingDays.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}

              <div className="mt-auto pt-6">
                <Link
                  href={href}
                  aria-label={`${member.fullName} için randevu al`}
                  className={cn(
                    "inline-flex h-11 min-h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-sm",
                    "transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    diet
                      ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]/40"
                      : "bg-slate-900 hover:bg-slate-950 focus-visible:ring-slate-400",
                  )}
                >
                  Randevu Al
                </Link>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
