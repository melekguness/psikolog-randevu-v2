import { Link } from "@/components/ui/AppLink";
import { pageContentClass } from "@/components/home/homeUi";
import { APP_NAME, APP_ROUTES, municipality } from "@/data/municipality";

export function PrivacyPage() {
  return (
    <article className={`${pageContentClass} space-y-6`}>
      <header className="space-y-2.5">
        <h1 className="break-words font-display text-2xl font-bold leading-snug text-[var(--atakum-ink)] sm:text-3xl">
          Gizlilik Politikası
        </h1>
        <p className="text-sm leading-relaxed text-[var(--atakum-muted)] [overflow-wrap:anywhere]">
          {municipality.shortName} {APP_NAME} kapsamında kişisel verilerinizin
          korunmasına ilişkin genel bilgilendirme.
        </p>
      </header>

      <section className="min-w-0 space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-base font-bold text-[var(--atakum-ink)]">Özet</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--atakum-muted)]">
          <li className="[overflow-wrap:anywhere]">
            Randevu için gerekli ad soyad ve iletişim bilgileri yalnızca hizmetin
            yürütülmesi amacıyla işlenir. Kullanıcı hesabı oluşturulmaz.
          </li>
          <li className="[overflow-wrap:anywhere]">
            Sağlık ve psikolojik danışmanlığa ilişkin hassas veriler, yetkili
            personel erişimiyle sınırlı tutulur.
          </li>
          <li className="[overflow-wrap:anywhere]">
            Ayrıntılı aydınlatma için{" "}
            <Link
              href={APP_ROUTES.kvkk}
              className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              KVKK Aydınlatma Metni
            </Link>{" "}
            sayfasını inceleyiniz.
          </li>
          <li className="[overflow-wrap:anywhere]">
            Resmi hukuk metinleri ve güncellemeler için{" "}
            <a
              href={`mailto:${municipality.email}`}
              className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              {municipality.email}
            </a>{" "}
            adresine başvurabilirsiniz.
          </li>
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={APP_ROUTES.kvkk}
          className="ui-press inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          KVKK metni
        </Link>
        <Link
          href={APP_ROUTES.contact}
          className="ui-press inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--atakum-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          İletişim
        </Link>
      </div>
    </article>
  );
}
