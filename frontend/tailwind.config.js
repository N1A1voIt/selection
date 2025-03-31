/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BB7458',   // Example of a custom color
        secondary: '#33A1FF', // Another custom color
        myColor: '#123456',   // You can name your color whatever you want
        mocha: '#C4A380',
        transparentPink: '#F2C1C480',
        transparentOrange: '#FEA85F80',
        coral: '#F48B76',
      },

    },
  },
  plugins: [],
}
