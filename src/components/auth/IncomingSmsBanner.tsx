
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function IncomingSmsBanner({
  phoneLabel,
  code,
  onUseCode,
  className,
}: {
  phoneLabel: string;
  code: string;
  onUseCode?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "animate-sms-in overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--atakum-muted)]">
          SMS bildirimi
        </p>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-sm font-semibold text-[var(--atakum-ink)]">
          {phoneLabel}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--atakum-muted)]">
          Atakum Belediyesi güvenlik kodunuz:
        </p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-[0.35em] text-[var(--atakum-ink)]">
          {code}
        </p>
        {onUseCode ? (
          <button
            type="button"
            onClick={onUseCode}
            className="ui-press mt-3 inline-flex h-11 items-center rounded-full bg-[var(--atakum-ink)] px-4 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Güvenlik kodunu forma aktar"
          >
            Kodu forma aktar
          </button>
        ) : null}
      </div>
    </div>
  );
}
