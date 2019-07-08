const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/script.js'
    },
    devtool: 'inline-source-map',
  plugins: [
      new HtmlWebpackPlugin({
          title: 'Recipe Center',
          template: './src/index.html',
          filename: './index.html'
      })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use : [
                  'style-loader',
                  'css-loader'
              ]
          },
          {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                  'file-loader'
              ]
          }
      ]
  }
};