/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#2EC1CB',
        secondary: '#AFEBEF'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

