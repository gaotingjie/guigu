/*
重点:
1.目的:提取css成单独文件。
2.步骤:【★★★★★★★】
(1)按照开发模式创建webpack基本配置框架;
(2)在最外层目录下载mini-css-extract-plugin插件，
(3)在该配置文件中引入该插件;
(4)在plugins中配置该插件，并给提取出来的css文件配置路径及命名
(5)禁用打包css资源中的style-loader，用 MiniCssExtractPlugin.loader代替，这样可以提取出js中的css。
3.将css单独提取出来的优点?
答:
(1)css不会再以style标签的方式引入到head中，而出现闪屏现象，而是单独提取出来，自动生成link引入样式;
(2)js的体积也较少了很多，解析速度会更好一些。
*/

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //【★★★★★★★】

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 创建style标签，将样式放入其中
          // 'style-loader',
          // 这个loader取代style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader, //【★★★★★★★】
          // 将css文件整合到js文件中
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      //【★★★★★★★】
      // 对输出的css文件进行重命名
      filename: "css/built.css"
    })
  ],
  mode: "development"
};
