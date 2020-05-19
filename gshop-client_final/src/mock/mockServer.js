/*
mockjs
作用:自动生成模拟数据，拦截ajax请求，返回请求数据。
使用步骤:
(1)下载mockjs第三方插件 npm install mockjs -s
(2)创建mock文件夹，用来存储mock相关的内容;
①data.json用来存储模拟数据，语法可以使用mockjs实例中提供的语法格式；
②mockServer.js用来调用data.json中的模拟数据，第一个参数是模拟的服务器路由接口url地址，第二个参数是响应给ajax请求的模拟数据。
(3)在main.js主文件中引入mockServer.js文件 import './mock/mockServer'
(4)在API/index.js中定义ajax接口请求函数;并在vuex中创建要管理的数据变量，并在action.js中创建异步获取数据变量的方法，例如:getShopInfo() 
(5)在组件中调用action.js中创建的异步方法this.$store.dispatch('getShopInfo')

 */
import Mock from "mockjs";
import data from "./data.json";

// 返回goods的接口
Mock.mock("/goods", { code: 0, data: data.goods });
// 返回ratings的接口
Mock.mock("/ratings", { code: 0, data: data.ratings });
// 返回info的接口
Mock.mock("/info", { code: 0, data: data.info });

// export default ???  不需要向外暴露任何数据, 只需要保存能执行即可
