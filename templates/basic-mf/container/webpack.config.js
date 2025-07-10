const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  entry: "./index.js",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: path.join(__dirname, "public"),
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
      name: "container",
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
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
