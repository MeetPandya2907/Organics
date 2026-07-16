/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FitTree Organics — Premium Earthy Palette
        'fittree-bg': '#FAFAF8',        // Warm, light stone/beige for a natural feel
        'fittree-primary': '#2F4F2F',   // Deep sophisticated forest green (was bright leaf green)
        'fittree-dark': '#1C2920',      // Very dark moss, almost black, elegant text
        'fittree-light': '#F2F4ED',     // Soft sage tint for sections
        'fittree-text': '#2D332F',      // Soft dark grey-green for readable text
        'fittree-text-light': '#737D76',// Muted natural grey for secondary text
        'fittree-border': '#E4E8E1',    // Very subtle warm border
        'fittree-orange': '#D47B4A',    // Terracotta orange — earthy accent
        'fittree-orange-dark': '#B56033', // Deep terracotta
        'fittree-pink': '#C26A7A',      // Muted berry rose
        'fittree-pink-dark': '#9A4B5A',
        'fittree-yellow': '#D4A373',    // Soft warm ochre/sunshine

        // Legacy token names (re-mapped to elegant palette)
        paper: '#FAFAF8',
        ink: '#2D332F',
        turmeric: '#D4A373',
        'turmeric-light': '#E5B98D',
        'turmeric-dark': '#BA8757',
        forest: '#2F4F2F',
        leaf: '#4A704A',
        charcoal: '#1C2920',
        'glass-bg': 'rgba(250, 250, 248, 0.85)',
        'glass-border': 'rgba(255, 255, 255, 0.6)',
        'glass-dark-bg': 'rgba(28, 41, 32, 0.85)',
        'glass-dark-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'fittree-sm': '0 4px 20px rgba(28,41,32,0.03)',
        'fittree-md': '0 8px 30px rgba(28,41,32,0.05)',
        'fittree-lg': '0 16px 40px -12px rgba(28,41,32,0.08)',
        'fittree-xl': '0 24px 50px -12px rgba(28,41,32,0.12)',
        'glow': '0 0 30px rgba(47,79,47,0.15)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.06)',
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
