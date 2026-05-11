import type { Config } from "tailwindcss";

// Palette and typography mapped from the BairesDev brand book.
// Primary brand color is the orange #F66135; secondary blue, green, and yellow
// provide complementary accents per the "Color palette / Specific uses" guidance.

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Color tokens are routed through CSS variables defined in globals.css
      // so they can flip between light and dark themes without touching markup.
      colors: {
        brand: {
          DEFAULT: "rgb(var(--c-brand) / <alpha-value>)",
          dark:    "rgb(var(--c-brand-dark) / <alpha-value>)",
          soft:    "rgb(var(--c-brand-soft) / <alpha-value>)",
          50:      "rgb(var(--c-brand-50) / <alpha-value>)",
          100:     "rgb(var(--c-brand-100) / <alpha-value>)",
        },
        blue: {
          DEFAULT: "rgb(var(--c-blue) / <alpha-value>)",
          soft:    "rgb(var(--c-blue-soft) / <alpha-value>)",
        },
        green: {
          DEFAULT: "rgb(var(--c-green) / <alpha-value>)",
          soft:    "rgb(var(--c-green-soft) / <alpha-value>)",
        },
        yellow: {
          DEFAULT: "rgb(var(--c-yellow) / <alpha-value>)",
          soft:    "rgb(var(--c-yellow-soft) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft:    "rgb(var(--c-ink-soft) / <alpha-value>)",
          muted:   "rgb(var(--c-ink-muted) / <alpha-value>)",
          light:   "rgb(var(--c-ink-light) / <alpha-value>)",
        },
        canvas: {
          DEFAULT: "rgb(var(--c-canvas) / <alpha-value>)",
          off:     "rgb(var(--c-canvas-off) / <alpha-value>)",
          warm:    "rgb(var(--c-canvas-warm) / <alpha-value>)",
          card:    "rgb(var(--c-canvas-card) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--c-line) / <alpha-value>)",
          soft:    "rgb(var(--c-line-soft) / <alpha-value>)",
        },
        accent: {
          green: "rgb(var(--c-accent-green) / <alpha-value>)",
          red:   "rgb(var(--c-accent-red) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Outfit per brand book (one family, multiple weights for hierarchy)
        sans:    ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 5.5vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4vw, 3.25rem)",  { lineHeight: "1.05", letterSpacing: "-0.018em" }],
        "display-md": ["clamp(1.75rem, 2.5vw, 2.25rem)",{ lineHeight: "1.1",  letterSpacing: "-0.014em" }],
      },
      maxWidth: {
        page: "1200px",
        prose: "65ch",
      },
      boxShadow: {
        card:      "0 1px 2px rgba(17,17,17,0.04), 0 4px 16px rgba(17,17,17,0.04)",
        cardHover: "0 4px 12px rgba(17,17,17,0.06), 0 12px 32px rgba(17,17,17,0.08)",
        wizard:    "0 2px 4px rgba(17,17,17,0.04), 0 24px 48px rgba(17,17,17,0.10)",
      },
      borderRadius: {
        card: "14px",
      },
      animation: {
        "fade-in":   "fadeIn 0.5s ease-out forwards",
        "slide-up":  "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in":  "slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
