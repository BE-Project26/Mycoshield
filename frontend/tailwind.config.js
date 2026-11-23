/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { 50: '#f1f6f2', 100: '#dfeae1', 200: '#bfd5c4', 300: '#93b69b', 400: '#5f9170', 500: '#3d7352', 600: '#2c5a40', 700: '#244a35', 800: '#1d3b2b', 900: '#14291e', 950: '#0b1912' },
        bark: { 50: '#f7f5f1', 100: '#ece8df', 200: '#d9d1c0', 300: '#bfb299', 400: '#a2917a', 500: '#867660', 600: '#6b5d4c', 700: '#544a3d' },
        amberlt: '#c8923b',
        alert: '#b4483a'
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif']
      },
      boxShadow: { soft: '0 1px 2px rgba(20,41,30,.05), 0 8px 24px -12px rgba(20,41,30,.12)' },
      keyframes: {
        scan: { '0%,100%': { top: '0%' }, '50%': { top: '100%' } },
        rise: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } }
      },
      animation: { scan: 'scan 2.2s ease-in-out infinite', rise: 'rise .5s ease-out both' }
    }
  },
  plugins: []
};
