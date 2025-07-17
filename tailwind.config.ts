import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#ffffff",
          dark: "#0f0f0f",
        },
        surface: {
          DEFAULT: "#f5f5f5",
          dark: "#1f1f1f",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#3f3f46",
        },
        card: {
          DEFAULT: "#ffffff",
          dark: "#1a1a1a",
        },
        muted: {
          DEFAULT: "#f0f4ff",
          dark: "#2a3b5c", // 或者用 rgba(59,130,246,0.1)
        },
        foreground: {
          DEFAULT: "#111111", // 白天文字
          dark: "#f5f5f5", // 暗色模式文字
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "var(--font-roboto)",
          "Noto Sans SC",
          "Noto Sans TC",
          "sans-serif",
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [typography, forms, animate],
};
