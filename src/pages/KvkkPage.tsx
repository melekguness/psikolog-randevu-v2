import { Link } from "@/components/ui/AppLink";
import { APP_ROUTES } from "@/data/municipality";
import {
  KVKK_NOTICE_INTRO,
  KVKK_NOTICE_SECTIONS,
} from "@/data/kvkkNotice";
import { pageContentClass } from "@/components/home/homeUi";

export function KvkkPage() {
  return (
    <article className={`${pageContentClass} space-y-8`}>
      <header className="space-y-2.5">
        <h1 className="break-words font-display text-2xl font-bold leading-snug text-[var(--atakum-ink)] sm:text-3xl">
          KVKK Aydınlatma Metni
        </h1>
        <p className="text-sm leading-relaxed text-[var(--atakum-muted)] [overflow-wrap:anywhere] sm:text-base">
          {KVKK_NOTICE_INTRO}
        </p>
      </header>

      {KVKK_NOTICE_SECTIONS.map((section) => (
        <section
          key={section.id}
          className={
            section.id === "controller"
              ? "min-w-0 space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
              : "min-w-0 space-y-3"
          }
        >
          <h2 className="text-base font-bold text-[var(--atakum-ink)]">
            {section.title}
          </h2>
          {section.paragraphs?.map((p) => (
            <p
              key={p.slice(0, 32)}
              className="whitespace-pre-line text-sm leading-relaxed text-[var(--atakum-muted)] [overflow-wrap:anywhere]"
            >
              {p}
            </p>
          ))}
          {section.bullets ? (
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--atakum-muted)]">
              {section.bullets.map((item) => (
                <li key={item} className="[overflow-wrap:anywhere]">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="min-w-0 space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] p-5 sm:p-6">
        <h2 className="text-base font-bold text-[var(--atakum-ink)]">
          Yerel depolama
        </h2>
        <p className="text-sm leading-relaxed text-[var(--atakum-muted)] [overflow-wrap:anywhere]">
          Site; yazı boyutu ve tema gibi erişilebilirlik tercihleri için yerel
          depolama (localStorage) kullanabilir. Randevu kayıtları sunucu
          tarafındaki veritabanında tutulur; vatandaş hesabı veya oturum çerezi
          kullanılmaz. Pazarlama veya izleme amaçlı çerez bildirimi
          gösterilmez.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={APP_ROUTES.contact}
          className="ui-press inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          İletişim
        </Link>
        <Link
          href={APP_ROUTES.home}
          className="ui-press inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--atakum-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Ana sayfa
        </Link>
      </div>
    </article>
  );
}
