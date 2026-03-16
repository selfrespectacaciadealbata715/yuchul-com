import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6c5ce7',
        success: '#00b894',
        danger: '#e17055',
        warning: '#fdcb6e',
        'dark-bg': '#0a0a0f',
        'dark-card': '#1a1a2e',
        'dark-border': '#2d2d44',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        'gradient-success': 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      },
      backdropFilter: {
        glass: 'blur(10px)',
      },
    },
  },
  plugins: [],
};

export default config;
