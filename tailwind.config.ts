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
        background: "var(--background)",
        foreground: "var(--foreground)",
        kid: {
          teal: "#4ECDC4",
          purple: "#B18CF0",
          yellow: "#FFD93D",
          orange: "#FFB84D",
          coral: "#FF6B6B",
          green: "#6BCB77",
          blue: "#4D96FF",
          ink: "#2E2A26",
          cream: "#FFF8EA",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
      borderRadius: {
        blob: "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
