import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'border-flow': 'border-flow 3s ease-in-out infinite',
        'border-flow-reverse': 'border-flow-reverse 4s linear infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideIn: 'slideIn 0.3s ease-in-out',
        'blob-1': 'blob1 15s infinite',
        'blob-2': 'blob2 18s infinite',
        'blob-3': 'blob3 20s infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'bg-fade-in': 'bgFadeIn 0.8s ease-out forwards',
        'bg-fade-out': 'bgFadeOut 0.8s ease-out forwards',
        'grid-fade-in': 'gridFadeIn 1s ease-out forwards',
        'grid-fade-out': 'gridFadeOut 1s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-400%)' },
          '100%': { transform: 'translateX(400%)' }
        },
        'border-flow': {
          '0%': {
            transform: 'translateX(-200%)',
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(200%)',
            opacity: '0'
          }
        },
        'border-flow-reverse': {
          '0%': { 
            transform: 'rotate(360deg)',
          },
          '100%': { 
            transform: 'rotate(0deg)',
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blob1: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '25%': {
            transform: 'translate(100px, -50px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(50px, 100px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(-50px, 50px) scale(1.05)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        blob2: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '25%': {
            transform: 'translate(-100px, 50px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(-50px, -100px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(50px, -50px) scale(1.05)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        blob3: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '25%': {
            transform: 'translate(50px, 100px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(-100px, 50px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(100px, -50px) scale(1.05)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        bgFadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(1.1)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        bgFadeOut: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(1.1)',
          },
        },
        gridFadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(1.2)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        gridFadeOut: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(1.2)',
          },
        },
      }
    },
  },
  plugins: [],
} satisfies Config;