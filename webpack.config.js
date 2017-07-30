const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
const IS_BUILD = process.env.npm_lifecycle_event === 'build';
const SOURCE_DIR = path.resolve(__dirname, 'src');
const DESTINATION_DIR = path.resolve(__dirname, 'dist');

const identity = value => value;

module.exports = {
  context: SOURCE_DIR,
  entry: {
    app: './main.js',
  },
  output: {
    filename: IS_BUILD ? '[name].[hash].js' : '[name].bundle.js',
    path: DESTINATION_DIR,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SOURCE_DIR,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                //modules: true,
                localIdentName: '[name]-[local]__[hash:base64:5]',
                //importLoaders: 2,
                minimize: IS_BUILD,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: IS_BUILD,
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.svg$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      template: 'index.tpl.html',
      env: NODE_ENV,
    }),
    new ExtractTextPlugin({
      filename: IS_BUILD ? '[name].[contenthash].css' : '[name].bundle.css',
      allChunks: true,
    }),
  ]
    .concat(IS_BUILD && [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          HOSTMAKER_ENV: JSON.stringify(NODE_ENV),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
      }),
    ])
    .filter(identity),
  devtool: IS_BUILD ? 'source-map' : 'cheap-module-source-map',
  devServer: {
    contentBase: SOURCE_DIR,
    historyApiFallback: true,
  },
};
