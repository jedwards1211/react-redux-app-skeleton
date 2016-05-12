var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var _ = require('lodash')

var stats = {
  colors: true,
  chunkModules: false,
  modules: false
}

module.exports = function(options) {
  options         = options || {}
  var argv        = require('yargs').argv

  // override anything in options with argv
  for (var key in argv) {
    if (argv[key] === 'false') argv[key] = false
    options[_.camelCase(key)] = argv[key]
  }

  var karma       = options.karma
  var watch       = options.watch        || false
  var mode        = options.mode         || process.env.NODE_ENV || 'development'
  var uglify      = options.uglify !== false
  var host        = options.host         || '0.0.0.0'
  var entry       = options.entry        || [path.join(__dirname, 'src')]
  var port        = options.port  || 8080
  var webpackDir  = options.webpackDir   || path.join(__dirname, 'webpack')
  var target      = 'client'

  var baseUrl     = 'http://' + host + ':' + port

  if      (mode === 'dev')  mode = 'development'
  else if (mode === 'prod') mode = 'production'

  var publicPath  = options.publicPath   || '/'

  ////////////////////////////////////////////////////////////////////////////////
  // BASE
  ////////////////////////////////////////////////////////////////////////////////

  var config = {
    context: __dirname,
    entry: [
      'babel-polyfill'
    ],
    watch: watch,
    output: {
      path: path.join(webpackDir, 'assets'),
      publicPath: publicPath,
      pathinfo: true
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json'],
      root: path.join(__dirname, '../app')
    },
    module: {
      preLoaders: [
        {test: /\.jsx?$/, loader: "eslint-loader", exclude: /node_modules|webpack\/lib/}
      ],
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: /node_modules|lib/,
          query: {
            cacheDirectory: true,
            "presets": ["es2015", "stage-1", "react"]
          }
        }
      ]
    },
    plugins: [
      new ProgressBarPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode)
      })
    ]
  }

  ////////////////////////////////////////////////////////////////////////////////
  // CLIENT
  ////////////////////////////////////////////////////////////////////////////////

  if (target === 'client') {
    config = merge(config, {
      entry: [
        'bootstrap-sass/assets/stylesheets/_bootstrap.scss',
        path.join(__dirname, 'mindfront-react-components/sass/misc.sass'),
        path.join(__dirname, 'mindfront-react-components/bootstrap/shades.sass')
      ],
      output: {
        filename: 'client.bundle.js'
      },
      module: {
        loaders: [
          {
            text: /\.js?$/,
            loader: 'babel-loader',
            include: /node_modules\/immutable-devtools/
          },
          {
            test: /\.sass/,
            loader: 'style-loader!css-loader!sass-loader?indentedSyntax&outputStyle=expanded'
          },
          {
            test: /\.scss/,
            loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&' +
            "includePaths[]=" + (path.resolve(__dirname, "./node_modules"))
          },
          { test: /\.css$/, loader: 'style-loader!css-loader' },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
          { test: /\.woff\d?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
          { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
          { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
          { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
        ]
      },
      plugins: [
        new webpack.PrefetchPlugin("react"),
        new webpack.PrefetchPlugin("react-router"),
        new webpack.PrefetchPlugin("react-transform-hmr"),
        new webpack.PrefetchPlugin("react-transform-catch-errors")
      ]
    })

    ////////////////////////////////////////////////////////////////////////////////
    // CLIENT DEVELOPMENT
    ////////////////////////////////////////////////////////////////////////////////

    if (mode === 'development') {
      config = merge({
        entry: [
          'webpack-dev-server/client?' + baseUrl,
          'webpack/hot/only-dev-server'
        ],
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin()
        ]
      }, config)

      config = merge.smart(config, {
        devtool: 'eval',
        module: {
          loaders: [
            {
              test: /\.jsx?$/,
              loader: 'babel',
              exclude: /node_modules|lib/,
              query: {
                cacheDirectory: true,
                presets: ["es2015", "stage-1", "react"],
                plugins: [
                  ["react-transform", {
                    transforms: [
                      {
                        transform: "react-transform-hmr",
                        imports: ["react"],
                        locals: ["module"]
                      },
                      {
                        transform: "react-transform-catch-errors",
                        imports: ["react", "redbox-react"]
                      }
                    ]
                  }]
                ]
              }
            }
          ]
        }
      })
    }

    ////////////////////////////////////////////////////////////////////////////////
    // WEBPACK-DEV-SERVER
    ////////////////////////////////////////////////////////////////////////////////

    if (mode === 'development' || options.useDevServer) {
      config = merge(config, {
        devServer: {
          publicPath: publicPath,
          host: host,
          hot: mode === 'development',
          historyApiFallback: true,
          port: port,
          stats: stats
        }
      })
    }

    ////////////////////////////////////////////////////////////////////////////////
    // CLIENT PRODUCTION
    ////////////////////////////////////////////////////////////////////////////////

    if (mode === 'production') {
      config = merge.smart(config, {
        module: {
          loaders: [
            {
              test: /\.jsx?$/,
              loader: 'babel',
              exclude: /node_modules|lib/,
              query: {
                cacheDirectory: true,
                "presets": ["es2015", "stage-1", "react"],
                "plugins": [
                  "transform-react-constant-elements"
                ]
              }
            }
          ]
        }
      })
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PRODUCTION
  ////////////////////////////////////////////////////////////////////////////////

  if (mode === 'production' && !karma) {
    var uglifyPlugin = uglify ? [new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false} })] : []
    config = merge(config, {
      output: {
        pathinfo: false
      },
      plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        ...uglifyPlugin,
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true)
      ]
    })
  }

  ////////////////////////////////////////////////////////////////////////////////
  // ENTRY
  ////////////////////////////////////////////////////////////////////////////////

  config = merge(config, {
    entry: entry
  })

  ////////////////////////////////////////////////////////////////////////////////
  // KARMA
  ////////////////////////////////////////////////////////////////////////////////

  if (karma) {
    config = merge(config, {
      devtool: 'eval-source-map',
      externals: _.assign({}, config.externals, {
        jsdom: 'window',
        sinon: 'sinon'
      }),
      plugins: [
        new webpack.IgnorePlugin(/react\/lib\/(ReactContext|ExecutionEnvironment)/)
      ]
    })
  }

  if (argv['print-webpack-config'] >= 0) {
    console.log('================================================================')
    console.log('Webpack config for: ' + JSON.stringify(options, null, 2))
    console.log('================================================================\n')
    console.log(JSON.stringify(config, null, 2))
  }

  return config
}

if (!module.parent) {
  console.log(JSON.stringify(module.exports(), null, 2))
}
