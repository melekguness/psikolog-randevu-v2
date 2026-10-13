import type { ReactNode } from "react";
import { Link } from "@/components/ui/AppLink";
import { ChevronRight } from "lucide-react";
import { APP_NAME, APP_ROUTES, municipality } from "@/data/municipality";
import { cn } from "@/lib/utils";

export function PanelShell({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: ReactNode;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full min-w-0 max-w-5xl space-y-4 overflow-x-clip animate-panel-enter", className)}>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="bg-[var(--atakum-ink)] px-4 py-3.5 text-white sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            {municipality.shortName}
          </p>
          <p className="mt-1.5 text-sm font-semibold leading-snug sm:text-base">{APP_NAME}</p>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 sm:px-5">
          <div className="min-w-0 space-y-1.5">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav
                aria-label="Sayfa yolu"
                className="flex flex-wrap items-center gap-1.5 text-xs leading-relaxed text-[var(--atakum-muted)]"
              >
                <Link
                  href={APP_ROUTES.home}
                  className="transition-colors hover:text-[var(--atakum-ink)]"
                >
                  Ana Sayfa
                </Link>
                {breadcrumbs.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="transition-colors hover:text-[var(--atakum-ink)]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-[var(--atakum-ink)]">
                        {item.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            ) : null}
            <div className="flex flex-wrap items-center gap-2.5">
              {badge ? (
                <span className="rounded bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  {badge}
                </span>
              ) : null}
              <h1 className="text-xl font-bold leading-snug text-[var(--atakum-ink)] sm:text-2xl">
                {title}
              </h1>
            </div>
            {subtitle ? (
              <div className="text-sm leading-relaxed text-[var(--atakum-muted)]">
                {subtitle}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

export function PanelStat({
  label,
  value,
  tone = "neutral",
  active = false,
  onClick,
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  active?: boolean;
  onClick?: () => void;
}) {
  const tones = {
    neutral: "border-[var(--border)] bg-[var(--surface)]",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
    danger: "border-rose-200 bg-rose-50",
    info: "border-sky-200 bg-sky-50",
  } as const;
  const valueTone = {
    neutral: "text-[var(--atakum-ink)]",
    success: "text-emerald-800",
    warning: "text-amber-900",
    danger: "text-rose-800",
    info: "text-sky-900",
  } as const;

  const className = cn(
    "min-w-0 rounded-xl border px-4 py-3.5 text-left shadow-sm transition-colors",
    tones[tone],
    onClick &&
      "cursor-pointer hover:brightness-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
    active && "border-[var(--atakum-ink)] bg-[var(--surface-muted)]",
  );

  const body = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--atakum-muted)]">
        {label}
      </p>
      <p className={cn("mt-1.5 text-2xl font-bold tabular-nums leading-none", valueTone[tone])}>
        {value}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}

export function PanelCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.125rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm",
        className,
      )}
    >
      {(title || description) && (
        <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 sm:px-5">
          {title ? (
            <h2 className="text-sm font-bold leading-snug text-[var(--atakum-ink)]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--atakum-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      )}
      <div className="min-w-0 p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function PanelNotice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "info" &&
          "border-sky-200 bg-sky-50 text-sky-950",
        tone === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-950",
      )}
    >
      {children}
    </div>
  );
}
