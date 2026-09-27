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
        // Driven by the --accent CSS variable, which GSAP tweens per drink.
        accent:
          "color-mix(in srgb, var(--accent) calc(<alpha-value> * 100%), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
