/*
js兼容性处理:
1.背景:当源代码中有用到es6及以上语法时，如果打包后还是ed6及以上语法，那么部分浏览器是不支持es6语法的,此时es6语法就无法在浏览器中正常执行。所以此时就需要做js兼容性处理，将es6及以上格式的语法转换为es5及一下的语法，使得浏览器兼容可以正常读取。
2.js兼容型处理的步骤:
(1)在最外层目录下载babel-loader @babel/core  @babel/preset-env core-js 4个包;
(2)在rules中创建{},配置所有的js兼容性代码,重点记住预设中的内容配置,具体参考如下。
3.js兼容性处理的三种方式:
  共用包：babel-loader @babel/core 
  (1). 基本js兼容性处理 --> @babel/preset-env
    问题：只能转换基本语法，如promise高级语法不能转换
  (2). 全部js兼容性处理 --> @babel/polyfill  ,下载后直接在入口js文件中引入即可。
    问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
  (3). 需要做兼容性处理的就做：按需加载  --> core-js
  推荐方式:(1)+(3)结合起来处理。
*/

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      //  【★★★★★★★★★】
      {
        test: /\.js$/, //要检查的文件为js文件
        exclude: /node_modules/, //排除node_modules的转换；
        loader: "babel-loader", //依赖的loader
        options: {
          // 定义预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              "@babel/preset-env", //该包只能转换基本ES6及以上语法，如promise高级语法不能转换
              {
                // 按需加载,需要做兼容性处理的就做。
                useBuiltIns: "usage",
                // 指定core-js版本
                corejs: {
                  version: 3
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: "60",
                  firefox: "60",
                  ie: "9",
                  safari: "10",
                  edge: "17"
                }
              }
            ]
          ]
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
