/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{astro,html,md,mdx,js,vue}',
    'node_modules/**/*.{html,vue}' // required for astro project
  ],
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {};

      newUtilities[".px-shell"] = {
        paddingLeft: "1rem",
        paddingRight: "1rem",
      };

      newUtilities[".px-container"] = {
        maxWidth: "1280px",
        margin: "0 auto",
        paddingLeft: "1rem",
        paddingRight: "1rem",
    };

      newUtilities["@media (min-width: 768px)"] = {
        ".px-shell": {
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        },
        ".px-container": {
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
  important: true,
  darkMode: 'class',
  theme: {
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman'
    },
    extend: {
      colors: {
        header: '#171717',
        'header-input': '#292929',
        'header-button-enabled': '#ffffff32',
        'header-button-hover': 'rgba(244, 244, 244, 0.04)',
        'header-avatar': '#363636',
        footer: '#1e1e1e'
      },
      fontFamily: {
        'mono': 'Roboto Mono',
      },
      borderColor: {
        header: '#3e3e3e',
        'header-hover': '#F3652B'
      },
      textColor: {
        header: '#b5b5b5',
        footer: '#CCCCCC'
      },
      transitionProperty: {
        width: 'width'
      },
      width: {
        slide: '300px'
      },
      animation: {
        fadeIn: 'fadeIn 220ms ease-in-out',
        fadeOut: 'fadeOut 220ms ease-in-out'
      },
      container: {
        padding: {
          DEFAULT: '.75rem',
          sm: '2rem',
          xl: '5rem',
          '2xl': '10rem'
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      }
    }
  }
}
