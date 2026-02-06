/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3ff",
          100: "#d9e3ff",
          200: "#b2c6ff",
          300: "#8aa8ff",
          400: "#638bff",
          500: "#3b6dff",
          600: "#2e55cc",
          700: "#223f99",
          800: "#152866",
          900: "#0b1533"
        }
      }
    }
  },
  plugins: []
};

