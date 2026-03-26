/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A sophisticated tinted dark theme (Midnight/Slate mix)
        focusDark: '#0B0E14',      // Replaces #121212 - Deep midnight base
        focusCard: '#13161C',      // Replaces #1E1E1E - Subtle elevation
        focusCardHover: '#1A1E26', // For interactive elements
        focusBorder: '#232833',    // Soft border color to replace border-gray-800
        
        // Custom, slightly desaturated accents (less "neon")
        focusAccent: '#6366F1',    // Indigo (more professional than raw purple-500)
        focusOrange: '#E16B31',    // A warmer, terracotta/burnt orange
        focusBlue: '#3B82F6',      // A cleaner, less aggressive blue
        focusGreen: '#10B981',     // Soft emerald for completion states
        
        // Text hierarchy
        focusTextHeading: '#F8FAFC', // High contrast for titles
        focusText: '#CBD5E1',        // Soft gray/blue for body text (less eye strain)
        focusTextMuted: '#64748B',   // For secondary info
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}