/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#2D2727",
          200: "#403d39",
          300: "#5e503f",
        },
        secondary: {
          100: "#00DFA2",
          200: "#508D69",
        },
        third: {
          100: "#9ADE7B",
          200: "#508D69",
          300: "#C7DCA7",
        },
      },
      height: {
        "dynamic-screen": "100dvh",
        "app-height": "calc(100dvh - 70px)",
      },
    },
  },
  plugins: [],
};
