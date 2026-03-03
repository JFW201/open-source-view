/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        waldorf: {
          bg: "#0a0a0f",
          surface: "#12121a",
          "surface-bright": "#1a1a28",
          border: "#1e1e2e",
          "border-bright": "#2a2a3e",
          text: "#e4e4e7",
          "text-dim": "#71717a",
          accent: "#3b82f6",
          "accent-bright": "#60a5fa",
          danger: "#ef4444",
          warning: "#f59e0b",
          success: "#22c55e",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
