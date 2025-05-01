/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f1',
          100: '#dceede',
          200: '#bcddc1',
          300: '#93c69a',
          400: '#6aaa72',
          500: '#4a8d53',
          600: '#367042',
          700: '#295c35',
          800: '#224b2d',
          900: '#1d3f27',
          950: '#0f2415',
        },
        sage: {
          50: '#f5f7f0',
          100: '#e9ecdd',
          200: '#d4dbbc',
          300: '#bac596',
          400: '#a0ad71',
          500: '#8c9959',
          600: '#727a46',
          700: '#5b6139',
          800: '#4a4e31',
          900: '#3d412b',
          950: '#202317',
        },
      },
      backgroundImage: {
        'pattern-field': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0ad71' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 1s ease-in-out 2',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};