import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        neon: {
          blue: "hsl(var(--neon-blue))",
          purple: "hsl(var(--neon-purple))",
          cyan: "hsl(var(--neon-cyan))",
          pink: "hsl(var(--neon-pink))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-in-bounce": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(270 100% 65% / 0.3), 0 0 40px hsl(270 100% 65% / 0.1)" 
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(270 100% 65% / 0.5), 0 0 80px hsl(270 100% 65% / 0.2)" 
          },
        },
        "text-glow-pulse": {
          "0%, 100%": { 
            textShadow: "0 0 10px hsl(270 100% 65% / 0.5), 0 0 20px hsl(270 100% 65% / 0.3)" 
          },
          "50%": { 
            textShadow: "0 0 20px hsl(270 100% 65% / 0.8), 0 0 40px hsl(270 100% 65% / 0.5)" 
          },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-rotate": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(3deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "blink": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "number-roll": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "particle-float": {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px)",
            opacity: "0.3" 
          },
          "25%": { 
            transform: "translateY(-30px) translateX(10px)",
            opacity: "0.8" 
          },
          "50%": { 
            transform: "translateY(-50px) translateX(-5px)",
            opacity: "0.5" 
          },
          "75%": { 
            transform: "translateY(-30px) translateX(-10px)",
            opacity: "0.8" 
          },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "page-exit": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-20px) scale(0.98)" },
        },
        "message-slide-in": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "message-slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in-down": "fade-in-down 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in-left": "fade-in-left 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in-right": "fade-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in-bounce": "scale-in-bounce 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-up": "slide-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-down": "slide-in-down 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "text-glow-pulse": "text-glow-pulse 2s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float-rotate": "float-rotate 8s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out infinite",
        "morph": "morph 8s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "typewriter": "typewriter 2s steps(40) forwards",
        "blink": "blink 1s step-end infinite",
        "number-roll": "number-roll 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "particle-float": "particle-float 10s ease-in-out infinite",
        "ripple": "ripple 0.6s ease-out",
        "page-enter": "page-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "page-exit": "page-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "message-slide-in": "message-slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "message-slide-in-right": "message-slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "orbit": "orbit 20s linear infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
