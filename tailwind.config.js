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
        mono: ['"IBM Plex Mono"', ...fontFamily.mono],
      },
      colors: {
        // Locked design tokens — sourced from CSS variables in index.css so
        // there's a single place to tune the palette.
        paper:          'var(--bg-content)',
        sidebar:        'var(--bg-sidebar)',
        'accent-gold':  'var(--accent-gold)',
        'teal-mid':     'var(--teal-mid)',
        success:        'var(--success)',
        error:          'var(--error)',

        // Legacy semantic names kept so existing className usage across the
        // app repaints with the new palette without a mechanical rename.
        'brand-dark':   'var(--bg-sidebar)',
        'brand-mid':    'var(--teal-mid)',
        'brand-light':  'var(--bg-content)',
        'accent':       'var(--accent-gold)',
        'accent-light': '#F0E2BE',

        tremor: {
          brand: {
            faint:    '#FAF3E1',
            muted:    '#E8D2A0',
            subtle:   '#D9A94E',
            DEFAULT:  '#D9A94E',
            emphasis: '#B8863A',
            inverted: '#0B211D',
          },
          background: {
            muted:    '#F0EAD9',
            subtle:   '#F5F1E8',
            DEFAULT:  '#FAF7F0',
            emphasis: '#3A362C',
          },
          border: { DEFAULT: '#E5DFCF' },
          ring:   { DEFAULT: '#E5DFCF' },
        },
      },
      boxShadow: {
        'tremor-input':    '0 1px 2px rgba(11,33,29,0.06)',
        'tremor-card':     '0 2px 8px rgba(11,33,29,0.08)',
        'tremor-dropdown': '0 12px 24px rgba(11,33,29,0.14)',
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
