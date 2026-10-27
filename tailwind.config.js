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
      // BottomSheet ဖွင့်ချိန် animation (prefers-reduced-motion တွင် motion-safe ဖြင့် ဖယ်)
      keyframes: {
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'sheet-pop': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 260ms cubic-bezier(0.32, 0.72, 0, 1)',
        'sheet-pop': 'sheet-pop 180ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
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
