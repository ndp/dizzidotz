/* global __dirname */
const precss       = require('precss');
const autoprefixer = require('autoprefixer');

const path = require('path');

const webpack           = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const dir_js    = path.resolve(__dirname, 'js');
const dir_html  = path.resolve(__dirname, 'html');
const dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry:     {
    js:  ['./js/lib/ndp-software/util.js',
      './js/lib/ndp-software/trig.js',
      './js/lib/ndp-software/svg.js',
      './js/lib/ndp-software/cmdBus.js',
      './js/play-pause.js',
      './js/lib/ndp-software/generators.js',
      './js/tonality-factory.js',
      './js/tonality.js',
      './js/noise.js',
      './js/lib/ndp-software/map-behavior-subject.js',
      './js/dial.js',
      './js/tempo.js',
      './js/editor.js',
      './js/pattern-store.js',
      './js/pattern-drawer.js',
      './js/name.js',
      './js/machine.js',
      'babel-polyfill'
    ],
    css: './js/index.css'
  },
  output:    {
    path:     dir_build,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: dir_build,
  },
  module:    {
    loaders: [
      {
        loader: 'babel-loader',
        test:   dir_js,
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
      {from: './js/lib/', to: './js/lib/', ignore: './js/lib/ndp-software'} // to: output.path
    ]),
    new ExtractTextPlugin("styles.css"),
    //new webpack.NoErrorsPlugin()  // Avoid publishing files when compilation fails
  ],
  stats:     {
    colors: true
  },
  devtool:   'source-map',
  postcss:   function() {
    return [precss, autoprefixer];
  }
};


