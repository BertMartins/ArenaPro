/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: "#FF6B35",
          orange2: "#F7931E",
          blue: "#1E40AF",
          yellow: "#F59E0B",
        },
        dark: {
          bg: "#0F172A",
          card: "#1E293B",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideIn: "slideIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
