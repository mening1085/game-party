/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A1E",
        textLight: "#E0E0FF",
        primary: "#00F5FF",
        secondary: "#7B2CBF",
        accent: "#FF00FF",
      },
      fontFamily: {
        heading: ["Rajdhani", "sans-serif"],
        body: ["Roboto Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 5px #00F5FF, 0 0 15px #00F5FF, 0 0 25px #00F5FF",
        "neon-red": "0 0 5px #FF0000, 0 0 15px #FF0000, 0 0 25px #FF0000",
      },
      keyframes: {
        glow: {
          "0%, 100%": { textShadow: "0 0 10px rgba(0, 245, 255, 0.3)" },
          "50%": { textShadow: "0 0 20px rgba(0, 245, 255, 0.5)" },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
