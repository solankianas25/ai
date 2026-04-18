import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A2240',
        'navy-2': '#0F3060',
        'navy-3': '#1a4a8a',
        saffron: '#E8821A',
        'saffron-2': '#F59E0B',
        white: '#ffffff',
        off: '#F7F6F3',
        'off-2': '#EEEDEA',
        text: '#1C1C1A',
        'text-2': '#52524E',
        'text-3': '#8A8A86',
        'border': 'rgba(0,0,0,0.1)',
        'border-2': 'rgba(0,0,0,0.18)',
        blue: '#185FA5',
        'blue-bg': '#E6F1FB',
        green: '#1D6A2D',
        'green-bg': '#EAF3DE',
        amber: '#7A4200',
        'amber-bg': '#FEF3DC',
        red: '#A32D2D',
        'red-bg': '#FCEBEB',
      },
      fontFamily: {
        sans: ['Mukta', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'sm': '8px',
        'lg': '12px',
      },
    },
  },
  plugins: [],
}

export default config
