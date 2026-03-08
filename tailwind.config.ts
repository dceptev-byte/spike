import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        apple: {
          blue:        '#0071e3',
          'blue-hover':'#0077ed',
          black:       '#1d1d1f',
          'gray-1':    '#f5f5f7',
          'gray-2':    '#e8e8ed',
          'gray-3':    '#d2d2d7',
          'gray-4':    '#86868b',
          'gray-5':    '#515154',
          white:       '#ffffff',
        },
      },
      fontFamily: {
        heading: ['Geist', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
