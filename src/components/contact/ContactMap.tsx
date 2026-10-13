import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { municipality } from "@/data/municipality";

const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  municipality.address,
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

/** Map panel — click-to-activate avoids Google’s ctrl+scroll overlay UX. */
export function ContactMap() {
  const [active, setActive] = useState(false);

  return (
    <figure
      aria-label={`${municipality.shortName} konumu`}
      className="relative aspect-[4/3] min-h-[240px] w-full min-w-0 overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--surface-muted)] shadow-[var(--shadow-md)] sm:aspect-[16/10] sm:min-h-[280px] lg:aspect-auto lg:h-[340px] lg:min-h-0"
    >
      <iframe
        title={`${municipality.shortName} konumu`}
        src={mapSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={active ? 0 : -1}
      />

      {!active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 z-10 flex items-end justify-center bg-transparent p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-inset"
          aria-label="Haritayı etkinleştir"
        >
          <span className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-2.5 text-sm font-semibold text-[var(--color-navy)] shadow-sm backdrop-blur-sm">
            Haritayı kullanmak için tıklayın
          </span>
        </button>
      ) : null}

      <a
        href={municipality.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konumu Google Haritalar’da aç"
        className="absolute right-4 bottom-4 z-20 inline-flex h-12 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[15px] font-semibold text-[var(--color-navy)] shadow-[var(--shadow-md)] transition-all duration-200 hover:-translate-y-px hover:border-[var(--accent)]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
      >
        <ExternalLink
          className="h-4 w-4 text-[var(--accent)]"
          aria-hidden
          strokeWidth={2}
        />
        Haritada aç
      </a>
    </figure>
  );
}
