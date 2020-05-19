/*
压缩css代码的配置:
(1)下载optimize-css-assets-webpack-plugin插件
(2)在插件plugins中进行配置即可。
*/

// 配置输出路径时使用
const { resolve } = require("path");
// 打包Html代码时使用该插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取css问单独的文件时需要该插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css的插件
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development';

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      // 打包css
      /* 过程:【★★★★★★★★】
      (1)配置package,json中的browserList中的浏览器兼容性;
      (2)css兼容性配置;
      (3)css-loader;
      (4)css从js中抽取出来
      (5)css压缩
      */

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                // postcss的插件
                require("postcss-preset-env")()
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 打包html文件
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    // 将css提取为单独的文件
    new MiniCssExtractPlugin({
      filename: "css/built.css"
    }),
    // 压缩css需要的插件
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: "development"
};
