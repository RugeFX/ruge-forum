import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";
import tailwindTypography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Pacifico", "cursive"]
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 500ms cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: [tailwindAnimate, tailwindScrollbar, tailwindTypography]
} satisfies Config;
