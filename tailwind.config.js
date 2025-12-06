/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          "0%": { opacity: 0, transform: "scale(0.98)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        slideIn: {
          "0%": {
            opacity: 0,
            transform: "translateX(40px)"
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)"
          },
        },
      },
      animation: {
        fade: "fade .3s ease-in-out",
        slideIn: "slideIn .3s ease-out",
      },
    },
  },
  plugins: [],
};
