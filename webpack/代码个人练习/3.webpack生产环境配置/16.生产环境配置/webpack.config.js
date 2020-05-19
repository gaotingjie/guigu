const { resolve } = require("path");
// 作用:从js中抽取css资源
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 作用:压缩css的插件
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// 作用:打包html的插件
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    // 还需要在package.json中定义browserslist
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [require("postcss-preset-env")()]
    }
  }
];

module.exports = {
  entry: "./src/js/index.js", //入口文件
  output: {
    filename: "js/built.js", //输出到该文件
    path: resolve(__dirname, "build") //输出文件的根目录文件，需要引入resolve。
  },
  module: {
    rules: [
      // 1.打包css资源【★★★★★★★★】
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      // 2.打包less资源【★★★★★★★★】
      {
        test: /\.less$/,
        use: [...commonCssLoader, "less-loader"]
      },
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 再执行babel
      */
      //  3.打包js资源【★★★★★★★★】

      // (1).js语法检查【★★★★】
      {
        // 在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/, //排除掉node_nodules，让其不检查。
        enforce: "pre", // 优先执行
        loader: "eslint-loader",
        options: {
          fix: true // 自动修复eslint的错误
        }
      },
      // (2).js兼容性处理【★★★★】
      {
        test: /\.js$/, //要检查的文件为js文件
        exclude: /node_modules/, //排除node_modules的转换；
        loader: "babel-loader", //依赖的loader
        options: {
          //  // 定义预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              "@babel/preset-env", //该包只能转换基本ES6及以上语法，如promise高级语法不能转换
              {
                useBuiltIns: "usage", // 按需加载,需要做兼容性处理的就做。
                corejs: { version: 3 }, // 指定core-js版本
                targets: {
                  // 指定兼容性做到哪个版本浏览器
                  chrome: "60",
                  firefox: "50"
                }
              }
            ]
          ]
        }
      },
      // 4-1.打包图片【★★★★★★★】
      {
        test: /\.(jpg|png|gif)/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          outputPath: "imgs",
          esModule: false
        }
      },
      // 4-2.打包html中引入的图片【★★★★★★】
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      // 5.打包其他图片【★★★★★★】
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: "file-loader",
        options: {
          outputPath: "media" //指定输出目录，以build为根目录
        }
      }
    ]
  },
  plugins: [
    // 为提取出来的css文件选定路径。
    new MiniCssExtractPlugin({
      filename: "css/built.css"
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // 6.打包html资源
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      // 压缩html资源
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  mode: "production"
};
