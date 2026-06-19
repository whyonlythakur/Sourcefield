/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0E0F13',
        surface: '#16181D',
        border: '#26282E',
        accent: '#5865F2',
        success: '#23A55A',
        warning: '#F0B232',
        danger: '#ED4245',
        raid: '#9B59B6',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
