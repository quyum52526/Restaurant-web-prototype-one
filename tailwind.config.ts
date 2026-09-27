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
        ink: "#0b0a09",
        panel: "#15120f",
        line: "rgba(243, 236, 224, 0.1)",
        cream: "#f3ece0",
        // Brand primary (amber).
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#B45309",
        },
        // Brand secondary (wine).
        wine: {
          DEFAULT: "#881337",
          light: "#9F1239",
          dark: "#4C0519",
        },
        // Driven by the --accent CSS variable, which GSAP tweens per dish.
        accent:
          "color-mix(in srgb, var(--accent) calc(<alpha-value> * 100%), transparent)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ['"Playfair Display Variable"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
