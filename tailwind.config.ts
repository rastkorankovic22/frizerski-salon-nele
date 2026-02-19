import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nele: {
          black: '#0a0a0a',
          coal: '#141414',
          graphite: '#1a1a1a',
          gold: '#c9a227',
          'gold-light': '#e6c547',
          'gold-dark': '#9a7b1a',
          cream: '#f5f0e6',
          sand: '#e8e0d0',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'nele': '0 4px 20px rgba(201, 162, 39, 0.15)',
        'nele-lg': '0 10px 40px rgba(201, 162, 39, 0.2)',
        'gold-glow': '0 0 30px rgba(201, 162, 39, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
