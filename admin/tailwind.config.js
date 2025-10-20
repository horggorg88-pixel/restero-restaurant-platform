/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        'lg2': '1200px',
      },
    },
    extend: {
      colors: {
        // Root CSS Variables
        1: "var(--1)",
        2: "var(--2)",
        3: "var(--3)",
        4: "var(--4)",
        5: "var(--5)",
        6: "var(--6)",
        7: "var(--7)",
        8: "var(--8)",
        9: "var(--9)",
        10: "var(--10)",
      },
      backgroundColor: {
        background: 'var(--background)',
        'rgba-gray': 'rgba(204, 204, 204, 0.24)',
      },
      textColor: {
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        'tr-bl-lg': '0 8px 0 8px',
      },
      backdropFilter: {
        'blur-8': 'blur(8px)',
      },
      boxShadow: {
        light: '0 8px 8px -6px rgba(0, 0, 0, 0.08)',
        custom: '0 8px 8px -6px rgba(0, 0, 0, 0.24)',
        lightGray: '0 1px 4px 0 rgba(62, 65, 70, 0.2)',
        tableShadow: 'box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        'custom-light': '5px 4px 8px 0 #c2c6ce',
      },
      backgroundImage: {
        'gradient-shadow' : 'linear-gradient(180deg, rgba(50, 41, 65, 0) 0%, #322941 100%)',
        'gradient-purple':
          'linear-gradient(180deg, #a046ff 0%, rgba(70, 104, 255, 0) 100%), url("@assets/images/profile/1.jpg")',
        'gradient-green':
          'linear-gradient(180deg, #08a400 0%, rgba(8, 164, 0, 0) 100%), url("@assets/images/profile/2.jpg")',
        'gradient-blue':
          'linear-gradient(180deg, #2462fd 0%, rgba(36, 50, 253, 0) 100%), url("@assets/images/profile/3.jpg")',
        'gradient-red':
          'linear-gradient(180deg, #d95656 0%, rgba(217, 130, 86, 0) 100%), url("@assets/images/profile/4.jpg")',
        'gradient-teal':
          'linear-gradient(180deg, #17a8aa 0%, rgba(23, 170, 148, 0) 100%), url("@assets/images/profile/5.jpg")',
        'gradient-light-blue':
          'linear-gradient(180deg, #4099c6 0%, rgba(64, 153, 198, 0) 100%), url("@assets/images/profile/6.jpg")',
        'gradient-orange':
          'linear-gradient(180deg, #eb8100 0%, rgba(235, 219, 0, 0) 100%), url("@assets/images/profile/7.jpg")',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'count-up': 'countUp 1s ease-out forwards',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.rounded-tr-bl-lg': {
          borderTopRightRadius: '8px',
          borderBottomLeftRadius: '8px',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
