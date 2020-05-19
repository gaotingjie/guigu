/*
该配置文件目的:打包html资源
重点:
  1.loader和plugins使用步骤:【★★★★★】
  (1)loader: 1. 先下载   2. 直接在配置文件中使用（配置loader）
  (2)plugins: 1. 先下载  2. 再引入  3. 最后再在plugin插件配置想中使用New调用
  2.打包html资源的步骤:
  (1)搭建基本的webpack.config.js文件，定义基本配置项；
  (2)在最外层目录下载'html-webpack-plugin'插件；
  (3)在配置文件中引入插件:const HtmlWebpackPlugin = require('html-webpack-plugin');
  (4)在插件配置项中调用插件new HtmlWebpackPlugin({})
  (5)在实例对象中使用template属性，定义Html结构，并把打包后的js.css等代码自动存入其中。
  3.html-webpack-plugin插件的功能:
    默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）,但是没有基本的html结构，所以需要借助实例对象中的tempalte指定Html结构。
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
      // loader的配置
    ]
  },
  plugins: [
    // plugins的配置
    // html-webpack-plugin
    // 该插件的功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）【★★★★★★】
    // 需求：需要有结构的HTML文件
    new HtmlWebpackPlugin({
      // template作用:复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
      template: "./src/index.html"
    })
  ],
  mode: "development"
};
