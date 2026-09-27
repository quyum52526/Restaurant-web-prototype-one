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
        gold: {
          DEFAULT: "#c9a45c",
          light: "#e2c98f",
          dark: "#9c7a3a",
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
