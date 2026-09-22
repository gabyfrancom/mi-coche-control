/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif']
      },
      colors: {
        violet: {
          950: '#0D0818',
          900: '#150C28',
          850: '#17102B',
          800: '#1B1230',
          700: '#241242',
          600: '#3B1E78',
          500: '#6D28D9',
          400: '#8B5CF6',
          300: '#A855F7',
          200: '#A78BFA',
          100: '#C4B5FD',
          50: '#F7F3FF'
        },
        amber: {
          DEFAULT: '#FDB022',
          dark: '#F59E0B'
        },
        status: {
          green: '#34D399',
          greenLight: '#22C55E',
          yellow: '#FBBF24',
          yellowLight: '#EAB308',
          red: '#FB7185',
          redLight: '#EF4444'
        }
      },
      borderRadius: {
        xl2: '22px'
      }
    }
  },
  plugins: []
}
