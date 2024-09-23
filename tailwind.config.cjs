/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{astro,html,md,mdx,js,vue}',
    'node_modules/**/*.{html,vue}'
  ],
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities/*, variants*/ }) {
      const newUtilities = {};

      newUtilities[".px-shell"] = {
        paddingLeft: "1rem",
        paddingRight: "1rem",
      };
      newUtilities[".px-container"] = {
        maxWidth: "1360px",
        margin: "0 auto",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      };
      newUtilities["@media (min-width: 768px)"] = {
        ".px-shell": {
          paddingLeft: "2rem",
          paddingRight: "2rem",
        },
        ".px-container": {
          paddingLeft: "2rem",
          paddingRight: "2rem",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
  important: true,
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': '"Roboto Mono"',
      },
      borderColor: {
        header: '#3e3e3e',
        'header-hover': '#F3652B'
      },
      colors: {
        header: '#171717',
        'header-input': '#292929',
        'header-button-enabled': '#ffffff32',
        'header-button-hover': 'rgba(244, 244, 244, 0.04)',
        'header-avatar': '#363636',
        footer: '#1e1e1e'
      },
      textColor: {
        header: '#b5b5b5',
        footer: '#CCCCCC'
      },
      container: {
        padding: {
          DEFAULT: '.75rem',
          sm: '2rem',
          xl: '5rem',
          '2xl': '10rem'
        }
      },
      listStyleType: {
        none: 'none',
        disc: 'disc',
        decimal: 'decimal',
        square: 'square',
        roman: 'upper-roman'
      },
      width: {
        slide: '300px'
      },
      animation: {
        fadeIn: 'fadeIn 220ms ease-in-out',
        fadeOut: 'fadeOut 220ms ease-in-out',
        'pretty': 'pretty 4s ease-in-out infinite',
      },
      transitionProperty: {
        width: 'width'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'pretty': {
          '0%': {
            'background-size': '200% 200%',
            'background-position': 'left'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right'
          },
          '100%': {
            'background-size': '200% 200%',
            'background-position': 'left'
           },
        },
      }
    }
  }
}
