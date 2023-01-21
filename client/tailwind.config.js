/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "layers",
  content: ["./pages/*", "./components/*"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
