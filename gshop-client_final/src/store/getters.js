/*
包含多个基于state的getter计算属性的对象
 */
export default {
  // totalCount表示添加到购物车的事物总个数
  totalCount(state) {
    return state.cartFoods.reduce((preTotal, food) => preTotal + food.count, 0);
  },
  // totalPrice表示添加在购物车的事物总价格
  totalPrice(state) {
    return state.cartFoods.reduce(
      (preTotal, food) => preTotal + food.count * food.price,
      0
    );
  },
  // 统计满意和不满意的用户个数。
  positiveSize(state) {
    return state.ratings.reduce(
      (preTotal, rating) => preTotal + (rating.rateType === 0 ? 1 : 0),
      0
    );
  }
};
