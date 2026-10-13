import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_NAME } from "@/data/municipality";

const TITLES: Record<string, string> = {
  "/": APP_NAME,
  "/uzmanlar": `Uzmanlarımız | ${APP_NAME}`,
  "/randevu": `Online Randevu | ${APP_NAME}`,
  "/iletisim": `İletişim | ${APP_NAME}`,
  "/kvkk": `KVKK Aydınlatma | ${APP_NAME}`,
  "/gizlilik": `Gizlilik | ${APP_NAME}`,
  "/randevularim": `Randevularım | ${APP_NAME}`,
  "/doktor": `Uzman Girişi | ${APP_NAME}`,
  "/doktor/panel": `Uzman Paneli | ${APP_NAME}`,
};

/** Sets document.title per route for SEO / browser tabs. */
export function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] ?? APP_NAME;
  }, [pathname]);

  return null;
}
