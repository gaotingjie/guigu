/*
♣该配置文件目的:webpack打包样式资源，例如css/less/sass/stylus等。
♣重点:【★★★★★★★★】
  1.webpack.config.js是webpack的配置文件，当在03.打包样式资源这个跟目录下运行:webpack命令，则会按照如下打包进行。
  2.所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs。【★★★★★★】
  3.所有下载的依赖包要都下载到最外层目录，这样当某一个子目录中需要该包时，可以直接在最外层根目录
  下的node_module中查找。
  4.打包css样式资源的步骤:
  (1)搭建webpack.config.js配置文件基本项结构
  (2)在最外层目录下下载css-loader style-loader;
  (3)在module>rules数组中创建其对应的loader对象，并指定test匹配规则；在Use中配置需要的loader包；
  (4)包的执行顺序为先下后上。先调用"css-loader", 将css文件变成commonjs模块加载js中，里面内容是样式字符串；再调用style-loader，当打开浏览器时，会自动创建style标签，将js中的样式字符串资源插入进行，添加到head中使得样式生效
*/

// resolve用来拼接绝对路径的方法
const { resolve } = require("path");

module.exports = {
  // webpack配置
  // 入口起点【注解:打包的入口文件的相对路径。】
  entry: "./src/index.js",
  // 输出【是一个对象】
  output: {
    // 输出文件名
    filename: "built.js",
    // 输出路径【★★★★★★】
    /*notes:path中的resolve中共有两个变量:
    (1)__dirname是nodejs中的变量，代表当前文件(webpack.config.js)的目录绝对路径,这里的dirname的值就是‘03.打包样式资源’;
    (2)第二个变量'build'表示当前绝对目录下的build文件，然后filname表示文件中的文件名为built.js。
    (3)在path之前应该引入node中的path模块。
    */

    path: resolve(__dirname, "build")
  },
  // loader的配置
  module: {
    rules: [
      /*  每一种类型的配置都是一个独立的对象。【★★★★★★】
      use数组中loader执行顺序：从右到左，从下到上 依次执行【★★★★★★】*/

      // 配置css的Loader【★★★★★★★★】
      {
        // 匹配哪些文件，以.css结尾
        test: /\.css$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左，从下到上 依次执行【★★★★★★】
          // 当打开浏览器时，会自动创建style标签，将js中的样式字符串资源插入进行，添加到head中使得样式生效
          "style-loader",
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          "css-loader"
        ]
      },
      // // 配置less的Loader【★★★★★★★★】
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          // less-loader作用:将less文件编译成css文件
          // notes:如果想使用后less-loader则需要下载 less-loader和less【★★★★★★】
          "less-loader"
        ]
      }
    ]
  },
  // plugins的配置
  plugins: [
    // 详细plugins的配置
  ],
  // 模式
  mode: "development" // 开发模式
  // mode: 'production'
};
