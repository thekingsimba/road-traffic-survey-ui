import twForms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      colors: {
        regular: {
          DEFAULT: "#0A0C11"
        },
        primary: {
          DEFAULT: "#00629B",
          high: "#004F80",
          navy: "#00629B",
          blue: "#41B6E6",
          orange: "#FFA300",
          gray: "#63666A",
        },
        secondary: {
          DEFAULT: "#5B616D",
          low: "#8C929C"
        },
        error: {
          DEFAULT: "#F03D3D"
        }
      }
    },
  },
  plugins: [twForms],
}
