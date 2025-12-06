/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
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

      // Animações usadas no layout
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideIn: "slideIn 0.4s ease-out forwards",
        bounceSoft: "bounceSoft 2s infinite",
        pulseSoft: "pulseSoft 2s infinite",
      },

      boxShadow: {
        card: "0 8px 25px rgba(0,0,0,0.2)",
        glow: "0 0 25px rgba(255,107,53,0.4)",
      },

      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
