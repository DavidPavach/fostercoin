/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.{ejs,js}", "./views/partials/**/*.ejs"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      "2xl": "1400px",
    },
    extend: {
      colors: {
        primaryBlue: "#12a2e8",
        primaryGreen: "#3ea13f",
        textColor: "#0c0d45",
        darkWhite: "#d7dadb",
        darkBlue: "#1f62b8",
        accentGreen: "#97c687",
        lightBlack: "#080708",
        blueishWhite: "#F4F6FF"
      }
    },
  },
  plugins: [],
}

