/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism Color Palette
        primary: '#FF6B35',      // Bold Orange
        secondary: '#FFD23F',    // Bold Yellow
        accent: '#00D9FF',       // Bright Cyan
        success: '#06FFA5',      // Neon Green
        danger: '#FF006E',       // Hot Pink
        dark: '#1A1A1A',         // Almost Black
        light: '#FFFFFF',        // Pure White
        gray: '#F5F5F5',         // Light Gray
      },
      boxShadow: {
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal': '6px 6px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
    },
  },
  plugins: [],
}
