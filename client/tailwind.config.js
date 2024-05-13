/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "theme-gray": '#f8fafc',
        "theme-primary": "#2563eb",
        "theme-primary-dark": "#1e40af",
        dark: {
          DEFAULT: '#333333',
        },
        light: {
          DEFAULT: '#ffffff',
        }
      }
    },
    fontFamily: {
      'sans': 'Roboto, sans-serif',
    }
  },
  plugins: [],
}