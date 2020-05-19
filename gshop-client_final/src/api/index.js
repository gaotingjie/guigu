/*
包含n个接口请求函数的模块，每个请求函数都是异步函数
函数的返回值: promise对象
 */
import ajax from "./ajax";
// const BASE_URL = 'http://localhost:4000'
const BASE_URL = "/api";

/*重点： 
1.根据习惯，所有的接口请求函数名称开头都应该是req;如果是向服务器发送的ajax请求，基础路径应该为/api开头(按照代理的基础路径);如果不是向web服务器发送的ajax请求，而是通过Mockjs模拟的数据，则不需要加代理基础路径。
2.在封装接口函数时,是否传递参数要看url有没有变量，如果有，则将变量作为参数传递，如果有服务端接口API文档，则可以直接对照文档进行；
3.根据参数类型,接口函数的不同写法:
(3-1)情况一:不传递参数(例子如下)
export const reqFoodCategorys = () => ajax(BASE_URL + "/index_category");
(3-2)情况二:参数类型为query/请求体,即：？uid=xxx&upwd=xxx,(例子如下)
①请求1个参数:
export const reqSendCode = phone => ajax(BASE_URL + "/sendcode", { phone });
②请求参数为两个:
export const reqSearchShop = (geohash, keyword) =>  ajax(BASE_URL + "/search_shops", { geohash, keyword });
③请求参数为两个以上，形参用对象解构语法
export const reqPwdLogin = ({ name, pwd, captcha }) =>  ajax(BASE_URL + "/login_pwd", { name, pwd, captcha }, "POST");
(3-3)情况三:参数类型为params,即:/details/:1
export const reqAddress = geohash => ajax(`${BASE_URL}/position/${geohash}`);
*/

// 1、根据经纬度获取位置详情

export const reqAddress = geohash => ajax(`${BASE_URL}/position/${geohash}`);
// 2、获取食品分类列表
export const reqFoodCategorys = () => ajax(BASE_URL + "/index_category");
// 3、根据经纬度获取商铺列表
export const reqShops = (longitude, latitude) =>
  ajax(BASE_URL + "/shops", { longitude, latitude });
// 4、根据经纬度和关键字搜索商铺列表
export const reqSearchShop = (geohash, keyword) =>
  ajax(BASE_URL + "/search_shops", { geohash, keyword });
// 6、用户名密码登陆
export const reqPwdLogin = ({ name, pwd, captcha }) =>
  ajax(BASE_URL + "/login_pwd", { name, pwd, captcha }, "POST");
// 7、发送短信验证码
export const reqSendCode = phone => ajax(BASE_URL + "/sendcode", { phone });
// 8、手机号验证码登陆
export const reqSmsLogin = (phone, code) =>
  ajax(BASE_URL + "/login_sms", { phone, code }, "POST");
// 9、根据会话获取用户信息
export const reqUserInfo = () => ajax(BASE_URL + "/userinfo");
// 10、用户登出
export const reqLogout = () => ajax(BASE_URL + "/logout");

/*
如下三个请求是通过Mockjs模拟的请求接口。 * 获取商家信息
 */
export const reqShopInfo = () => ajax("/info");

/**
 * 获取商家评价数组
 */
export const reqShopRatings = () => ajax("/ratings");

/**
 * 获取商家商品数组
 */
export const reqShopGoods = () => ajax("/goods");
