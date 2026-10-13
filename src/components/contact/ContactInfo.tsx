import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { municipality } from "@/data/municipality";
import { cn } from "@/lib/utils";

const iconWell =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)]";

const labelClass =
  "text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]";

const valueClass =
  "mt-1.5 text-base font-medium leading-normal text-[var(--color-text)] [overflow-wrap:anywhere]";

function ContactInfoItem({
  icon,
  label,
  children,
  href,
  ariaLabel,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  href?: string;
  ariaLabel?: string;
}) {
  const body = (
    <>
      <span className={iconWell}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={labelClass}>{label}</p>
        <div className={valueClass}>{children}</div>
      </div>
    </>
  );

  const rowClass = cn(
    "group flex items-start gap-3.5 transition-colors duration-200",
    href &&
      "rounded-xl -mx-1 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2",
  );

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={rowClass}>
        {body}
      </a>
    );
  }

  return (
    <div className={rowClass} role="group" aria-label={label}>
      {body}
    </div>
  );
}

/** Single cohesive contact information panel. */
export function ContactInfo() {
  return (
    <section
      aria-label="İletişim bilgileri"
      className="flex min-w-0 flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)] sm:p-6 lg:h-[340px] lg:justify-center"
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <ContactInfoItem
          icon={<Phone className="h-5 w-5" aria-hidden strokeWidth={2} />}
          label="Telefon"
          href={`tel:${municipality.phoneTel}`}
          ariaLabel={`Telefon: ${municipality.phone}`}
        >
          <span className="transition-colors duration-200 group-hover:text-[var(--accent)]">
            {municipality.phone}
          </span>
        </ContactInfoItem>

        <ContactInfoItem
          icon={<Clock className="h-5 w-5" aria-hidden strokeWidth={2} />}
          label="Çalışma saatleri"
        >
          <p>{municipality.workingHours}</p>
        </ContactInfoItem>

        <ContactInfoItem
          icon={<MapPin className="h-5 w-5" aria-hidden strokeWidth={2} />}
          label="Adres"
          href={municipality.mapsUrl}
          ariaLabel={`Adres: ${municipality.address}. Haritada aç`}
        >
          <address className="max-w-[360px] not-italic leading-relaxed">
            {municipality.address}
          </address>
        </ContactInfoItem>

        <ContactInfoItem
          icon={<Mail className="h-5 w-5" aria-hidden strokeWidth={2} />}
          label="E-posta"
          href={`mailto:${municipality.email}`}
          ariaLabel={`E-posta: ${municipality.email}`}
        >
          <span className="transition-colors duration-200 group-hover:text-[var(--accent)]">
            {municipality.email}
          </span>
        </ContactInfoItem>
      </div>
    </section>
  );
}
