/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Dark Theme
        dark: {
          50: '#f8fafc',
          100: '#1e1e2e',
          200: '#16161e',
          300: '#0f0f14',
          400: '#0a0a0f',
          500: '#050508',
        },
        // Accent Colors
        accent: {
          blue: '#38bdf8',
          indigo: '#6366f1',
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#22d3ee',
        },
        // Neon Colors
        neon: {
          blue: '#38bdf8',
          purple: '#a855f7',
          pink: '#f472b6',
          green: '#34d399',
          orange: '#fb923c',
          cyan: '#22d3ee',
        },
        // Surface Colors
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Glass Effect
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(56, 189, 248, 0.1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(168, 85, 247, 0.1) 0px, transparent 50%)
        `,
        'hero-gradient': 'linear-gradient(135deg, #0f0f14 0%, #16161e 50%, #1e1e2e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'neon-gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        'blue-gradient': 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
        'purple-gradient': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.2)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
        'neon-pink': '0 0 20px rgba(244, 114, 182, 0.4), 0 0 40px rgba(244, 114, 182, 0.2)',
        'neon-green': '0 0 20px rgba(52, 211, 153, 0.4), 0 0 40px rgba(52, 211, 153, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        '3d': '20px 20px 60px rgba(0, 0, 0, 0.4), -5px -5px 20px rgba(255, 255, 255, 0.02)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'gradient': 'gradient 8s ease infinite',
        'orbit': 'orbit 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
