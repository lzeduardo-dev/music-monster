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
        /* Nova paleta: azul = principal, amarelo = destaque/CTA, verde = progresso.
           As chaves antigas (coral/amber/emerald/blue) foram mantidas para nao
           quebrar os imports existentes, mas remapeadas para a paleta nova. */
        brand: {
          blue: '#2563eb',
          blueLight: '#3b82f6',
          blueOn: '#7dabff',
          yellow: '#eab308',
          yellowDeep: '#a16207',
          yellowOn: '#fde047',
          green: '#16a34a',
          greenDeep: '#15803d',
          greenOn: '#4ade80'
        },
        accent: {
          coral: '#eab308',
          amber: '#eab308',
          emerald: '#16a34a',
          blue: '#2563eb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.35)',
        cta: '0 0 34px rgba(234,179,8,0.35)'
      }
    }
  },
  plugins: []
}
