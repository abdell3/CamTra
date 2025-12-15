/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-dark': '#0f172a',
        'primary-gradient-start': '#4c1d95',
        'primary-gradient-end': '#0d9488',
        accent: '#2dd4bf',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
      },
    },
  },
  plugins: [],
}