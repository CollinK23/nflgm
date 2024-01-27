/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0e0e0e",
        secondary: "#1F1F1F",
        blue: "#4295F1",
        dimWhite: "#EFF4F8",
        dimBlue: "#72ADDF",
        grey: "#757575",
        red: "#ff0000",
        green: "#00AC1A",
        pink: "#5c57b7",
        darkGrey: "#353535",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [require("daisyui")],
};
