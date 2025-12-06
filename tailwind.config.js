module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316",
        dark: "#0F172A",
        dark2: "#0B1120",
      },

      fontFamily: {
        title: ["Poppins", "sans-serif"],
      },

      backdropBlur: {
        xs: "2px",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        }
      },

      animation: {
        fadeIn: "fadeIn .5s ease-out forwards",
        slideIn: "slideIn .4s ease-out forwards",
        bounceSoft: "bounceSoft 2s infinite",
      },

      boxShadow: {
        glass: "0 0 20px rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
