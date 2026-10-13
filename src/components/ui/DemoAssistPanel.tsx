
import type { ReactNode } from "react";
import { KeyRound } from "lucide-react";
import { isDemoMode } from "@/data/demoCredentials";

interface DemoAssistPanelProps {
  onFill: () => void;
  fillLabel: string;
  hint?: string;
  children?: ReactNode;
}

export function DemoAssistPanel({
  onFill,
  fillLabel,
  hint = "Yalnızca geliştirme ortamında görünür.",
  children,
}: DemoAssistPanelProps) {
  if (!import.meta.env.DEV || !isDemoMode) return null;

  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/80 p-6">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent)] ring-1 ring-[var(--border)]">
          <KeyRound className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--atakum-ink)]">
            Örnek bilgi yardımcısı
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--atakum-muted)]">
            {hint}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onFill}
        aria-label={fillLabel}
        className="ui-press mt-3 inline-flex h-12 w-full items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {fillLabel}
      </button>

      {children ? <div className="mt-2 space-y-1.5">{children}</div> : null}
    </div>
  );
}
