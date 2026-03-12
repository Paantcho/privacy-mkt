import type { Config } from "tailwindcss";

/**
 * Tailwind config do Privacy Design System.
 * Todos os tokens mapeiam para variáveis CSS em globals.css.
 * Trocar cores: só editar globals.css — este arquivo não muda.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./design-system/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Urbanist", "sans-serif"],
        urbanist: ["Urbanist", "sans-serif"],
      },
      colors: {
        /* Primária (Laranja) */
        primary: {
          50:   "var(--primary-50)",
          100:  "var(--primary-100)",
          200:  "var(--primary-200)",
          300:  "var(--primary-300)",
          400:  "var(--primary-400)",
          500:  "var(--primary-500)",   /* #F68D3D */
          600:  "var(--primary-600)",
          700:  "var(--primary-700)",
          800:  "var(--primary-800)",
          900:  "var(--primary-900)",
          1000: "var(--primary-1000)",
        },
        /* Ink (Carvão) */
        ink: {
          50:  "var(--ink-50)",
          100: "var(--ink-100)",
          200: "var(--ink-200)",
          300: "var(--ink-300)",
          400: "var(--ink-400)",
          500: "var(--ink-500)",   /* #23201F */
          600: "var(--ink-600)",
          700: "var(--ink-700)",
          800: "var(--ink-800)",
        },
        /* Background base (Off-white) */
        base: {
          50:  "var(--bg-base-50)",
          100: "var(--bg-base-100)",
          200: "var(--bg-base-200)",   /* #F4EEE5 — fundo geral */
          300: "var(--bg-base-300)",
          400: "var(--bg-base-400)",
          500: "var(--bg-base-500)",
          600: "var(--bg-base-600)",
          700: "var(--bg-base-700)",
        },
        /* Surface */
        surface: {
          500: "var(--surface-500)",   /* #FFFFFF */
          600: "var(--surface-600)",
        },
        /* Sand */
        sand: {
          100: "var(--sand-100)",
          300: "var(--sand-300)",
          600: "var(--sand-600)",
          700: "var(--sand-700)",
        },
      },
      borderRadius: {
        sm:      "var(--r-sm)",
        md:      "var(--r-md)",
        lg:      "var(--r-lg)",
        xl:      "var(--r-xl)",
        "2xl":   "var(--r-2xl)",
        pill:    "var(--r-pill)",
        button:  "var(--r-button)",
        card:    "var(--r-card)",
        sidebar: "var(--r-sidebar)",
        input:   "var(--r-input)",
      },
      transitionTimingFunction: {
        std: "cubic-bezier(0.4, 0, 0.2, 1)",
        dec: "cubic-bezier(0.0, 0, 0.2, 1)",
        acc: "cubic-bezier(0.4, 0, 1.0, 1)",
        emp: "cubic-bezier(0.2, 0, 0.0, 1)",
        exp: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
