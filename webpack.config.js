const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: "./src/index.tsx",
    devtool: "source-map",
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins: [new HtmlWebpackPlugin({
      template: "./src/index.html",
      hash: true, // Cache busting
      filename: '../dist/index.html'
    })],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(ts|tsx)?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', ".tsx"]
    },
    devServer: {
      port: 3000,
      open: true,
      hot: true
    },
}