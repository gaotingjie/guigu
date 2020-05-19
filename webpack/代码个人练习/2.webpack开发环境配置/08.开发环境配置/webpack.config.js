/*  开发环境配置：
1.最终效果:只要代码能运行即可。
2.运行项目指令：方式1: webpack 会将打包结果输出出去
                方式2:npx webpack-dev-server 只会在内存中编译打包，没有输出
3.开发环境中共配置了如下资源:
(1)样式资源(css，css预处理)
(2)图片
(3)html
(4)其他资源
(5)开发服务器。
*/
// 引入path核心模块
const { resolve } = require("path");
// 作用:html打包
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  entry: "./src/js/index.js",
  // 出口
  output: {
    filename: "js/built.js",
    // 所有的出口路径文件都是以build为根目录的。【★★★★★★】
    path: resolve(__dirname, "build")
  },
  // 模块
  module: {
    // 不同文件类型的Loader配置
    rules: [
      {
        // 1.打包less资源
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        // 2.打包css资源
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        // 3.打包图片资源
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          // 关闭es6模块化
          esModule: false,
          outputPath: "imgs" //图片打包后自动存储在build/imgs目录下
        }
      },
      {
        // 3-2.处理html中img资源
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        // 4.处理其他资源
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media"
        }
      }
    ]
  },
  plugins: [
    // 5.打包html资源
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  // 开发模式
  mode: "development",
  // 配置开发服务器
  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    port: 3000,
    open: true
  }
};
