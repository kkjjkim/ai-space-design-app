import type { Config } from "tailwindcss";

// 디자인 토큰은 app/globals.css 의 CSS 변수 한 곳에서 정의하고 여기서 매핑한다.
// (AGENTS.md 9번: 색·폰트·간격·둥글기를 한 곳에 정의하고 전체에서 재사용)
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // AvroKO 포인트 1색 (골드/브론즈) 별칭
        gold: "hsl(var(--primary))",
      },
      fontFamily: {
        // 큰 제목·인용문 = 명조(세리프), 본문·버튼·메뉴 = Pretendard(산세리프)
        serif: ["var(--font-serif)", "Noto Serif KR", "serif"],
        sans: ["var(--font-sans)", "Pretendard", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        // 은은한 페이드인만 (AGENTS.md 9번: 무거운 효과 금지)
        "fade-in-up": "fade-in-up 0.7s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
