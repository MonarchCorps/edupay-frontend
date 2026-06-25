const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        'brand-dark':   '#0D3D3D',
        'brand-mid':    '#1A6B6B',
        'brand-light':  '#E6F4F4',
        'accent':       '#D4AF37',
        'accent-light': '#FDF7E3',
        tremor: {
          brand: {
            faint:    '#E6F4F4',
            muted:    '#B2D8D8',
            subtle:   '#1A6B6B',
            DEFAULT:  '#0D3D3D',
            emphasis: '#0A3030',
            inverted: '#FFFFFF',
          },
        },
      },
      boxShadow: {
        'tremor-input':    '0 1px 2px rgba(0,0,0,0.05)',
        'tremor-card':     '0 4px 6px rgba(0,0,0,0.07)',
        'tremor-dropdown': '0 10px 15px rgba(0,0,0,0.10)',
      },
      borderRadius: {
        'tremor-small':   '6px',
        'tremor-default': '12px',
        'tremor-full':    '9999px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
