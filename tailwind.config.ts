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
      }
    }
  },
  plugins: [tailwindAnimate, tailwindScrollbar, tailwindTypography]
} satisfies Config;
