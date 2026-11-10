import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink) / 0.62)',
          faint: 'rgb(var(--ink) / 0.42)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent) / 0.14)',
        },
        ok: 'rgb(var(--ok) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        hairline: 'rgb(255 255 255 / 0.08)',
      },
      boxShadow: {
        window:
          '0 0 0 0.5px rgb(255 255 255 / 0.14), 0 30px 80px -12px rgb(0 0 0 / 0.75), 0 12px 28px -8px rgb(0 0 0 / 0.5)',
        'window-inactive': '0 0 0 0.5px rgb(255 255 255 / 0.1), 0 18px 50px -12px rgb(0 0 0 / 0.6)',
        popover: '0 0 0 0.5px rgb(255 255 255 / 0.14), 0 20px 50px -10px rgb(0 0 0 / 0.7)',
        card: 'inset 0 1px 0 0 rgb(255 255 255 / 0.05), 0 0 0 1px rgb(255 255 255 / 0.06)',
      },
      transitionTimingFunction: {
        mac: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        blink: 'blink 1.1s step-end infinite',
        breathe: 'breathe 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
