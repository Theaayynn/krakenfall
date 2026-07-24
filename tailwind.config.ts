import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        abyss: {
          DEFAULT: "#04060A",
          900: "#060A12",
          800: "#0A0F1C",
          700: "#111827",
        },
        brass: {
          DEFAULT: "#C9A24B",
          soft: "#E4C77A",
          dim: "#8A6E33",
        },
        tide: {
          DEFAULT: "#1F6E6A",
          soft: "#3FA79C",
          glow: "#63D8C9",
        },
        parchment: "#EDE4D3",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-16px) translateX(6px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "0.85" },
          "50%": { opacity: "0.3" },
          "55%": { opacity: "0.9" },
        },
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        flicker: "flicker 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
