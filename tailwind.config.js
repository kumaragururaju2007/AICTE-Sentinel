/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sentinel: {
          navy: '#102A56',
          royal: '#1769E0',
          purple: '#7738E8',
          green: '#159B68',
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          dark: '#0B1728'
        },
        theme: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          border: 'var(--border-color)',
          glass: 'var(--glass-background)',
          glassBorder: 'var(--glass-border)',
          input: 'var(--input-background)',
          tableHeader: 'var(--table-header-background)',
          hover: 'var(--hover-background)',
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
          },
          accent: {
            DEFAULT: 'var(--accent-primary)',
            hover: 'var(--accent-hover)',
          }
        },
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#080d1a',
        }
      }
    }
  },
  plugins: [],
}

