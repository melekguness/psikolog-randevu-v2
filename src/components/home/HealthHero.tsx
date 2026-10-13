import { Image } from "@/components/ui/Image";
import { Link } from "@/components/ui/AppLink";
import { bookingHref } from "@/data/municipality";
import { SERVICE_SUMMARIES } from "@/data/homeContent";
import { homeBleedClass } from "@/components/home/homeUi";
import { cn } from "@/lib/utils";

function ChoiceCard({
  href,
  imageSrc,
  title,
  description,
  cta,
  tone,
}: {
  href: string;
  imageSrc: string;
  title: string;
  description: string;
  cta: string;
  tone: "psych" | "diet";
}) {
  const psych = tone === "psych";

  return (
    <Link
      href={href}
      aria-label={cta}
      className={cn(
        "group relative flex h-full min-h-[18rem] w-full min-w-0 flex-col overflow-hidden rounded-2xl border p-5 shadow-sm md:min-h-[20rem] md:p-6",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-200",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        psych
          ? "border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"
          : "border-[var(--color-primary)]/30 bg-gradient-to-br from-[#234E38] via-[#2E5A44] to-[#1B3B2A]",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"
      />

      <span className="relative mx-auto flex h-24 w-full shrink-0 items-center justify-center overflow-hidden bg-transparent md:h-28">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full opacity-70 blur-3xl",
            psych
              ? "bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.22),transparent_70%)]"
              : "bg-[radial-gradient(ellipse_at_center,rgba(74,107,93,0.28),transparent_70%)]",
          )}
        />
        <span
          className="relative h-full w-full bg-transparent"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 88% 82% at 50% 46%, #000 18%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.35) 62%, transparent 78%)",
            maskImage:
              "radial-gradient(ellipse 88% 82% at 50% 46%, #000 18%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.35) 62%, transparent 78%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="-translate-y-1.5 scale-[1.06] object-contain md:-translate-y-2"
            priority
          />
        </span>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            psych
              ? "bg-[radial-gradient(ellipse_72%_68%_at_50%_46%,transparent_0%,transparent_38%,rgba(15,23,42,0.45)_68%,rgb(15,23,42)_92%)]"
              : "bg-[radial-gradient(ellipse_72%_68%_at_50%_46%,transparent_0%,transparent_38%,rgba(27,59,42,0.45)_68%,rgb(27,59,42)_92%)]",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent",
            psych ? "from-slate-900" : "from-[#1B3B2A]",
          )}
        />
      </span>

      <span className="relative mt-4 flex w-full min-w-0 flex-1 flex-col items-center gap-3 text-center">
        <span className="w-full min-w-0 space-y-2">
          <span className="block text-xl font-semibold tracking-tight text-white md:text-2xl">
            {title}
          </span>
          <span
            className={cn(
              "mx-auto block max-w-sm text-[15px] leading-relaxed",
              psych ? "text-slate-300" : "text-[#D5E0D9]",
            )}
          >
            {description}
          </span>
        </span>

        <span
          className={cn(
            "mt-auto inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-base font-semibold",
            "bg-white shadow-sm transition-colors duration-200",
            psych
              ? "text-slate-900 group-hover:bg-slate-50"
              : "text-[#1B3B2A] group-hover:bg-slate-50",
          )}
        >
          {cta}
        </span>
      </span>
    </Link>
  );
}

export function HealthHero() {
  return (
    <section
      className="relative w-full min-w-0 max-w-full overflow-x-clip"
      aria-labelledby="portal-heading"
    >
      <div className="relative isolate py-10 md:py-14">
        <div
          aria-hidden
          className={cn(homeBleedClass, "bg-[var(--color-background)]")}
        />

        <header className="relative mx-auto max-w-3xl px-4 text-center">
          <h1
            id="portal-heading"
            className="break-words font-sans text-3xl font-semibold tracking-normal text-[var(--color-navy)] [word-spacing:0.12em] sm:text-4xl md:text-[2.5rem] md:leading-tight"
          >
            Atakum Belediyesi Sağlık Portalı
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed tracking-normal text-[var(--color-text-secondary)] [word-spacing:0.1em] sm:text-base">
            Sağlığınız bizimle güvende; uzmanlarımız yanınızda.
          </p>
        </header>

        <div className="relative mt-8 md:mt-10">
          <div
            id="hizmetler"
            className="mx-auto grid max-w-[72rem] scroll-mt-28 grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8"
          >
            <ChoiceCard
              href={bookingHref("psychologist")}
              imageSrc="/hero/psychologist-brain.jpg"
              title={SERVICE_SUMMARIES.psychologist.title}
              description={SERVICE_SUMMARIES.psychologist.description}
              cta="Psikolog randevusu al"
              tone="psych"
            />
            <ChoiceCard
              href={bookingHref("dietitian")}
              imageSrc="/hero/dietitian-bowl.jpg"
              title={SERVICE_SUMMARIES.dietitian.title}
              description={SERVICE_SUMMARIES.dietitian.description}
              cta="Diyetisyen randevusu al"
              tone="diet"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
