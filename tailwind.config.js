/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kita daftarkan warna "zen" disini
        zen: {
          500: '#ffc107', // Kuning Emas
          600: '#e0a800', // Kuning Gelap
          800: '#252525', // Card Background
          900: '#1a1a1a', // Background Utama
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}