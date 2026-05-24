const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const SERVER_BY_MODE = {
  development: 'http://localhost:5000',
  production: 'https://api.prognosov.ru',
};

module.exports = (_env, argv) => {
  const mode = argv.mode || 'development';
  const serverUrl = SERVER_BY_MODE[mode] ?? SERVER_BY_MODE.development;

  return {
  entry: './src/index.tsx',
  devtool: 'source-map',
  mode,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SERVER_URL': JSON.stringify(serverUrl),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true, // Cache busting
      favicon: './src/assets/svg/smartBall.png',
      filename: 'index.html',
    }),
    new NodePolyfillPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        include: /node_modules\/react-dom/,
        // use: ['react-hot-loader/webpack'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(woff2?|ttf|eot|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.tsx'],
    alias: {
      'node:http': 'http',
      'node:https': 'https',
      'node:url': 'url',
    },
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    static: false,
    historyApiFallback: true,
  },
};
};
