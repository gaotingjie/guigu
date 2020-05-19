/*mutations定义:mutations本事是一个对象,内部定义了多个同步代码执行的方法，通过调用该中的方法，可以直接修改state对象中定义的数据变量。
重点::
1.必须引入所有的type常量名称,格式为:import {} from "./mutations-types"
2.所有的方法名都是type常量名，且方法名应该用[]包裹起来,格式为:[type常量名]
3.mutations中的方法可以传递两个参数，一个是state,另一个是一个对象解构的语法,其中对象中的变量名应该同state中定义的数据变量名称相同;
4. Vue.set API可以给一个具有数据绑定的数据对象添加新的属性,且新添加的属性也有数据绑定的功能。
 */
import Vue from "vue";
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  RECEIVE_GOODS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from "./mutation-types";

export default {
  [RECEIVE_ADDRESS](state, { address }) {
    state.address = address;
  },

  [RECEIVE_CATEGORYS](state, { categorys }) {
    state.categorys = categorys;
  },

  [RECEIVE_SHOPS](state, { shops }) {
    state.shops = shops;
  },

  [RECEIVE_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo;
  },
  [RESET_USER_INFO](state) {
    state.userInfo = {};
  },

  [RECEIVE_INFO](state, { info }) {
    state.info = info;
  },

  [RECEIVE_RATINGS](state, { ratings }) {
    state.ratings = ratings;
  },

  [RECEIVE_GOODS](state, { goods }) {
    state.goods = goods;
  },

  [INCREMENT_FOOD_COUNT](state, { food }) {
    // 如果food中没有count属性，就给food对象中添加一个count属性，并设置初始值为1
    if (!food.count) {
      // 第一次增加
      // food.count = 1  // 新增属性(这种方式没有数据绑定的功能,只能改变V--M)
      /*
      对象
      属性名
      属性值
       */
      Vue.set(food, "count", 1);
      // Vue.set API可以给一个具有数据绑定的数据对象添加新的属性,且新添加的属性也有数据绑定的功能。
      // 将food添加到cartFoods中
      state.cartFoods.push(food);
    } else {
      food.count++;
    }
  },
  [DECREMENT_FOOD_COUNT](state, { food }) {
    // 如果count中有值;即count>0,才count--
    if (food.count) {
      // 只有有值才去减
      food.count--;
      if (food.count === 0) {
        // 将food从cartFoods中移除
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1);
      }
    }
  },

  [CLEAR_CART](state) {
    // 清除food中的count
    state.cartFoods.forEach(food => (food.count = 0));
    // 移除购物车中所有购物项
    state.cartFoods = [];
  },

  [RECEIVE_SEARCH_SHOPS](state, { searchShops }) {
    state.searchShops = searchShops;
  }
};
