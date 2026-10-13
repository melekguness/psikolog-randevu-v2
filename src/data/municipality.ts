import type { MunicipalityInfo } from "@/types";

export const municipality: MunicipalityInfo & {
  eBelediyeUrl: string;
  iletisimUrl: string;
  hizmetlerUrl: string;
  kvkkBelgeleriUrl: string;
  phoneTel: string;
  mapsUrl: string;
  social: {
    instagram: string;
    facebook: string;
    x: string;
    youtube: string;
  };
} = {
  name: "T.C. Atakum Belediyesi",
  shortName: "Atakum Belediyesi",
  website: "https://www.atakum.bel.tr/",
  eBelediyeUrl: "https://interaktif.atakum.bel.tr/#/home",
  iletisimUrl: "https://www.atakum.bel.tr/iletisim",
  hizmetlerUrl: "https://www.atakum.bel.tr/hizmetlerimiz",
  kvkkBelgeleriUrl: "https://www.atakum.bel.tr/sayfa-kvkk-belgeleri",
  phone: "444 40 55",
  phoneTel: "4444055",
  email: "bilgi@atakum.bel.tr",
  address: "Mimarsinan Mah. İsmet İnönü Blv. No:114 Atakum/Samsun",
  workingHours: "Hafta içi 08:00 – 17:00",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Mimarsinan+Mah.+Ismet+Inonu+Blv.+No:114+Atakum+Samsun",
  social: {
    instagram: "https://www.instagram.com/atakumbeltr/",
    facebook: "https://www.facebook.com/atakumbeltr/",
    x: "https://x.com/atakumbeltr",
    youtube: "https://www.youtube.com/@atakumbeltr",
  },
};

export const CENTER_NAME =
  "T.C. Atakum Belediyesi Sağlık İşleri Müdürlüğü";

/** Kurumsal kimlik satırı — Footer / hero gibi güven vurgusu gereken yerler için. */
export const AFFILIATION_LINE =
  "Atakum Belediyesi Sağlık İşleri Müdürlüğü";

export const HEADER_ORG_TITLE = "T.C. Atakum Belediyesi Sağlık İşleri Müdürlüğü";

/** Citizen-facing product name — keep Header / Hero / title / legal aligned. */
export const APP_NAME = "Atakum Belediyesi Sağlık Portalı";

export const SERVICE_MOTTOS = {
  psychologist: "Zihinsel Denge ve Ruh Sağlığınız İçin Yanınızdayız.",
  dietitian: "Sağlıklı Beslenme ve Zinde Bir Yaşam İçin Adım Atın.",
} as const;

export const APP_ROUTES = {
  home: "/",
  services: "/#hizmetler",
  staff: "/uzmanlar",
  experts: "/uzmanlar",
  faq: "/#sss",
  contact: "/iletisim",
  kvkk: "/kvkk",
  privacy: "/gizlilik",
  cookies: "/cerez-politikasi",
  admin: "/admin",
  doctor: "/doktor",
  doctorPanel: "/doktor/panel",
  doctorDashboard: "/doktor/panel",
  booking: "/randevu",
  bookingRedirect: "/randevu",
  myAppointments: "/randevularim",
  dietitian: "/randevu?department=dietitian",
  psychologist: "/randevu?department=psychologist",
} as const;

export function bookingHref(department?: "dietitian" | "psychologist") {
  return department
    ? (`/randevu?department=${department}` as const)
    : APP_ROUTES.booking;
}

export const NAV_LINKS = [
  { href: APP_ROUTES.home, label: "Ana Sayfa" },
  { href: APP_ROUTES.experts, label: "Uzmanlarımız" },
  { href: APP_ROUTES.myAppointments, label: "Randevularım" },
  { href: APP_ROUTES.contact, label: "İletişim" },
] as const;
