import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FBF5EC',
          100: '#F5E6D3',
          200: '#EDD6BC',
        },
        dusty: {
          100: '#F5D6CF',
          200: '#F0C9C0',
          300: '#E2A89C',
          500: '#B96A5A',
        },
        ink: '#1A1614',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-med': 'float 9s ease-in-out infinite',
        'float-fast': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(var(--r,0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--r,0deg))' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
