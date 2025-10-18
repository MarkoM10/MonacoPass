const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        racing: ['"Racing Sans One"', ...defaultTheme.fontFamily.sans],
        body: ['"Rajdhani"', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      primary: {
        100: "#db9ba3",
        200: "#ca6976",
        300: "#4eb7b2",
        400: "#a6051a",
        500: "#850415",
        600: "#640310",
        700: "#42020a",
        800: "#210105",
        900: "#000000",
      },
      secondary: "#ffeb00",
      background: "#F5F5F5",
      white: "#ffffff",
      black: "#000000",
      neutral: "#a7a7a7",
    },
  },
  plugins: [],
};
