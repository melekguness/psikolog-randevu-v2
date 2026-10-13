import type { ReactNode } from "react";
import { Link } from "@/components/ui/AppLink";
import { AtakumLogo } from "@/components/brand/AtakumLogo";
import { APP_ROUTES, municipality } from "@/data/municipality";
import { cn } from "@/lib/utils";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md min-w-0 animate-panel-enter",
        className,
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 shadow-[var(--shadow-card)] backdrop-blur-md">
        <div className="relative overflow-hidden bg-[#0F172A] px-5 py-5 text-white sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgb(var(--accent-glow) / 0.45), transparent 55%)",
            }}
            aria-hidden
          />
          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] shadow-sm">
              <AtakumLogo size={36} priority />
            </span>
            <div className="min-w-0 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
                {municipality.shortName}
              </p>
              <p className="text-sm font-semibold leading-snug text-white/90">
                {eyebrow}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-6 sm:py-7">
          <header className="space-y-2">
            <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-[var(--atakum-ink)]">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm leading-relaxed text-[var(--atakum-muted)]">
                {subtitle}
              </p>
            ) : null}
          </header>
          <div className="mt-6 space-y-4">{children}</div>
        </div>

        {footer ? (
          <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--atakum-muted)]">
        Kişisel verileriniz{" "}
        <Link
          href={APP_ROUTES.kvkk}
            className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          KVKK
        </Link>{" "}
        kapsamında korunur.
      </p>
    </div>
  );
}

export function AuthStepRail({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <nav aria-label="Giriş adımları" className="space-y-3">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((label, index) => {
          const n = index + 1;
          const active = n === current;
          const done = n < current;
          return (
            <li key={label} className="min-w-0 text-center">
              <span
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  active && "bg-[var(--accent)] text-white",
                  done && "bg-[var(--atakum-ink)] text-white",
                  !active && !done && "bg-[var(--surface-muted)] text-[var(--atakum-muted)]",
                )}
              >
                {n}
              </span>
              <span
                className={cn(
                  "mt-1.5 block truncate text-[11px] font-semibold leading-snug",
                  active ? "text-[var(--atakum-ink)]" : "text-[var(--atakum-muted)]",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-[var(--border)]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current}
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${(current / steps.length) * 100}%` }}
        />
      </div>
    </nav>
  );
}

export function AuthAlert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "info";
}) {
  return (
    <p
      role="alert"
      className={cn(
        "rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed",
        tone === "error" && "border-rose-200 bg-rose-50 text-rose-900",
        tone === "info" && "border-sky-200 bg-sky-50 text-sky-950",
      )}
    >
      {children}
    </p>
  );
}

export function AuthBackButton({
  onClick,
  children = "Geri",
}: {
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
    >
      {children}
    </button>
  );
}
