/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,vue,ts}", "./pages/**/*.vue"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1152px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "fantasy-light": "#fbf3f4",
        "fantasy-plain": "#f2d1d3",
        "fantasy-dark": "#d8757c",
        "gray-dark": "#767676",
        "gray-light": "#f4f4f4",
        "thunderbird-red": "#be1925",
        "thunderbird-red-light": "#e31826",
      },
      scale: {
        101: "1.01",
      },
      gridTemplateColumns: {
        "index-xs": "repeat(auto-fill, minmax(100%, 1fr))",
        index: "repeat(auto-fill, minmax(320px, 1fr))",
      },
      width: {
        content: "var(--w-content)",
        container: "var(--w-container)",
      },
      maxWidth: {
        content: "var(--w-content)",
        container: "var(--w-container)",
      },
    },
  },
};
