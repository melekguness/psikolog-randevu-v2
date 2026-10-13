import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useIsClient } from "@/lib/useIsClient";

export type FontScale = "normal" | "large" | "xlarge";
export type Appearance = "light" | "dark";

interface AccessibilityState {
  ready: boolean;
  fontScale: FontScale;
  appearance: Appearance;
  setFontScale: (scale: FontScale) => void;
  cycleFont: () => void;
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

const STORAGE_KEY = "atakum-a11y-v3";
const SCALES: FontScale[] = ["normal", "large", "xlarge"];

type Prefs = {
  fontScale: FontScale;
  appearance: Appearance;
};

/** Varsayılan açık tema; koyu tema header’dan isteğe bağlı açılır. */
const DEFAULTS: Prefs = {
  fontScale: "normal",
  appearance: "light",
};

function readPrefs(): Prefs {
  const fallback = DEFAULTS;
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem("atakum-a11y-v2") ??
      localStorage.getItem("atakum-a11y");
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as {
      fontScale?: FontScale;
      appearance?: Appearance;
    };
    return {
      fontScale:
        parsed.fontScale === "normal" ||
        parsed.fontScale === "large" ||
        parsed.fontScale === "xlarge"
          ? parsed.fontScale
          : fallback.fontScale,
      appearance:
        parsed.appearance === "dark" || parsed.appearance === "light"
          ? parsed.appearance
          : fallback.appearance,
    };
  } catch {
    return fallback;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const ready = useIsClient();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const resolved =
    prefs ??
    (ready
      ? readPrefs()
      : {
          fontScale: "normal" as FontScale,
          appearance: "light" as Appearance,
        });
  const { fontScale, appearance } = resolved;

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.setAttribute("data-font-scale", fontScale);
    root.setAttribute("data-appearance", appearance);
    root.classList.toggle("dark", appearance === "dark");
    root.removeAttribute("data-palette");
    root.removeAttribute("data-contrast");
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fontScale, appearance }),
      );
    } catch {
      /* localStorage may be unavailable (private mode / quota) */
    }
  }, [ready, fontScale, appearance]);

  const setFontScale = useCallback((scale: FontScale) => {
    setPrefs((cur) => ({ ...(cur ?? readPrefs()), fontScale: scale }));
  }, []);

  const cycleFont = useCallback(() => {
    setPrefs((cur) => {
      const base = cur ?? readPrefs();
      const i = SCALES.indexOf(base.fontScale);
      return { ...base, fontScale: SCALES[(i + 1) % SCALES.length] };
    });
  }, []);

  const setAppearance = useCallback((next: Appearance) => {
    setPrefs((cur) => ({ ...(cur ?? readPrefs()), appearance: next }));
  }, []);

  const toggleAppearance = useCallback(() => {
    setPrefs((cur) => {
      const base = cur ?? readPrefs();
      return {
        ...base,
        appearance: base.appearance === "dark" ? "light" : "dark",
      };
    });
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ready,
        fontScale,
        appearance,
        setFontScale,
        cycleFont,
        setAppearance,
        toggleAppearance,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
