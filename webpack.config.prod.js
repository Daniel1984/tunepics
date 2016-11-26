var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/build",
    filename: "[name]-[hash].js"
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
      { test: /\.(jpg|png)$/, loader: 'file?name=[path][name].[hash].[ext]' }
    ]
  },

  resolve: {
    alias: {
      'react': 'react-lite',
      'react-dom': 'react-lite'
    }
  },

  sass: [
    require('autoprefixer')
  ],

  plugins: [
    new HtmlWebpackPlugin({ template: __dirname + "/src/index.tmpl.html" }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true
      }
    }),
    new ExtractTextPlugin("[name]-[hash].css")
  ],

}
