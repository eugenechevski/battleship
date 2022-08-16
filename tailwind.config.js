const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js,ts}', './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {
    screens: {
      xs: '420px',
      ...defaultTheme.screens,
    },
    extend: {
      screens: {
        sm: '576px',
      },
    },
    fontFamily: {
      main: ['Comic Neue', 'cursive'],
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('tw-elements/dist/plugin'),
  ],
};
