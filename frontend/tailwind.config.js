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
      danger: {
        100: "#fff5f5",
        200: "#d15959",
        300: "#cb4545",
        400: "#c53030",
        500: "#b12b2b",
        600: "#9e2626",
        700: "#8a2222",
        800: "#761d1d",
        900: "#631818",
      },
      success: {
        100: "#e6fffa",
        200: "#d15959",
        300: "#cb4545",
        400: "#234e52",
        500: "#234e52",
        600: "#9e2626",
        700: "#122729",
        800: "#761d1d",
        900: "#631818",
      },
    },
  },
  plugins: [],
};
