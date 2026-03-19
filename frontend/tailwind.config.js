/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        focusDark: '#121212',      // Deep dark background
        focusCard: '#1E1E1E',      // Slightly lighter dark for cards
        focusOrange: '#E65100',    // Bold dark orange
        focusPurple: '#4C1D95',    // Deep violet/purple
        focusText: '#E5E7EB',      // High contrast light grey/white
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}