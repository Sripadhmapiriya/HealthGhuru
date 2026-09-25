import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16A34A",
          light: "#22C55E",
          dark: "#15803D",
        },
        secondary: "#4ADE80",
        accent: {
          DEFAULT: "#f06d2f",
          light: "#ffd6c1",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          alt: "#F1F5F9",
        },
        dark: {
          DEFAULT: "#0F172A",
          80: "rgba(15,23,42,0.8)",
        },
        text: {
          primary: "#0F172A",
          secondary: "#334155",
          muted: "#64748B",
        },
        border: {
          DEFAULT: "rgba(22,163,74,0.15)",
          strong: "rgba(22,163,74,0.30)",
        },
        chart: {
          nutrition: "var(--chart-nutrition)",
          sleep: "var(--chart-sleep)",
          fitness: "var(--chart-fitness)",
          mood: "var(--chart-mood)",
          water: "var(--chart-water)",
        },
        status: {
          good: "var(--status-good)",
          warning: "var(--status-warning)",
          danger: "var(--status-danger)",
        },
      },
      spacing: {
        sidebar: "var(--sidebar-width)",
        "sidebar-collapsed": "var(--sidebar-collapsed)",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
        "gradient-hero": "linear-gradient(135deg, #15803D 0%, #16A34A 60%, #22C55E 100%)",
        "gradient-brand": "linear-gradient(90deg, #16A34A 0%, #15803D 45%, #ea580c 100%)",
        "gradient-brand-smooth": "linear-gradient(90deg, #16A34A 0%, #22C55E 35%, #f06d2f 80%, #ea580c 100%)",
        "gradient-brand-subtle": "linear-gradient(90deg, rgba(22,163,74,0.08) 0%, rgba(255,255,255,0.9) 50%, rgba(240,109,47,0.08) 100%)",
        "gradient-dark": "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
        "gradient-surface": "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        "gradient-accent": "linear-gradient(135deg, #f06d2f 0%, #ff8a57 100%)",
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "card": "0 4px 24px rgba(46,125,50,0.08)",
        "card-hover": "0 12px 40px rgba(46,125,50,0.18)",
        "card-brand": "0 10px 30px -5px rgba(22,163,74,0.15), 0 0 15px -2px rgba(240,109,47,0.12)",
        "glow-green": "0 0 25px -3px rgba(34,197,94,0.35)",
        "glow-orange": "0 0 25px -3px rgba(240,109,47,0.4)",
        "btn-primary": "0 4px 0 #1B5E20",
        "btn-accent": "0 4px 0 #b24920",
      },
      animation: {
        "shimmer": "shimmer 2.5s infinite linear",
        "pulse-subtle": "pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      borderRadius: {
        "card": "14px",
        "btn": "9999px",
      },
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  plugins: [],
};
export default config;
