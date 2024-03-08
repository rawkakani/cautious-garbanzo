/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'primary': '#0075c9',
        'secondary': {
          100: '#E2E2D5',
          200: '#888883',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

