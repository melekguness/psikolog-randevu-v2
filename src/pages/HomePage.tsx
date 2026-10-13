import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthHero } from "@/components/home/HealthHero";
import { HomeHowToSection } from "@/components/home/HomeHowToSection";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { APP_ROUTES } from "@/data/municipality";

/** Landing gate: Hero → How it works → FAQ. */
export function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "uzmanlar") {
      navigate(APP_ROUTES.experts, { replace: true });
      return;
    }
    if (hash === "iletisim") {
      navigate(APP_ROUTES.contact, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex w-full max-w-full flex-col overflow-x-clip">
      <HealthHero />
      <HomeHowToSection />
      <HomeFAQ />
    </div>
  );
}
