/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        logframe: {
          goal: {
            bg: '#e0e7ff',
            text: '#3730a3',
            border: '#c7d2fe',
            bar: '#4f46e5'
          },
          outcome: {
            bg: '#ccfbf1',
            text: '#115e59',
            border: '#99f6e4',
            bar: '#0d9488'
          },
          output: {
            bg: '#d1fae5',
            text: '#065f46',
            border: '#a7f3d0',
            bar: '#059669'
          },
          activity: {
            bg: '#fef3c7',
            text: '#92400e',
            border: '#fde68a',
            bar: '#d97706'
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'micro': '0 1px 2px 0 rgba(15, 118, 110, 0.05)',
        'soft': '0 4px 20px -2px rgba(13, 148, 136, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(15, 118, 110, 0.07)',
      }
    },
  },
  plugins: [],
}
