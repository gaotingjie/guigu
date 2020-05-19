<!--点餐底部购物车模块
重点:
1.购物车功能分析?
答:购物车中主要有如下两部分构成:
(1)点餐底部购物车部分：
①一个是食物价格总和？
答:totalPrice=每种商品的数量*每种事物的价格的累加和，需要使用arr.reduce()的API记性计算，是一个计算属性
(2)食物列表的实现:
①食物列表如何实现
答:购物车中的事物列表应该是一个数组cartFoods:形式为[{food1},{food2}],数组中的每一个元素是一个对象,每一个对象就代表一个食物对象,可以在food中获取每个食物对应的属性。
②单个食物的数量如何统计？
答:单个食物已经在CartContral组件中实现了，所以直接调用该组件即可
③所有食物总数量如何实现?
答:同统计食物的总价格类似，运用Arr.reduce()统计实现。---是一个计算属性。
2.元素绑定class类名何时使用{}对象语法；何时使用类名绑定？【★★★★★★】
答:
情况一:当知道class要绑定哪一个类时，但是需要判断这个类何时为true,何时为fdalse,这种情况下要按照对象语法进行绑定。
情况二:当class上绑定的是两种类名的切换,应该使用三目表达式,或者计算属性,当当前class满足什么条件时选择第一个类，满足什么条件时选择第二个类,例如该组件中右下角"还差多少钱起送"，就是这种情况。所以需要定义计算属性payClass表示class类的切换；需要定义payText计算属性表示内容文本的切换
3.如何实现购物车列表中商品的添加和移除?【★★★★★★】
答:
添加功能:当点击控制数量加减的+号时,如果food中没有count属性，会在food对象中加一个count属性并且初始值赋为1；并将当前food食物对象push到 cartFoods数组中;如果当前food中已经有初始值count,就直接在原来的数量上+1;具体参考mutations中的[INCREMENT_FOOD_COUNT]方法。
移除功能:当点击控制数量加减的-号时,如果food.count>0,则count--；如果count==0;那么将当前商品从CartFoofs数组中移除。具体参考mutations中的[DECREMENT_FOOD_COUNT]方法。
4.如何实现当默认情况下购物车列表的状态为隐藏?只有当点击底部购物车左侧的div后,且商品数量>0才会显示?
答:
(1)购物车隐藏的第一个条件是:v-show="isShow",设置isShow默认值为false；只有触发底部购物车div点击事件后且商品数量>0才会显示。
notes:但是只这样设置存在一个bug,就是当减去购物列表中的所有商品后"购物车""清空"字样还是存在的。如何解决？
答:这种情况说明，购物列表隐藏有两个条件:一个是isShow;另一个是TotalCount==0.所以这里需要借助计算属性listShow来实现。

-->
<template>
  <div>
    <div class="shopcart">
      <!-- 底部购物车部分 -->
      <div class="content">
        <!-- 左侧购物车，总价，配送费用部分 -->
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount}">
              <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount}"></i>
            </div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalCount}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <!-- 右侧结算 -->
        <div class="content-right">
          <div class="pay" :class="payClass">{{payText}}</div>
        </div>
      </div>
      <!-- 弹出的购物清单部分 -->
      <transition name="move">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
          <div class="list-content">
            <ul>
              <li class="food" v-for="(food, index) in cartFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!-- 透明遮罩层 -->
    <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import BScroll from "better-scroll";
import { mapState, mapGetters } from "vuex";
import CartControl from "../CartControl/CartControl.vue";

export default {
  data() {
    return {
      isShow: false
    };
  },

  computed: {
    // 读取购物车列表数据和商家信息数据
    ...mapState(["cartFoods", "info"]),
    // 获取购物车中的总价格和总个数
    ...mapGetters(["totalCount", "totalPrice"]),
    // 功能；实现最低起送价样式的切换。
    payClass() {
      const { totalPrice } = this;
      const { minPrice } = this.info;
      // 判断条件为当前总价格是否大于最小起送价格
      return totalPrice >= minPrice ? "enough" : "not-enough";
    },
    //功能: 文本存在三种情况,通过payText计算属性实现文本的切换
    payText() {
      const { totalPrice } = this;
      const { minPrice } = this.info;
      if (totalPrice === 0) {
        return `￥${minPrice}元起送`;
      } else if (totalPrice < minPrice) {
        return `还差￥${minPrice - totalPrice}元起送`;
      } else {
        return "结算";
      }
    },

    listShow() {
      // 如果总数量为0, 直接不显示
      if (this.totalCount === 0) {
        this.isShow = false;
        return false;
      }

      if (this.isShow) {
        this.$nextTick(() => {
          //如果实例不存在,则就创建实例对象,【实现BScroll的实例是一个单例】
          if (!this.scroll) {
            this.scroll = new BScroll(".list-content", {
              click: true
            });
          } else {
            // 如果实例存在,就让滚动条刷新一下: 重新统计内容的高度
            this.scroll.refresh();
          }
        });
      }
      return this.isShow;
    }
  },

  methods: {
    toggleShow() {
      // 只有当总数量大于0时切换
      if (this.totalCount > 0) {
        this.isShow = !this.isShow;
      }
    },

    clearCart() {
      MessageBox.confirm("确定清空购物车吗?").then(
        action => {
          this.$store.dispatch("clearCart");
        },
        () => {}
      );
    }
  },
  components: {
    CartControl
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;

  .content {
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background: $green;
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #ffffff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 5px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: 700;
        color: #fff;

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: bottom;
        margin-bottom: 15px;
        margin-left: -45px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        color: #fff;

        &.not-enough {
          background: #2b333b;
        }

        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $green;
        transition: all 0.4s linear;
      }
    }
  }

  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translateY(-100%);

    &.move-enter-active, &.move-leave-active {
      transition: transform 0.3s;
    }

    &.move-enter, &.move-leave-to {
      transform: translateY(0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        bottom-border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  opacity: 1;
  background: rgba(7, 17, 27, 0.6);

  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.5s;
  }

  &.fade-enter, &.fade-leave-to {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
</style>
