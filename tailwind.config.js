/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F1A',
        gold: '#FFD166',
        orange: '#F15A24',
        purple: '#7B2CFF',
        green: '#22C55E',
        dark: '#1E2A36',
        muted: '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
