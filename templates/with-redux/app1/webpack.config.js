const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./index.jsx",
  mode: "development",
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "auto",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
      remotes: {
        container: "container@http://localhost:3000/remoteEntry.js",
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
        "react-redux": {
          singleton: true,
          requiredVersion: deps["react-redux"],
        },
        "@reduxjs/toolkit": {
          singleton: true,
          requiredVersion: deps["@reduxjs/toolkit"],
        },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
