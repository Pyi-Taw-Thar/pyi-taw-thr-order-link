/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007FFF',
          light: '#007FFF',
          dark: '#014E9C',
          50: '#E6F0F9',
          100: '#CCE2F3',
          200: '#99C5E7',
          300: '#66A7DB',
          400: '#338ACF',
          500: '#014E9C', // main
          600: '#013D7A',
          700: '#012C57',
          800: '#001B35',
          900: '#000A12',
        },
      },
      fontFamily: {
        sans: ['ChivoMono', 'monospace'],
        mono: ['ChivoMono', 'monospace'],
        ChivoMono: ['ChivoMono', 'monospace'],
      },
    },
  },
  plugins: [],
};
