/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Nexoris: sacada del logo de la consultora.
        //   500 = #2787e5  azul del isotipo
        //   900 = #04223d  azul marino del logotipo
        // El resto es la rampa entre esos dos y el blanco. Los grises del
        // sistema (slate) quedan como neutros.
        brand: {
          50: '#f4f9fe',
          100: '#e5f1fc',
          200: '#c7e0f8',
          300: '#9cc8f3',
          400: '#63a9ec',
          500: '#2787e5',
          600: '#1f71c0',
          700: '#185d9e',
          800: '#11487d',
          900: '#04223d',
          950: '#021524',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
      },
    },
  },
  plugins: [],
}
