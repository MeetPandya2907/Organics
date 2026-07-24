/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FitTree Organics — Vibrant D2C E-commerce Design
        'fittree-bg': '#F8FAFC',          // Clean slate background
        'fittree-surface': '#FFFFFF',     // Pure white surface
        'fittree-primary': '#16A34A',     // Vibrant Emerald Green
        'fittree-primary-soft': '#15803D',
        'fittree-dark': '#111827',        // Sharp dark gray text
        'fittree-light': '#F0FDF4',       // Soft green background
        'fittree-sand': '#F3F4F6',        // Clean gray for cards
        'fittree-cream': '#FBF6EC',        // Warm paper tone for editorial sections
        'fittree-paper': '#F6F0E2',        // Deeper warm paper for contrast blocks
        'fittree-forest': '#0E2B1C',       // Deep on-brand green for dark sections
        'fittree-forest-light': '#173D28', // Lighter deep green for card fills on forest bg
        'fittree-text': '#111827',        // High contrast text
        'fittree-text-light': '#6B7280',  // Legible secondary text
        'fittree-border': '#E5E7EB',      // Clean borders
        'fittree-accent': '#EA580C',      // Vibrant Orange for sale tags/badges
        'fittree-accent-dark': '#C2410C', 
        'fittree-accent-light': '#FFEDD5',// Soft orange wash
        'fittree-pink': '#EF4444',        // Red for errors/alerts
        'fittree-pink-dark': '#B91C1C',
        
        // Legacy fallbacks
        'fittree-orange': '#F97316',
        'fittree-orange-dark': '#C2410C',
        'fittree-yellow': '#FEF08A',

        // Legacy token names still referenced on some older pages — aliased
        // to the current palette so those pages stay styled correctly.
        paper: '#F8FAFC',
        ink: '#111827',
        forest: '#16A34A',
        turmeric: '#EA580C',
        'turmeric-light': '#FFEDD5',
        'turmeric-dark': '#C2410C',
        leaf: '#15803D',
        charcoal: '#111827',
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
      },
      boxShadow: {
        'fittree-sm': '0 4px 20px -2px rgba(4,47,26,0.03)',
        'fittree-md': '0 12px 30px -4px rgba(4,47,26,0.06)',
        'fittree-lg': '0 24px 50px -12px rgba(4,47,26,0.1)',
        'fittree-xl': '0 35px 80px -15px rgba(4,47,26,0.15)',
        'glow': '0 0 40px -10px rgba(212,175,55,0.4)',
        'glass': '0 8px 32px 0 rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal': 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', clipPath: 'inset(100% 0 0 0)' },
          '100%': { opacity: '1', clipPath: 'inset(0 0 0 0)' },
        },
      },
    },
  },
  plugins: [],
}
