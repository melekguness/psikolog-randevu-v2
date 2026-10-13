import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reset window scroll on route changes so guests don't land mid-page
 * after navigating from the bottom of the previous screen.
 * Hash targets (e.g. /#sss) are left to the hash scroll handlers.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const main = document.getElementById("ana-icerik");
    if (main instanceof HTMLElement) {
      main.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}
