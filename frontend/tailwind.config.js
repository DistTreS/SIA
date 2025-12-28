export default {
  content: ["./views/**/*.ejs", "./public/assets/**/*.js"],
  theme: {
    extend: {
      colors: {
        sand: "#f6f1e9",
        latte: "#fdfaf5",
        ink: "#1f1a15",
        muted: "#6b5f55",
        accent: "#c85a2c",
        "accent-dark": "#9a411f",
        sage: "#7a8c63",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(31, 26, 21, 0.12)",
      },
      fontFamily: {
        space: ["\"Space Grotesk\"", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
