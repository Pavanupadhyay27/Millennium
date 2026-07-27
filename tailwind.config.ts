import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Overriding colors entirely to eliminate standard Tailwind palettes and avoid "AI slop" look.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000000",
      cream: {
        DEFAULT: "var(--cream)",
        light: "var(--cream-light)",
      },
      charcoal: {
        DEFAULT: "var(--charcoal)",
        light: "var(--charcoal-light)",
      },
      accent: {
        teal: "var(--accent-teal)",
        terracotta: "var(--accent-terracotta)",
      },
      pastel: {
        mint: "var(--pastel-mint)",
        blush: "var(--pastel-blush)",
        lavender: "var(--pastel-lavender)",
        butter: "var(--pastel-butter)",
      },
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "warm-sm": "0 2px 8px -1px rgba(31, 27, 22, 0.06)",
        "warm-md": "0 8px 16px -4px rgba(31, 27, 22, 0.08)",
        "warm-lg": "0 20px 40px -12px rgba(31, 27, 22, 0.12)",
        "warm-xl": "0 30px 60px -15px rgba(31, 27, 22, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
