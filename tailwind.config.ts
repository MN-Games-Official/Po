import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        panel: "var(--color-panel)",
        panelMuted: "var(--color-panel-muted)",
        line: "var(--color-line)",
        accent: "var(--color-accent)",
        accentSoft: "var(--color-accent-soft)",
        text: "var(--color-text)",
        textMuted: "var(--color-text-muted)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "Georgia"],
      },
      boxShadow: {
        glow: "0 24px 64px rgba(255, 93, 82, 0.24)",
        panel: "0 24px 60px rgba(9, 18, 31, 0.16)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.94)", opacity: "0.8" },
          "100%": { transform: "scale(1.08)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-300px 0" },
          "100%": { backgroundPosition: "300px 0" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseRing: "pulseRing 2.2s ease-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        rise: "rise 0.65s ease-out both",
      },
      backgroundImage: {
        radial:
          "radial-gradient(circle at top right, rgba(255, 93, 82, 0.18), transparent 42%), radial-gradient(circle at bottom left, rgba(19, 120, 184, 0.18), transparent 36%)",
        mesh:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%), linear-gradient(315deg, rgba(255,255,255,0.04) 0%, transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;

