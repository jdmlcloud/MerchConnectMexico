import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mc-white': '#ffffff',
        'mc-deep-navy': '#00043c',
        'mc-gray-100': '#e6e6e6',
        'mc-navy': '#00076f',
        'mc-near-black': '#000109',
      },
    },
  },
  plugins: [],
} satisfies Config;
