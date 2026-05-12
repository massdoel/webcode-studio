/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        vscode: {
          bg:        '#1e1e1e',
          sidebar:   '#252526',
          panel:     '#2d2d2d',
          active:    '#37373d',
          border:    '#3c3c3c',
          accent:    '#569cd6',
          text:      '#d4d4d4',
          muted:     '#858585',
          success:   '#4ec9b0',
          warning:   '#dcdcaa',
          error:     '#f44747',
          string:    '#ce9178',
          keyword:   '#569cd6',
          comment:   '#6a9955',
        },
        design: {
          purple:  '#7f77dd',
          pink:    '#d4537e',
          teal:    '#1d9e75',
          amber:   '#ef9f27',
        },
      },
      animation: {
        'fade-in':     'fadeIn .2s ease',
        'slide-in':    'slideIn .2s ease',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-8px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
