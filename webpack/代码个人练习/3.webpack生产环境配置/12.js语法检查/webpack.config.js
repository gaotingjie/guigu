/*
1.js语法检查配置步骤:【★★★★★★】
(1)在最外层目录下载如下四个包:eslint-loader  eslint eslint-config-airbnb-base  eslint-plugin-import
注解:① eslint-loader  eslint 作用是提供语法检查;
     ②如果想使用airbnb规格进行检查，需要安装eslint-config-airbnb-base  eslint-plugin-import eslint
(2)在rules中创建对象,配置js语法检查的相关参数。其中包括test、exclude、loader、options具体如下
(3)在package.json中配置检查规则。具体如下或者参考package.json中的"eslintConfig"
2.js语法检查原理:【★★★★★★】
(1)首先使用eslint-loader eslint库对js文件进行语法检查，但是一定要排除Node_modules,否则会报错；
(2)但是eslint不知道要检查什么东西，所以需要写检查js的语法规则，js检查规则依赖于airbnb这个库，但是airbnb这个库又依赖于eslint eslint-config-airbnb-base  eslint-plugin-import这三个包，所以需要下载；
(3)随后在package.json中的"eslintConfig"中配置检查规则即可。
3.如果js中的某一行代码不想被eslint检查，则只需要在该行代码前加上如下代码:【★★★★★★】 eslint-disable-next-line
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
      /*
        语法检查： eslint-loader  eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则：
            package.json中eslintConfig中设置~
              "eslintConfig": {
                "extends": "airbnb-base"  //让eslint继承airbnb规格检查
              } 
            airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
      */
      {
        test: /\.js$/, //检查的内容为js代码
        exclude: /node_modules/, //排除掉node_nodules，让其不检查。
        loader: "eslint-loader", //依赖的包
        options: {
          // 自动修复eslint的错误
          fix: true
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
