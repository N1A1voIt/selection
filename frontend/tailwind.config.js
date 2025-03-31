/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BB7458',   // Example of a custom color
        secondary: '#939580', // Another custom color
        myColor: '#123456',   // You can name your color whatever you want
      },

    },
  },
  plugins: [],
}
