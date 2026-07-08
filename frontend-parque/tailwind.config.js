/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        aqua: {
          50: "#f0fbff",
          100: "#e0f6ff",
          200: "#b9eeff",
          300: "#7de2ff",
          400: "#36d1fb",
          500: "#0cb8ed",
          600: "#0094cb",
          700: "#0075a3",
          800: "#056086",
          900: "#0a5070",
          950: "#06334a",
        },
        surf: {
          0: "#ffffff",
          50: "#f5faff",
          100: "#eaf5ff",
          200: "#d6edfa",
          300: "#b8dff0",
          400: "#8ccae0",
          500: "#60b2d0",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        base: {
          950: "#03050a",
          900: "#080d14",
          850: "#0c1420",
          800: "#111c2b",
          750: "#162336",
          700: "#1c2c42",
          600: "#243650",
          500: "#2d4060",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.35s ease-out both",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        shimmer: "shimmer 1.8s linear infinite",
        ripple: "ripple 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(12,180,230,0.06)",
        "card-hover": "0 4px 20px rgba(12,180,230,0.14)",
        aqua: "0 4px 20px rgba(12,180,230,0.25)",
        "aqua-lg": "0 8px 32px rgba(12,180,230,0.30)",
      },
    },
  },
  plugins: [],
};
