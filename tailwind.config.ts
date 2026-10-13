import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "var(--brand-navy)",
          sky: "#0284C7",
          teal: "#0D9488",
          wood: "#D4A373",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          soft: "var(--accent-soft)",
          ring: "var(--accent-ring)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
        },
        atakum: {
          navy: "var(--atakum-navy)",
          blue: "var(--atakum-blue)",
          sky: "var(--atakum-sky)",
          mist: "var(--atakum-mist)",
          foam: "var(--atakum-foam)",
          gold: "var(--atakum-gold)",
          teal: "var(--atakum-teal)",
          coral: "var(--atakum-coral)",
          ink: "var(--atakum-ink)",
          muted: "var(--atakum-muted)",
        },
      },
      fontFamily: {
        display: [
          "var(--font-atakum-display)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-atakum-sans)",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-atakum-mono)",
          "ui-monospace",
          "Cascadia Code",
          "monospace",
        ],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        touch: "44px",
      },
      minHeight: {
        touch: "44px",
        screen: ["100vh", "100dvh"],
      },
      minWidth: {
        touch: "44px",
      },
      screens: {
        xs: "375px",
        iphone: "390px",
        "iphone-pro": "430px",
      },
    },
  },
  plugins: [],
};

export default config;
