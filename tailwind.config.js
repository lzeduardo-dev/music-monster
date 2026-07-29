/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b1220',
          800: '#0f172a',
          700: '#111a2e',
          600: '#1a2440',
          500: '#243154'
        },
        accent: {
          coral: '#f472b6',
          amber: '#c084fc',
          emerald: '#818cf8',
          blue: '#3b82f6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
}
