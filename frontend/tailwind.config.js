/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['CustomFont', 'sans-serif'], // Replace 'CustomFont' with the actual name of your custom font
        body: ['BodyFont', 'sans-serif'], // Replace 'BodyFont' with the actual name of your body font
      },
      colors: {
        primary: '#BB7458',   // Example of a custom color
        secondary: '#939580', // Another custom color
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
