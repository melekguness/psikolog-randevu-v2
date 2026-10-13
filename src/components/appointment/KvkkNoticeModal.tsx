
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  KVKK_CONSENT_LABEL,
  KVKK_NOTICE_INTRO,
  KVKK_NOTICE_SECTIONS,
} from "@/data/kvkkNotice";

export function KvkkNoticeModal({
  open,
  onClose,
  onAccept,
}: {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        ...panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex animate-fade-in items-end justify-center bg-black/45 p-3 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(88dvh,40rem)] w-full max-w-lg animate-panel-enter flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl transition-all duration-300 ease-in-out"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-display text-lg font-bold text-[var(--atakum-ink)]"
            >
              KVKK Aydınlatma Metni
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--atakum-muted)]">
              {KVKK_NOTICE_INTRO}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--atakum-muted)] hover:bg-[var(--hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
          {KVKK_NOTICE_SECTIONS.map((section) => (
            <section key={section.id} className="space-y-2">
              <h3 className="text-sm font-bold text-[var(--atakum-ink)]">
                {section.title}
              </h3>
              {section.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="whitespace-pre-line text-sm leading-relaxed text-[var(--atakum-muted)]"
                >
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--atakum-muted)]">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--atakum-ink)] hover:bg-[var(--hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Kapat
          </button>
          <Button
            type="button"
            onClick={onAccept}
            className="min-h-[44px]"
          >
            Okudum, onaylıyorum
          </Button>
        </div>
        <p className="sr-only">{KVKK_CONSENT_LABEL}</p>
      </div>
    </div>
  );
}
