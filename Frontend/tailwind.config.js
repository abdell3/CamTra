/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#0f172a', 
          light: '#1e293b',
        },
        brick: {
          DEFAULT: '#991b1b',
          light: '#b91c1c',
        },
        dark: '#000000',
        light: '#f8fafc',
        
 
        danger: '#ef4444', 
        warning: '#f97316',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}