/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ini Warna Dasar Merah NovelBin yang Anda minta
        zen: {
          500: '#d9534f', // Merah Utama
          600: '#c9302c', // Merah Hover (lebih gelap)
        }
      },
      fontFamily: {
        sans: ['Roboto Condensed', 'sans-serif'], // Opsional: Biar font mirip NovelBin
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Pastikan ini ada untuk halaman baca (prose)
  ],
  darkMode: 'class',
}