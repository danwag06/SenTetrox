const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: ["./src/entry.js"],
  },
  output: {
    path: path.resolve(__dirname, "public"), // Ensure output path is 'public'
    filename: "build.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.gif$/,
        use: [{ loader: "url-loader" }],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 8080,
    hot: true,
  },
};
