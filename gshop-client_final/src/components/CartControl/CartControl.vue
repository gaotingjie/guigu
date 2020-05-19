<!-- 购物车数量加减组件
重点:
1.该组件中需要接收哪些参数?
答:该组件功能主要是实现当前食物数量的加减，所以应该接受父组件传递过来的food.count;但是food变量中没有count属性，所以当在点击+号时，需要在food中创建一个属性,所以prop中只需要接收food即可，并且在action中配置一套食物数量更新的方法
2.如何在已经有数据绑定的数据中(food)添加一个新的属性数据(count),而新添加的属性数据默认是没有数据绑定的,但实际需求中需要该数据有双向绑定的功能？例如，food是ShopGoods传递过来的具有数据绑定的对象,现在想要统计该食物的count数量,但是food对象中没有count属性,如何给food添加一个count属性使得count实现双向绑定的效果？
答:步骤请参考如下:
(1) updateFoodCount (isAdd)方法
(2) action中创建同步获取食物数量更新的方法【updateFoodCount】
(3) mations中食物增加和食物减少方法的创建。【[INCREMENT_FOOD_COUNT]、 [DECREMENT_FOOD_COUNT]】
【★★★★★★】
3.如何使用Vue中的transition给模板增加动画？
(1)将要添加动画的模板添加<transition name="自定义名称"></transition>
(2)给模板增加动态效果。
  &.move-enter-active, &.move-leave-active(显示时候的状态)
    transition all .3s
  &.move-enter, &.move-leave-to
    opacity 0
    transform translateX(15px) rotate(180deg)(隐藏时候的状态)；
4如何阻止事件的冒泡行为?
答：直接在事件名后面加.stop。例如，在加减按钮上的点击事件上加阻止默认行为，即@click.stop=函数名
-->
<template>
  <div class="cartcontrol">
    <transition name="move">
      <div
        class="iconfont icon-remove_circle_outline"
        v-if="food.count"
        @click.stop="updateFoodCount(false)"
      ></div>
    </transition>
    <div class="cart-count" v-if="food.count">{{food.count}}</div>
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
export default {
  props: {
    // 接收ShopGoods传递过来的food，表示一个食物对象
    food: Object
  },

  methods: {
    // 如果+号中的事件处理函数中传递的实参是true，那么isAdd就表示更新的食物数量是否增加
    updateFoodCount(isAdd) {
      this.$store.dispatch("updateFoodCount", { isAdd, food: this.food });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.cartcontrol {
  font-size: 0;

  .cart-decrease {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }

  .icon-remove_circle_outline {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: $green;

    &.move-enter-active, &.move-leave-active {
      transition: all 0.3s;
    }

    &.move-enter, &.move-leave-to {
      opacity: 0;
      transform: translateX(15px) rotate(180deg);
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .icon-add_circle {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: $green;
  }
}
</style>
