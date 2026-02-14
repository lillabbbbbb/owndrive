/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // enable dark mode toggle
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: "hsl(var(--primary))",
                "primary-foreground": "hsl(var(--primary-foreground))",
                muted: "hsl(var(--muted))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
                error: "hsl(var(--error))",
            },
            borderRadius: {
                xl: "var(--radius)",
            },
        },
    },
  plugins: [],
};