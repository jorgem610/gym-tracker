/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        accent: {
          light: '#fb923c',
          DEFAULT: '#f97316',
          dark: '#c2410c',
        }
      }
    },
  },
  plugins: [],
}