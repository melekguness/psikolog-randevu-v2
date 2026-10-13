import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactMap } from "@/components/contact/ContactMap";

/** İletişim sayfası — bilgi paneli ve harita. */
export function ContactPage() {
  return (
    <div className="w-full max-w-full overflow-x-clip bg-[var(--color-background)] font-sans">
      <section
        className="pt-9 text-left"
        aria-labelledby="contact-page-heading"
      >
        <header className="max-w-[680px]">
          <h1
            id="contact-page-heading"
            className="font-sans text-[32px] font-bold leading-snug tracking-[-0.02em] text-[var(--color-navy)] md:text-[36px] lg:text-[40px]"
          >
            İletişim
          </h1>
        </header>
      </section>

      <section
        className="mt-10 pb-16 md:pb-20"
        aria-label="İletişim bilgileri ve konum"
      >
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <ContactInfo />
          <ContactMap />
        </div>
      </section>
    </div>
  );
}
