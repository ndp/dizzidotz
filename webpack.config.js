/* global __dirname */

var path = require('path');

var webpack           = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var dir_js    = path.resolve(__dirname, 'js');
var dir_html  = path.resolve(__dirname, 'html');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry: //path.resolve(dir_js, 'main.js'),
             [ //'./js/lib/Tone.min.js',
               //'./js/lib/velocity.min.js',
               './js/lib/ndp-software/util.js',
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
             'babel-polyfill'],
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
      }
    ]
  },
  plugins:   [
    // Simply copies the files over
    new CopyWebpackPlugin([
      {from: dir_html} // to: output.path
    ]),
    new CopyWebpackPlugin([
      {from: './js/lib/', to: './js/lib/', ignore: './js/lib/ndp-software'} // to: output.path
    ]),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],
  stats:     {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool:   'source-map',
};


