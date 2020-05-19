/*actions本质是一个对象，用来定义多个异步执行的方法,通过在异步函数中调用mutations中的方法，从而间接的改变state中的数据变量。
重点:actions.js文件重点归纳:
1.必须引入所有的mutation-types的常量,格式为import {} from "./mutation-type";
2.必须引入所有封装好的异步接口函数，格式 import {} from "../api";
3.定义的每个方法都是异步方法，方法中可以传递两个参数,形参按对象解构语法定义,{commit,state};
4.每个异步方法定义时按照如下步骤进行(以异步获取地址为例)
 */
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from "./mutation-types";
import {
  reqAddress,
  reqFoodCategorys,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopRatings,
  reqShopGoods,
  reqShopInfo,
  reqSearchShop
} from "../api";

export default {
  // 1.异步获取地址(商品首页组件)
  //(1)async 函数名(){}定义方法
  async getAddress({ commit, state }) {
    // 发送异步ajax请求
    // (2)同步代码:定义传递给web服务器的参数
    const geohash = state.latitude + "," + state.longitude;
    // (3)异步代码:携带参数，向web服务器发送ajax请求
    const result = await reqAddress(geohash);
    // (4)获取服务器的响应结果result,然后commit调用一个mutations中定义修改地址变量的方法，并把需要传递的实参值传递过去，从而间接的修改state中的address变量的值。
    if (result.code === 0) {
      const address = result.data;
      commit(RECEIVE_ADDRESS, { address });
    }
  },

  // 2.异步获取食品分类列表(商品首页组件)
  async getCategorys({ commit }) {
    // 发送异步ajax请求
    const result = await reqFoodCategorys();
    // 提交一个mutation
    if (result.code === 0) {
      const categorys = result.data;
      commit(RECEIVE_CATEGORYS, { categorys });
    }
  },

  // 3.异步获取商家列表(商品首页组件)
  async getShops({ commit, state }) {
    // 发送异步ajax请求
    // 对象解构获取state中的经纬度两个变量
    const { longitude, latitude } = state;
    const result = await reqShops(longitude, latitude);
    // 提交一个mutation
    if (result.code === 0) {
      const shops = result.data;
      commit(RECEIVE_SHOPS, { shops });
    }
  },

  // 4.同步记录用户信息
  /*因为在login.vue组件中，已经向web服务器发送了ajax请求，所以userinfo是已经获取到的，即已存在的，所以这里只需要同步记录用户信息*/

  recordUser({ commit }, userInfo) {
    commit(RECEIVE_USER_INFO, { userInfo });
  },

  // 异步获取用户信息
  async getUserInfo({ commit }) {
    const result = await reqUserInfo();
    if (result.code === 0) {
      const userInfo = result.data;
      commit(RECEIVE_USER_INFO, { userInfo });
    }
  },

  // 异步登出
  async logout({ commit }) {
    const result = await reqLogout();
    if (result.code === 0) {
      commit(RESET_USER_INFO);
    }
  },

  // 异步获取商家信息
  async getShopInfo({ commit }) {
    const result = await reqShopInfo();
    if (result.code === 0) {
      const info = result.data;
      commit(RECEIVE_INFO, { info });
    }
  },

  // 异步获取商家评价列表
  async getShopRatings({ commit }, callback) {
    const result = await reqShopRatings();
    if (result.code === 0) {
      const ratings = result.data;
      commit(RECEIVE_RATINGS, { ratings });
      // 数据更新了, 通知一下组件
      callback && callback();
    }
  },

  // 异步获取商家商品列表
  async getShopGoods({ commit }, callback) {
    const result = await reqShopGoods();
    if (result.code === 0) {
      const goods = result.data;
      commit(RECEIVE_GOODS, { goods });
      // 如下语句表示,当goods数据更新到state中后, 通知一下调用该方法的组件,然后执行该回调函数，回调函数可能有也可能没有
      callback && callback();
    }
  },

  // 同步更新food中的count值
  updateFoodCount({ commit }, { isAdd, food }) {
    // 如果是增加,就调用INCREMENT_FOOD_COUNT()
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT, { food });
    } else {
      // 如果是减少,就调用DECREMENT_FOOD_COUNT()
      commit(DECREMENT_FOOD_COUNT, { food });
    }
  },

  // 同步清空购物车
  clearCart({ commit }) {
    commit(CLEAR_CART);
  },

  // 异步获取商家商品列表
  async searchShops({ commit, state }, keyword) {
    const geohash = state.latitude + "," + state.longitude;
    const result = await reqSearchShop(geohash, keyword);
    if (result.code === 0) {
      const searchShops = result.data;
      commit(RECEIVE_SEARCH_SHOPS, { searchShops });
    }
  }
};
