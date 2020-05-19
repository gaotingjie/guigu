/*
1.目的:打包其他资源
2.什么是其他资源:就是在打包过程种不需要做任何优化的资源，例如字体，图标等。
*/

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      // 打包css资源
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      // 打包其他资源(除了html/js/css资源以外的资源)【★★★★★】
      {
        // 排除css/js/html资源
        exclude: /\.(css|js|html|less)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  mode: "development"
};
