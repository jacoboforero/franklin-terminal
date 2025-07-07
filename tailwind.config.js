/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        scholar: {
          black: "#0a0a0a",
          dark: "#1a1a1a",
          charcoal: "#2a2a2a",
          gold: "#f4d03f",
          "gold-light": "#f7dc6f",
          "gold-dark": "#d68910",
          gray: "#4a4a4a",
          "gray-light": "#6a6a6a",
          "gray-dark": "#2a2a2a",
          cream: "#f8f8f2",
          "cream-light": "#ffffff",
          "cream-dark": "#d4d4c8",
          "cream-muted": "#a8a89e",
          accent: "#e67e22",
          "accent-light": "#f39c12",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.2" }],
        sm: ["0.875rem", { lineHeight: "1.4" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.3" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
};
