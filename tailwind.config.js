/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "w-16": 16,
        "h-9": 9,
      },
      colors: {
        sage: {
          50: "#f6f7f5",
          100: "#e6eae2",
          200: "#d0d9c9",
          300: "#b1c1a8",
          400: "#92a883",
          500: "#738b63",
          600: "#5c7250",
          700: "#495c41",
          800: "#3c4b37",
          900: "#344030",
          950: "#1a221a",
        },
        beige: {
          50: "#faf8f2",
          100: "#f5f0e4",
          200: "#ebe0c9",
          300: "#ddc9a5",
          400: "#cfb183",
          500: "#c39f6a",
          600: "#b8895d",
          700: "#96694a",
          800: "#7a5540",
          900: "#644739",
          950: "#352418",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite linear",
        "skeleton-pulse": "skeletonPulse 1.5s ease-in-out infinite",
        "photo-loading": "photoLoading 1.8s infinite ease-in-out",
        "pop-in": "popIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        skeletonPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
        photoLoading: {
          "0%": {
            backgroundPosition: "0% 0%",
            opacity: "0.5",
          },
          "25%": { opacity: "0.7" },
          "50%": {
            backgroundPosition: "100% 100%",
            opacity: "0.8",
          },
          "75%": { opacity: "0.7" },
          "100%": {
            backgroundPosition: "0% 0%",
            opacity: "0.5",
          },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.05)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        mountains: "url('/background.jpeg')",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      const aspectRatio = {
        ".aspect-w-16": {
          position: "relative",
          paddingBottom:
            "56.25%" /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */,
        },
        ".aspect-h-9": {
          position: "absolute",
          height: "100%",
          width: "100%",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
        },
      };
      addComponents(aspectRatio);
    }),
  ],
};
