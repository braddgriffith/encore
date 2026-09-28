import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0b0a",
        paper: "#f3ecdf",
        gold: "#e6b15a",
        ember: "#ff5a36",
        moss: "#b7d7a8",
        mist: "#b7aea3",
        card: "#161311",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-oswald)", "ui-sans-serif", "sans-serif"],
        serif: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        phone: "390px",
      },
    },
  },
  plugins: [],
};

export default config;
