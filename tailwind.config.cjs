// Loaded by Tailwind v4 via `@config` in src/styles/main.css.
// Self-contained copy of the theme that azion-webkit@1's tailwind.config.js
// used to provide (its plugins used v3-only APIs and its custom classes now
// live in src/styles/main.css). Remove alongside the webkit v4 migration.
const { primitiveColors } = require('azion-theme/src/tokens/colors-primitive');

module.exports = {
  darkMode: 'class',
  theme: {
    screens: {
      'xxs': '0px',
      'xs': '360px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1200px',
      'xxl': '1366px',
      'xxxl': '1600px',
    },
    extend: {
      fontFamily: {
        'mono': 'Roboto Mono',
      },
      colors: {
        ...primitiveColors
      },
      // Note: v3 had a `container.padding` customization here, but the
      // `.container` class is unused in this codebase and custom `screens` +
      // `container` crashes Tailwind v4's config compat layer.
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
      maxWidth: {
        'xxs': '0px',
        'xs': '360px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1200px',
        'xxl': '1366px',
        'xxxl': '1600px',
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
          }
        }
      }
    }
  }
}
