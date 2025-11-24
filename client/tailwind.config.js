/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'govt-orange': '#FF9933', // Saffron
        'govt-green': '#138808',  // India Green
        'govt-blue': '#000080',   // Chakra Blue
      }
    },
  },
  plugins: [],
}