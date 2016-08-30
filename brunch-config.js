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
    },
    postcss: {
      processors: [ require('autoprefixer')(["last 2 version", "> 1%"]) ]
    },
    autoReload: {
      match: {
        stylesheets: ['*.scss', '*.css', '*.jpg', '*.png'],
        javascripts: ['*.js']
      }
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
