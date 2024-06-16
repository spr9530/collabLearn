/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryBackground: 'var(--primary-background)',
        secondaryBackground: 'var(--secondary-background)',
        secondaryText: 'var(--secondary-text)',
        primaryBlue: 'var(--primary-blue)',
        primaryGreen: 'var(--primary-green)'

      },
      boxShadow:{
        'primaryBoxShadow': 'rgb(255 255 255 / 10%) 0px 0px 5px 0px, rgb(255 255 255 / 10%) 0px 0px 1px 0px;'
      }
    },
  },
  plugins: [],
}

