/* global __dirname */
const precss       = require('precss');
const autoprefixer = require('autoprefixer');

const path = require('path');

const webpack           = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const dir_src   = path.resolve(__dirname, 'src');
const dir_html  = path.resolve(__dirname, 'html');
const dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry:     {
    js:  [
      './src/play-pause.js',
      './src/tonality-factory.js',
      './src/tonality.js',
      './src/noise.js',
      './src/dial.js',
      './src/tempo.js',
      './src/editor.js',
      './src/pattern-store.js',
      './src/name.js',
      './src/machine.js',
      'babel-polyfill'
    ],
    css: './src/index.css'
  },
  output:    {
    path:     dir_build,
    filename: 'bundle.js'
  },
  resolve:   {
    alias: {
      'xxrxjs': 'rxjs-es'
    }
  },
  devServer: {
    contentBase: dir_build,
  },
  module:    {
    loaders: [
      {
        test:    /\.js?$/,
        exclude: /(node_modules(?!\/rxjs))/,
        loader:  'babel',
        query:   {
          presets: ['es2015-webpack']
        }
      },
      {
        test:   /\.css$/,
        loader: ExtractTextPlugin.extract("css-loader!postcss-loader") // "style-loader",
      },
      {
        test:   /.(png|woff(2)?|eot|ttf|svg|jpg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=1000'
      }
    ]
  },
  plugins:   [
    new CopyWebpackPlugin([
      {from: dir_html} // to: output.path
    ]),
    new CopyWebpackPlugin([
      {
        from:   './src/lib/',
        to:     './js/lib/',
        ignore: './src/lib/ndp-software'
      } // to: output.path
    ]),
    new ExtractTextPlugin("styles.css"),
    new webpack.NoErrorsPlugin()  // Avoid publishing files when compilation fails
  ],
  stats:     {
    colors: true
  },
  devtool:   'source-map',
  postcss:   function() {
    return [precss, autoprefixer];
  }
};


