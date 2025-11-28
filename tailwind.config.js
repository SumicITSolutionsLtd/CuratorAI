/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Updated brand colors
        brand: {
          charcoal: '#111111',
          ivory: '#F8F8F8',
          crimson: '#D72638',
          blue: '#3A6FF7',
          gray: '#7A7A7A',
          beige: '#E8E2D3',
        },
        // shadcn/ui compatible colors mapped to brand
        border: '#E8E2D3',
        input: '#E8E2D3',
        ring: '#3A6FF7',
        background: '#F8F8F8',
        foreground: '#111111',
        primary: {
          DEFAULT: '#D72638',
          foreground: '#F8F8F8',
        },
        secondary: {
          DEFAULT: '#3A6FF7',
          foreground: '#F8F8F8',
        },
        destructive: {
          DEFAULT: '#D72638',
          foreground: '#F8F8F8',
        },
        muted: {
          DEFAULT: '#E8E2D3',
          foreground: '#7A7A7A',
        },
        accent: {
          DEFAULT: '#3A6FF7',
          foreground: '#F8F8F8',
        },
        popover: {
          DEFAULT: '#F8F8F8',
          foreground: '#111111',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111111',
        },
      },
      fontFamily: {
        logo: ['Playfair Display', 'serif'], // For logo & tagline
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'], // For headings
        inter: ['Inter', 'sans-serif'], // For body text
        sans: ['Inter', 'sans-serif'], // Default sans-serif
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
