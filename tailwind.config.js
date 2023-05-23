/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      width: {
        a4: '210mm',
      },
      height: {
        a4: '297mm',
      },
    },

  },
  plugins: [
      require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
}

