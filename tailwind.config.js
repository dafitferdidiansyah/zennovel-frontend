/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zen: {
          500: '#d9534f', // Warna Merah Khas NovelBin
          600: '#c9302c',
        }
      },
      fontFamily: {
        sans: ['Roboto Condensed', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}