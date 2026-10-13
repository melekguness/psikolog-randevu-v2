import type { ReactNode } from "react";
import { Link } from "@/components/ui/AppLink";
import { ChevronUp, Mail, MapPin, Phone } from "lucide-react";
import { APP_ROUTES, bookingHref, municipality } from "@/data/municipality";
import { AtakumLogo } from "@/components/brand/AtakumLogo";
import { cn } from "@/lib/utils";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8C5B5]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]";

const linkClass = cn(
  "inline-flex min-h-8 items-center text-[13px] leading-snug tracking-normal text-slate-400 transition-colors duration-150 hover:text-white",
  focusRing,
);

const navLinks = [
  { href: bookingHref("psychologist"), label: "Psikolog" },
  { href: bookingHref("dietitian"), label: "Diyetisyen" },
  { href: APP_ROUTES.booking, label: "Randevu Al" },
  { href: APP_ROUTES.myAppointments, label: "Randevularımı Gör" },
] as const;

const corporateLinks = [
  { href: APP_ROUTES.experts, label: "Uzmanlarımız" },
  { href: APP_ROUTES.contact, label: "İletişim" },
  { href: APP_ROUTES.doctor, label: "Uzman Paneli Girişi" },
  {
    href: municipality.eBelediyeUrl,
    label: "E-Belediye",
    external: true,
  },
] as const;

const iconBtnClass = cn(
  "inline-flex h-8 w-8 min-h-8 min-w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-400",
  "transition-colors duration-150 hover:border-[#A8C5B5]/35 hover:bg-[#4A6B5D]/20 hover:text-white",
  focusRing,
);

function SocialSvg({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

const socialLinks = [
  {
    label: "Instagram",
    href: municipality.social.instagram,
    icon: (
      <SocialSvg className="h-3.5 w-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 1.441c-3.155 0-3.507.013-4.73.07-2.23.103-3.287 1.16-3.39 3.39-.057 1.223-.069 1.575-.069 4.73s.012 3.507.069 4.73c.103 2.23 1.16 3.287 3.39 3.39 1.223.057 1.575.069 4.73.069s3.507-.012 4.73-.069c2.23-.103 3.287-1.16 3.39-3.39.057-1.223.069-1.575.069-4.73s-.012-3.507-.069-4.73c-.103-2.23-1.16-3.287-3.39-3.39-1.223-.057-1.575-.069-4.73-.069zm0 2.881a5.515 5.515 0 1 1 0 11.03 5.515 5.515 0 0 1 0-11.03zm0 1.441a4.074 4.074 0 1 0 0 8.148 4.074 4.074 0 0 0 0-8.148zm6.406-.945a1.288 1.288 0 1 1-2.576 0 1.288 1.288 0 0 1 2.576 0z" />
      </SocialSvg>
    ),
  },
  {
    label: "Facebook",
    href: municipality.social.facebook,
    icon: (
      <SocialSvg className="h-3.5 w-3.5">
        <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.4V9.84c0-2.37 1.41-3.68 3.57-3.68 1.03 0 2.12.18 2.12.18v2.33h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.8 8.44-4.94 8.44-9.93z" />
      </SocialSvg>
    ),
  },
  {
    label: "X",
    href: municipality.social.x,
    icon: (
      <SocialSvg className="h-3 w-3">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </SocialSvg>
    ),
  },
  {
    label: "YouTube",
    href: municipality.social.youtube,
    icon: (
      <SocialSvg className="h-3.5 w-3.5">
        <path d="M23.5 6.2a2.97 2.97 0 0 0-2.09-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.41.5A2.97 2.97 0 0 0 .5 6.2 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .5 5.8 2.97 2.97 0 0 0 2.09 2.1c1.91.5 9.41.5 9.41.5s7.5 0 9.41-.5a2.97 2.97 0 0 0 2.09-2.1A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.5-5.8zM9.75 15.57V8.43L15.82 12l-6.07 3.57z" />
      </SocialSvg>
    ),
  },
] as const;

export function Footer() {
  return (
    <footer className="relative isolate mt-auto overflow-x-clip bg-[#0F172A] font-sans text-slate-400 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="shell-pad-x relative mx-auto max-w-[85rem] py-8 md:py-9">
        {/* Marka | link kolonları | iletişim */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-4 lg:gap-x-8">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 rounded-md bg-white p-0.5 shadow-sm">
                <AtakumLogo size={32} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-snug tracking-normal text-white sm:text-sm">
                  {municipality.shortName}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed tracking-normal text-slate-400">
                  Sağlık Portalı
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <FooterColumn title="Hizmetler">
              <FooterLinkList links={navLinks} />
            </FooterColumn>
          </div>

          <div className="min-w-0">
            <FooterColumn title="Kurumsal">
              <FooterLinkList links={corporateLinks} />
            </FooterColumn>
          </div>

          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <FooterColumn title="İletişim">
              <ul className="space-y-2 text-[13px] tracking-normal">
                <li className="flex gap-2">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A8C5B5]"
                    aria-hidden
                  />
                  <a
                    href={municipality.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "max-w-[20rem] leading-snug text-slate-400 transition-colors duration-150 hover:text-white",
                      focusRing,
                    )}
                  >
                    {municipality.address}
                    <span className="sr-only"> (haritada aç)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${municipality.phoneTel}`}
                    className={cn(
                      "inline-flex min-h-8 items-center gap-2 font-medium text-white transition-colors duration-150 hover:text-[#A8C5B5]",
                      focusRing,
                    )}
                  >
                    <Phone
                      className="h-3.5 w-3.5 shrink-0 text-[#A8C5B5]"
                      aria-hidden
                    />
                    {municipality.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${municipality.email}`}
                    className={cn(
                      "inline-flex min-h-8 items-center gap-2 break-all text-slate-400 transition-colors duration-150 hover:text-white",
                      focusRing,
                    )}
                  >
                    <Mail
                      className="h-3.5 w-3.5 shrink-0 text-[#A8C5B5]"
                      aria-hidden
                    />
                    {municipality.email}
                  </a>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 sm:mt-7 sm:flex-row sm:gap-3">
          <p className="text-center text-[11px] leading-relaxed tracking-normal text-slate-500 sm:text-left sm:text-xs">
            © {new Date().getFullYear()} {municipality.name}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <a
              href={municipality.kvkkBelgeleriUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-8 items-center px-1.5 text-[11px] leading-relaxed tracking-normal text-slate-500 transition-colors duration-150 hover:text-white sm:text-xs",
                focusRing,
              )}
            >
              KVKK
            </a>

            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={iconBtnClass}
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                const reduced = window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                window.scrollTo({
                  top: 0,
                  behavior: reduced ? "auto" : "smooth",
                });
              }}
              className={iconBtnClass}
              aria-label="Sayfanın başına dön"
            >
              <ChevronUp className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkList({
  links,
}: {
  links: readonly { href: string; label: string; external?: boolean }[];
}) {
  return (
    <ul className="flex flex-col gap-1">
      {links.map((link) => (
        <li key={link.href}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.label}
            </a>
          ) : (
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
        {title}
      </h3>
      {children}
    </div>
  );
}
