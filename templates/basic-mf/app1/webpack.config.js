const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  entry: "./index.js",
  mode: "development",
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.3.1",
          import: "react",
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.3.1",
          import: "react-dom",
        },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
