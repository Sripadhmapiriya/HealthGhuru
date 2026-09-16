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
        "card": "0 4px 24px rgba(46,125,50,0.08)",
        "card-hover": "0 12px 40px rgba(46,125,50,0.18)",
        "btn-primary": "0 4px 0 #1B5E20",
        "btn-accent": "0 4px 0 #b24920",
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
