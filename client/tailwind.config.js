/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F9FA',      // Very light, clean grey/white
        ink: '#0F172A',        // Deep slate for text
        turmeric: '#F59E0B',   // Vibrant Amber/Gold
        'turmeric-light': '#FCD34D',
        'turmeric-dark': '#D97706',
        forest: '#064E3B',     // Deep rich emerald/forest green
        leaf: '#10B981',       // Vibrant leaf green
        charcoal: '#1E293B',   // Slate gray
        'glass-bg': 'rgba(255, 255, 255, 0.65)',
        'glass-border': 'rgba(255, 255, 255, 0.5)',
        'glass-dark-bg': 'rgba(15, 23, 42, 0.7)',
        'glass-dark-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'], 
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
