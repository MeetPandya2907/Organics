/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FitTree Organics — palette drawn from the product photography itself:
        // turmeric gold, masoor-red rust, muted cardamom-olive, roasted-cumin brown.
        'fittree-bg': '#F6EFDF',        // Besan (chickpea flour) ivory — warm, not grey-cream
        'fittree-primary': '#6B6F45',   // Muted cardamom-olive — replaces bright forest green
        'fittree-dark': '#362A1D',      // Roasted cumin brown — headers/footer/dark sections
        'fittree-light': '#EEE3C8',     // Warm ivory-tan section tint
        'fittree-text': '#2B2013',      // Ink — warm near-black
        'fittree-text-light': '#8A7B65',// Muted warm grey-brown for secondary copy
        'fittree-border': '#E3D6B8',    // Warm tan border
        'fittree-orange': '#CC9A34',    // Turmeric gold — primary accent
        'fittree-orange-dark': '#A87B22',
        'fittree-pink': '#A3402B',      // Masoor-red / rust — secondary accent
        'fittree-pink-dark': '#812F1D',
        'fittree-yellow': '#E4C169',    // Lighter turmeric highlight

        // Legacy token names (still referenced across the app) — same palette
        paper: '#F6EFDF',
        ink: '#2B2013',
        turmeric: '#CC9A34',
        'turmeric-light': '#E4C169',
        'turmeric-dark': '#A87B22',
        forest: '#6B6F45',
        leaf: '#8B9157',
        charcoal: '#362A1D',
        'glass-bg': 'rgba(246, 239, 223, 0.85)',
        'glass-border': 'rgba(255, 255, 255, 0.5)',
        'glass-dark-bg': 'rgba(54, 42, 29, 0.85)',
        'glass-dark-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'fittree-sm': '0 4px 20px rgba(54,42,29,0.05)',
        'fittree-md': '0 8px 30px rgba(54,42,29,0.08)',
        'fittree-lg': '0 16px 40px -12px rgba(54,42,29,0.14)',
        'fittree-xl': '0 24px 50px -12px rgba(54,42,29,0.18)',
        'glow': '0 0 30px rgba(204,154,52,0.25)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
