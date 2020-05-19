/*
目的:打包图片资源配置
1.打包图片资源的步骤:
(1)配置webpack基础项结构，把样式打包，Html打包先配置完成；按照其各自的配置规则；
(2)在最外层目录下载url-loader,file-loader包;
(3)配置打包图片的loader，其中包括:test,loader,options3大块;
(4)在最外层目录下载html-loader，用来处理html文件的img图片（负责引入img，从而能被url-loader进行处理）;
2.配置图片常见问题:
(1).如果html文件中有img引入的图片，如何实现打包?
答:url-loader默认的解析方式为es6;但是html-loader中的解析的方式为commonjs,所以可以关闭url-loader中的es6解析，从而实现正确解析html中的图片。
3.在打包某种资源时，有的需要多个loader，有的需要一个loader；写法如下:
(1)一个loader  loader: "html-loader"
(2)多个Loader  use: ["style-loader", "css-loader", "less-loader"]
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
      // 打包less资源【★★★★★】
      {
        test: /\.less$/,
        // 要使用多个loader处理用use
        use: ["style-loader", "css-loader", "less-loader"]
      },
      // 打包图片资源
      {
        // 问题：默认处理不了html中img图片
        // 打包图片资源【★★★★★★】
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载 url-loader file-loader
        loader: "url-loader",
        options: {
          // 图片大小小于8kb，就会被base64处理,这个limit值是可以根据实际情况自定义的。
          // 优点: 减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度更慢）
          limit: 8 * 1024,
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          // 给图片进行重命名
          // [hash:10]取图片的hash的前10位
          // [ext]取文件原来扩展名
          name: "[hash:10].[ext]"
        }
      },

      // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）【★★★★★★★】
      {
        test: /\.html$/,
        loader: "html-loader"
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
