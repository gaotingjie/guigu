/*
  index.js: webpack入口起点文件，在其中引入想要打包的文件。

  1. 运行指令：
    开发环境：webpack ./src/index.js -o ./build/built.js --mode=development
      注解:webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js
      整体打包环境，是开发环境
    生产环境：webpack ./src/index.js -o ./build/built.js --mode=production
      注解：webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js
      整体打包环境，是生产环境

   2. 结论：(★★★★★★★)
    1. webpack能处理js/json资源，不能处理css/img等其他资源
    2. 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化~
    3. 生产环境比开发环境多一个压缩js代码。
*/
// webpack不可以直接解析css文件
// import './index.css';

// webpack可以直接解析json文件，并且可以将es6模块化编译为浏览器识别的语言(★★★★★★★)
import data from "./data.json";
console.log(data);

// webapck可以直接解析js代码
function add(x, y) {
  return x + y;
}

console.log(add(1, 2));
