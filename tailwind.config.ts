import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        deal: {
          'teal-dark': '#04342C',
          'teal-primary': '#0F6E56',
          'accent-green': '#1D9E75',
          'navy-dark': '#042C53',
          'surface-light': '#E1F5EE',
          'ink': '#2C2C2A',
          'muted': '#5A6561',
          'border': '#CBDED7',
          'card-bg': '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '10px',
      },
    },
  },
  plugins: [],
};

export default config;
