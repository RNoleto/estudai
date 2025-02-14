/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#2EC1CB',
        secondary: '#AFEBEF',
        tertiary: '#3AB3BB',
        baseGreen: '#00B884',
        hoverGreen: '#42D3DD',
        baseBlue: '#3E73ED',
        baseYellow: "#C1CB2E",
        secYellow: '#EFEDAF',
        baseRed: '#CB2E2E',
        secRed: '#EFAFAF',
        terRed: '#FF5675',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

