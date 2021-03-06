const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// module.exports used to exose something from a given file to nodejs
module.exports = {
  entry: {
    index: "./src/index.js",
    recipes: "./src/recipes.js",
    update: "./src/update.js"
  },
  output: {
    path: path.resolve(__dirname, "public/scripts"),
    filename: "[name]-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        sideEffects: true,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader",
        options: {
          outputPath: "../images",
          name: "[name].[ext]"
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "../styles/[name].css",
      chunkFilename: "../styles/[id].css"
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    publicPath: "/scripts/"
  },
  devtool: "source-map"
};
// __dirname provides absolute path to the root of the project
