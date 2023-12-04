/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#222E35",
          200: "#111B21",
        },
        secondary: {
          100: "#06CF9C",
          200: "#005C4B",
        },
      },
      height: {
        "app-height": "calc(100dvh - 70px)",
      },
    },
  },
  plugins: [],
};
