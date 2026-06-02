import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(129, 140, 248, 0.2), 0 20px 50px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 32%), linear-gradient(180deg, rgba(15, 23, 42, 0.15), transparent 60%)',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
