import { HomeAppointmentSteps } from "@/components/home/HomeAppointmentSteps";
import {
  homeBleedClass,
  homeEyebrowClass,
  homeHeadingClass,
  homeLeadClass,
} from "@/components/home/homeUi";
import { cn } from "@/lib/utils";

/** Informational “how it works” on the homepage — not a separate route. */
export function HomeHowToSection() {
  return (
    <section
      id="nasil-alinir"
      className="relative w-full min-w-0 max-w-full scroll-mt-28 overflow-x-clip overflow-y-visible py-10 font-sans md:py-14"
      aria-labelledby="how-to-heading"
    >
      <div
        aria-hidden
        className={cn(homeBleedClass, "bg-[var(--surface-muted)]/90")}
      />

      <div className="relative mx-auto min-w-0 max-w-6xl px-1">
        <div className="mx-auto max-w-2xl text-center">
          <p className={cn(homeEyebrowClass, "justify-center")}>
            Randevu süreci
          </p>
          <h2
            id="how-to-heading"
            className={cn(homeHeadingClass, "mt-3")}
          >
            Nasıl Randevu Alınır?
          </h2>
          <p className={cn(homeLeadClass, "mx-auto mt-3")}>
            Dört adımda uzmanınızı seçin, uygun saati belirleyin ve SMS ile
            doğrulayarak randevunuzu tamamlayın.
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <HomeAppointmentSteps />
        </div>
      </div>
    </section>
  );
}
