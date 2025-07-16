/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
         'xs': '480px',
        '2xl': '1440px',
      },
      animation: {
        "spinner-grow": "spinner-grow 0.75s linear infinite", // Customize the duration here
      },
      keyframes: {
        "spinner-grow": {
          "0%": {
            transform: "scale(0)",
            backgroundColor: "#00c3a5",
          },
          "50%": {
            transform: "scale(1)",
            backgroundColor: "#ff6347",
          },
          "100%": {
            transform: "scale(0)",
            backgroundColor: "#00c3a5",
          },
        },
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
  ],
}