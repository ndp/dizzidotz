/* global __dirname */
const path = require('path')

const webpack              = require('webpack')
const CopyWebpackPlugin    = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const dir_src   = path.resolve(__dirname, 'src')
const dir_html  = path.resolve(__dirname, 'html')
const dir_build = path.resolve(__dirname, 'build')

module.exports = {
  entry:     {
    'bundle.js': [
      './src/editor.js',
      './src/pattern-drawer.js',
      './src/machine.js',
      '@babel/polyfill',
    ],
    'styles':    './src/index.css',
  },
  output:    {
    path:     dir_build,
    filename: '[name]',
  },
  resolve:   {
    symlinks: false,
  },
  devServer: {
    contentBase: dir_build,
    hot:         true,
  },
  module:    {
    rules: [
      {
        test:    /\.js$/,
        include: dir_src,
        exclude: /.*\-spec\.js/,
        loader: 'babel-loader'
      },
      {
        test:    /\.css$/,
        include: dir_src,
        use:     [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /.(png|woff(2)?|eot|ttf|svg|jpg)(\?[a-z0-9=\.]+)?$/,
        use:  'url-loader',
        // type: 'asset',
        // options: {
        //   limit: 1000,
        // }
      },

    ],
  },

  plugins: [
    new CopyWebpackPlugin({
                            patterns: [
                              { from: dir_html, to: dir_build },
                              { from: './src/lib/', to: './js/lib/' }
                            ],
                          }),
    new MiniCssExtractPlugin(),
    //   // new webpack.NoErrorsPlugin(),  // Avoid publishing files when compilation fails
  ],
  stats:   {
    colors: true,
  },
  devtool: 'source-map',
}


