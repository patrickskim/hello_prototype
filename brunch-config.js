exports.config = {
  files: {
    javascripts: {
      joinTo: 'js/app.js',
    },
    stylesheets: {
      joinTo: 'css/app.css',
    },
    templates: {
      joinTo: 'js/app.js',
    },
  },

  conventions: {
    assets: /^(src\/assets)/,
  },

  paths: {
    watched: ['src'],
    public: 'build',
  },

  plugins: {
    babel: {
      presets: ['es2015', 'stage-2', 'stage-0'],
      ignore: [/vendor/],
    },
    sass: {
      options: {
        includePaths: ['node_modules'],
      },
    }
  },

  modules: {
    autoRequire: {
      'js/app.js': ['src/js/app'],
    },
  },

  npm: {
    enabled: true,
    whitelist: [
      'jquery',
      'moment',
      'underscore',
    ],
  },
};
