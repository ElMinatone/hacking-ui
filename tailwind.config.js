/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1ff4cf",
        "background-light": "#e2e8f0",
        "background-dark": "#050a0a",
        "terminal-bg": "#0a1414",
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0px",
      },
    },
  },
  plugins: [],
}

