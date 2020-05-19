/*
1.css兼容性配置的步骤:
(1)创建基本的webpack架构。并且已经实现了css文件单独提取
(2)在最外层目录下载 postcss-loader postcss-preset-env 
(3)修改'postcss-loader'的配置，具体如下;
(4)找到package.json,配置browserslist里面的的信息，通过配置加载指定的css兼容性样式.
(5)如果想要启动开发模式下browserslist中的配置，则需要在该文件中配置Node的临时环境变量:process.env.NODE_ENV = 'development';然后webpack就会在built中产生开发模式下css自动兼容的效果。
(6)如果想要启用生产模式下的css兼容性代码，则不需要设置Node环境变量，直接默认情况下就是生产模式下的css兼容性代码
2.css兼容性处理如何实现?
答：css兼容性处理需要依赖三个东西:
(1).需要使用一个库postcss;
(2)但是postcss要想在webpack中使用则需要下载post-Loader;
(3)还需要下载一个插件postcss-preset-env,该插件的作用是帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式，从而使得css兼容性精确到某一个浏览器具体版本。
*/

// 作用:出口使用
const { resolve } = require("path");
// 作用:打包html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 作用:提取css资源
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 作用:设置nodejs环境变量，加载browserslist中的开发模式下的css兼容性代码。
// process.env.NODE_ENV = "development";

module.exports = {
  // 入口
  entry: "./src/js/index.js",
  // 出口
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build")
  },
  // 模块
  module: {
    // loader配置
    rules: [
      // 1.打包css
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, //(1)将css从js中抽取出来
          "css-loader", //(2)将css代码解析为Js字符串。
          // 使用loader的默认配置
          // 'postcss-loader',
          // (3)修改loader的配置
          {
            loader: "postcss-loader",
            // 在options中修改psotcss-loader中的配置。
            options: {
              ident: "postcss",
              plugins: () => [
                // postcss的插件
                require("postcss-preset-env")()
              ]
            }
          }
          /*(4)配置package.json中的browserslist。
            "browserslist": {
              // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
              "development": [ 
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
              ],
              // 生产环境：默认是看生产环境
              "production": [ 
                ">0.2%",
                "not dead",
                "not op_mini all"
              ]
            }
          */
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "css/built.css"
    })
  ],
  mode: "development"
};
