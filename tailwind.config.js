/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        //Primary
        "a-1": "#E148F2",
        "a-2": "#A3D800",
        "a-3": "#861E91",
        //secondary
        "b-2": "#222222"
      },
    },
  },
  plugins: [],
}
