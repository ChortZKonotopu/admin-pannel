/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        monserat: ['Montserrat', 'ui-sans-serif']
      },
      colors: {
        'blue': '#0C1A49',
        'light-blue': '#7896E3',
        'orange': '#EBAC77',
        'green-100': '#0EAA00',
        'green': '#7FEF75',
        'red': '#FF0000',
        'red-100': '#EF9797',
      }
    },
  },
  plugins: [],
}