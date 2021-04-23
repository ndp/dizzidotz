/* global __dirname */
const precss       = require('precss')
const autoprefixer = require('autoprefixer')

const path = require('path')

const webpack           = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")


const dir_src   = path.resolve(__dirname, 'src')
const dir_html  = path.resolve(__dirname, 'html')
const dir_build = path.resolve(__dirname, 'build')

module.exports = {
  entry:     {
    'bundle.js':  [
      './src/play-pause.js',
      './src/tonality-factory.js',
      './src/tonality.js',
      './src/noise.js',
      './src/dial.js',
      './src/tempo.js',
      './src/editor.js',
      './src/pattern-store.js',
      './src/pattern-drawer.js',
      './src/name.js',
      './src/machine.js',
      '@babel/polyfill',
    ],
    'styles': './src/index.css',
  },
  output:    {
    path:     dir_build,
    filename: '[name]',
  },
  resolve:   {
    alias: {
      'xxrxjs': 'rxjs-es',
    },
  },
  devServer: {
    contentBase: dir_build,
    hot:         true,
  },
  module:    {
    rules: [
      {
        test:    /\.js$/,
        exclude: /(node_modules(?!\/rxjs))/,
        loader:  'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // use:  ['css-loader'], style-loader
      },
      {
        test: /.(png|woff(2)?|eot|ttf|svg|jpg)(\?[a-z0-9=\.]+)?$/,
        use:  'url-loader',
        // type: 'asset',
        // options: {
        //   limit: 1000,
        // }
        // query: 'limit=1000'
      },

    ],
  },

  // loaders: [
  //   {
  //     test:    /\.js?$/,
  //     exclude: /(node_modules(?!\/rxjs))/,
  //     loader:  'babel',
  //     query:   {
  //       presets: ['es2015'],
  //     },
  //   },
  //   {
  //     test:   /\.css$/,
  //     loader: ExtractTextPlugin.extract("css-loader!postcss-loader"), // "style-loader",
  //   },
  //   {
  //     test:   /.(png|woff(2)?|eot|ttf|svg|jpg)(\?[a-z0-9=\.]+)?$/,
  //     loader: 'url-loader?limit=1000',
  //   },
  // ],
  plugins:   [
    new CopyWebpackPlugin({
                     patterns: [
                       { from: dir_html, to: dir_build },
                       { from: './src/lib/', to: './js/lib/' },
                     ],
                   }),
    new MiniCssExtractPlugin(),
  //   // new webpack.NoErrorsPlugin(),  // Avoid publishing files when compilation fails
  ],
  stats:   {
    colors: true,
  },
  devtool: 'source-map',
  // postcss:   function () {
  //   return [precss, autoprefixer]
  // },
}


