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
        // Roasted-espresso base, matched to the chef logo's dark outline.
        ink: "#100C09",
        panel: "#1A1410",
        line: "rgba(245, 158, 11, 0.15)",
        cream: "#f3ece0",
        // Brand primary: the logo's golden halo and "AI" lettering.
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#B45309",
        },
        // Secondary trim only (thin lines, badge tags), never a large surface.
        cherry: {
          DEFAULT: "#58141F",
          light: "#7A1E2C",
        },
        // Driven by the --accent CSS variable, which GSAP tweens per dish.
        accent:
          "color-mix(in srgb, var(--accent) calc(<alpha-value> * 100%), transparent)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans Variable"', "var(--font-geist-sans)", "system-ui", "sans-serif"],
        // Handcrafted script echoing the logo's "Restaurant" wordmark.
        script: ["Playball", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
