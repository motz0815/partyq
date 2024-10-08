import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
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
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
                mono: ["var(--font-geist-mono)", ...fontFamily.mono],
            },
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                rotate: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                rotate: "rotate 120s linear infinite",
            },
            animationDelay: {
                "10000": "10000ms",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        // this plugin makes backdrop-blur work on Safari
        plugin(function ({
            addUtilities,
        }: {
            addUtilities: (utilities: any, variants: any) => void
        }) {
            const newUtilities = {
                ".backdrop-blur-none": {
                    "backdrop-filter": "blur(0px)",
                    "-webkit-backdrop-filter": "blur(0px)",
                },
                ".backdrop-blur-sm": {
                    "backdrop-filter": "blur(4px)",
                    "-webkit-backdrop-filter": "blur(4px)",
                },
                ".backdrop-blur": {
                    "backdrop-filter": "blur(8px)",
                    "-webkit-backdrop-filter": "blur(8px)",
                },
                ".backdrop-blur-md": {
                    "backdrop-filter": "blur(12px)",
                    "-webkit-backdrop-filter": "blur(12px)",
                },
                ".backdrop-blur-lg": {
                    "backdrop-filter": "blur(16px)",
                    "-webkit-backdrop-filter": "blur(16px)",
                },
                ".backdrop-blur-xl": {
                    "backdrop-filter": "blur(24px)",
                    "-webkit-backdrop-filter": "blur(24px)",
                },
                ".backdrop-blur-2xl": {
                    "backdrop-filter": "blur(40px)",
                    "-webkit-backdrop-filter": "blur(40px)",
                },
                ".backdrop-blur-3xl": {
                    "backdrop-filter": "blur(64px)",
                    "-webkit-backdrop-filter": "blur(64px)",
                },
            }

            addUtilities(newUtilities, ["responsive", "hover"])
        }),
    ],
} satisfies Config

export default config
