/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mezbanMaroon: '#5C190F', // The deep dark red from your image
        mezbanCream: '#F6F1E5',  // The light cream background
        mezbanGold: '#C5934E',   // The gold/brown button color
      },
    },
  },
  plugins: [],
}