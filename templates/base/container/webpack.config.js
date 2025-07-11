const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  entry: "./index.jsx",
  mode: "development",
  devServer: {
    port: 3000,
    hot: false,
    liveReload: true,
    historyApiFallback: true,
    static: path.join(__dirname, "public"),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "auto",
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
