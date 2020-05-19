/*
1.目的:配置开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
2.如何配置开发服务器？【★★★★★★★】
(1)创建devServer开发服务器，添加项目构建后的路径；启动gzip压缩，配置端口号，配置是否自动发开浏览器
(2)在最外层目录下下载webpack-dev-server :npm i webpack-dev-server -D
(3)在当前07.devServer目录下运行以上指令 npx webpack-dev-server
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
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
  mode: "development",

  // 配置开发服务器 devServer：【★★★★★★★】
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, "build"),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true
  }
};
