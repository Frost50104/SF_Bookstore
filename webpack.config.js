const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

require('dotenv').config();

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/bundle.[contenthash].js' : 'js/bundle.js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: 'css/style.[contenthash].css' })]
        : []),
      new webpack.DefinePlugin({
        'process.env.GOOGLE_BOOKS_API_KEY': JSON.stringify(
          process.env.GOOGLE_BOOKS_API_KEY || ''
        ),
      }),
    ],
    optimization: isProd
      ? {
          minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
        }
      : {},
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 3000,
      open: true,
      hot: true,
    },
    devtool: isProd ? false : 'source-map',
  };
};
