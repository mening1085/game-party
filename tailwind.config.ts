import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        primary: "#00F0FF",
        secondary: "#8A8A8A",
        textLight: "#F0F0F0",
        accent: "#FF00FF",
      },
      fontFamily: {
        heading: ["Rajdhani", "sans-serif"],
        body: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
