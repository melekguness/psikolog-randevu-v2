import { Link } from "@/components/ui/AppLink";
import { AtakumLogo } from "@/components/brand/AtakumLogo";
import { APP_ROUTES, municipality } from "@/data/municipality";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center space-y-4 px-4 text-center animate-panel-enter">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)] shadow-sm ring-1 ring-[var(--border)]">
        <AtakumLogo size={40} />
      </span>
      <div className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
          404
        </p>
        <h1 className="font-display text-2xl font-bold leading-snug text-[var(--atakum-ink)]">
          Sayfa bulunamadı
        </h1>
        <p className="text-sm leading-relaxed text-[var(--atakum-muted)]">
          Aradığınız sayfa taşınmış veya kaldırılmış olabilir.{" "}
          {municipality.shortName} randevu sistemine ana sayfadan devam
          edebilirsiniz.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href={APP_ROUTES.home}
          className="ui-press inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Ana sayfa
        </Link>
        <Link
          href={APP_ROUTES.booking}
          className="ui-press inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--atakum-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Randevu Al
        </Link>
      </div>
    </div>
  );
}
