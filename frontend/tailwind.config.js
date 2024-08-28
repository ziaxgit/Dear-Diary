/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "sky-image": "url('/src/assets/sky.jpg')",
      },
    },
  },
  plugins: [],
};
