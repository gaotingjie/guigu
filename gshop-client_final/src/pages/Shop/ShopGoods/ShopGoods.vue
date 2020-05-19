<!--"食物点餐"组件
重点:要实现的3个主要功能:(前提:实现左右两个列表的滑动效果。)
1.如何运用scroll库实现左右两侧的列表滑动效果?【★★★★★★】
(1)npm下载better-scroll第三方库: npm install better-scroll -save;
(2)哪个组件中需要使用该库，直接引入即可:import BScroll from "better-scroll"
(3)根据BScroll构造函数创建实例对象 let scroll = new BScroll('.wrapper'),这里的.wrapper类名指的是实现滑动效果的外层div容器。在创建实例对象时要注意其创建时机,必须在当前组件获取到state数据后，页面加载结束后才能创建该实例对象。一般写在this.$nextTick(() => { })函数体内部。
(4)其实创建的实例对象new后面可以传递两个参数，即let scroll = new BScroll('.wrapper',{})。第二个参数是一个对象{},可以添加很多配置选项。官网中提供的选项都可在其中配置，官网提供的API方法，都可以通过实例对象调用。

2.当滑动右侧列表时,自动更新左侧当前分类;【★★★★★★】
△思路:
①根据current类的有无来判断,所以应该用:class={current:index==currentIndex}对象语法,通过判断遍历的下标和当前的下标是否相等，如果相等，则current类生效；
=>
②此时问题就转化为如何得知currentIndex？currentIndex应该是一个计算属性。
=>
③为了计算currentIndex的逻辑应该知道哪些参数变量?
(1)scrollY 右侧滑动的Y轴坐标(滑动过程时刻在变化)--定义在data中
(2)tops:所有右侧分类li的top坐标值组成的数组(列表第一次显示后就不再变化)---定义在data中；
=>
△④通过以上分析问题转化为如下3个:
(1)在滑动过程中如何实时实时收集scrollY的值;【★★★★★★】
答:给滑动实例对象添加on实时监听scroll事件的y坐标，最终将y坐标存储到data中,具体参照Methods中的_intScrollY()
(2)列表第一次显示后,收集tops。【★★★★★★】
答:参照methods中的_initTops()方法。
(3)实现currentIndex的计算逻辑【★★★★★★】
答:思路：scrollY表示滑动的Y轴实时坐标;Tops表示所有li分类高度组成的数组，所以可以通过使用tops.findIndex((top, index)=>{return 判断条件})来得知当前的Index=>所以问题转化为如何写判断条件。
判断条件为:当前滑动的y坐标≥当前的数组元素的高度&&≤下一个top元素的高度；
即:scrollY >= top && scrollY < tops[index + 1];
步骤:具体参照currentIndex()计算属性。

3.当点击某个分类项时,右侧列表滑动到对应位置。【★★★★★★】
思路:①将左侧点击的分类下标index通过函数传递给右侧tops，=>将右侧的tops[index]数据更新，然后赋值给scrollY;=>调用滑动实例的滑动到哪里的API，定位右侧列表分类位置。具体查看clickMenuItem()方法
步骤:
(1)在左侧列表分类的li上绑定click事件，并传递当前点击分类的下标index给事件处理函数；
(2)根据左侧分类传递过去的下标index，更新右侧scrollY的值；
(3)调用滑动实例对象中的 this.foodsScroll.scrollTo(0, -scrollY, 300)方法，实现右侧滑动到指定scrollY位置

4.如何实现当商品goods数据在页面中加载结束后再创建滑动实例对象?(★★★★★★)
方法1:同Miste.vue中轮播图一样，只有当页面数据加载结束后，再创建轮播对象：watch+this.$nextTick()
方法2:
步骤:
(1)在mounted钩子函数中,调用getShopGoods方法,实现给web服务器发送ajax请求,并将响应回来的数据加载到state中的goods中,然后再在computed计算属性中获取state中的goods变量用来页面显示。
(2-1)为了实现当goods数据在页面加载结束后才能立即创建滑动实例对象,应该在调用getShopGoods时，传递第二个参数为一个回调函数,即当数据更新到state中后，立刻执行回调函数；
(2-2)在当前回调函数中的内容为this.$nextTick(() => { }),表示当goods数据在页面中加载显示后,才能立即执行函数体中的语句,创建滑动对象。

5.如何将一个类数组对象(argument)转化为一个数组;
方法为:Array.prototype.slice.call(agrgument)

6.计算属性中的属性何时会执行？
(1)在初始是会自动执行一次;(2)在计算属性相关的变量发生变化时会执行。

6.父组件中如何调用子组件中的方法？【★★★★★】
步骤:
(1)在父组件中引入子组件【例如在ShopGoods中引入子组件Food】
(2)在当前父组件的模板内的子组件标签上添加ref标识；
   <Food :food="food" ref="food" />
(3)在当前父组件的methods中根据ref标识找到子组件对象,并调用其中的方法。
  showFood(food) {
      // 设置food
      this.food = food;
      // 显示food组件 (在父组件中调用子组件对象的方法)
      this.$refs.food.toggleShow();
    }
-->
<template>
  <div>
    <div class="goods">
      <!-- 左侧食物分类导航列表 -->
      <div class="menu-wrapper">
        <ul>
          <!--good表示每一个商品分类-->
          <li
            class="menu-item"
            v-for="(good, index) in goods"
            :key="index"
            :class="{current: index===currentIndex}"
            @click="clickMenuItem(index)"
          >
            <span class="text bottom-border-1px">
              <!-- 因为只有前两个分类有图标，并不是所有的分类都有图标，所以应该用v-if="good.icon"，表示只有当icon存在的时候才会显示 -->
              <img class="icon" :src="good.icon" v-if="good.icon" />
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <!-- 右侧食物明细列表 -->
      <div class="foods-wrapper">
        <!-- 第一层的ul显示所有的分类列表 -->
        <ul ref="foodsUl">
          <!-- 第一层中每一个li是一个商品分类,good就表示一个分类，是一个object格式 -->
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <!-- 第二层ul表示每一个分类下的所有食物列表 -->
            <ul>
              <!-- 第二层中每一个li是每一个分类下的一种食物,food就表示一个食物，是一个对象格式 -->
              <li
                class="food-item bottom-border-1px"
                v-for="(food, index) in good.foods"
                :key="index"
                @click="showFood(food)"
              >
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" />
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <!-- 如果有oldprice才显示，没有oldprice就隐藏 -->
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <!-- 商品加减组件 -->
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 引入底部购物车组件 -->
      <ShopCart />
    </div>
    <!-- 点击商某一商品明细后弹出对应食物的大图层-->
    <!-- 把data中的food变量传递给food子组件 -->
    <Food :food="food" ref="food" />
  </div>
</template>


<script>
import BScroll from "better-scroll";
import { mapState } from "vuex";
import CartControl from "../../../components/CartControl/CartControl.vue";
import Food from "../../../components/Food/Food.vue";
import ShopCart from "../../../components/ShopCart/ShopCart.vue";

export default {
  data() {
    return {
      scrollY: 0, // 右侧滑动的Y轴坐标 (滑动过程时实时变化)
      tops: [], // 所有右侧分类li的top值组成的数组  (列表第一次显示后就不再变化)
      food: {} // 需要显示的food
    };
  },
  mounted() {
    // 组件加载结束后自动调用getShopGoods异步方法,当异步方法中goods数据更新到state中时,再执行后面的回调函数；回调函数中，当列表数据更新显示后，再执行回调函数中的函数体，即创建滑动实例对象。
    this.$store.dispatch("getShopGoods", () => {
      // 数据更新后执行
      this.$nextTick(() => {
        // 列表数据更新显示后执行
        // initScroll()作用是初始化左右两侧的滚动条
        this._initScroll();
        this._initTops();
      });
    });
  },
  computed: {
    ...mapState(["goods"]),

    // 功能:计算得到当前分类的下标
    currentIndex() {
      // 得到条件数据
      const { scrollY, tops } = this;
      // 根据条件数据查询符合条件的top的下标
      const index = tops.findIndex((top, index) => {
        // scrollY>=当前top && scrollY<下一个top
        return scrollY >= top && scrollY < tops[index + 1];
      });
      // 返回结果，该结果就表示当前的分类的下标。
      return index;
    }
  },
  // methods中一般存储事件相关的回调函数,但如果不是事件相关的回调函数，一般函数名前面要加一个_，用来区分。
  methods: {
    // 功能:给左右两侧列表添加滑动效果，并实时监测右侧滑动实例的scrollY的值。最终将scrollY的值存储到data中进行保存
    _initScroll() {
      // 给左侧列表添加滑动效果,当页面数据加载完成后，再创建该实例对象
      new BScroll(".menu-wrapper", {
        click: true
      });
      // 给右侧列表添加滑动效果，当页面数据加载完成后，再创建该实例对象
      this.foodsScroll = new BScroll(".foods-wrapper", {
        probeType: 2, // 因为惯性滑动不会触发
        click: true //当click为false时，阻止原生的click事件
      });

      // 给右侧滑动实例对象(列表)绑定scroll监听,时刻监听scroll的y坐标
      this.foodsScroll.on("scroll", ({ x, y }) => {
        console.log(x, y);
        this.scrollY = Math.abs(y);
      });
      // 给右侧列表绑定scroll结束的监听
      this.foodsScroll.on("scrollEnd", ({ x, y }) => {
        console.log("scrollEnd", x, y);
        this.scrollY = Math.abs(y);
      });
    },
    // 功能: _initTops方法,用来收集右侧滑动列表所有分类的top值。
    _initTops() {
      // 1. 初始化tops
      const tops = [];
      let top = 0;
      tops.push(top);
      // 2. 收集
      // 找到所有分类的li
      const lis = this.$refs.foodsUl.getElementsByClassName("food-list-hook");
      // 收集到的lis是一个argument类数组对象，现在需要将该类数组对象转化为数组。
      // 方法为 Array.prototype.slice.call(lis)
      Array.prototype.slice.call(lis).forEach(li => {
        top += li.clientHeight;
        tops.push(top);
      });

      // 3. 更新数据
      this.tops = tops;
      console.log(tops);
    },

    //功能:实现点击左侧列表分类，右边的列表分类自动定位。
    clickMenuItem(index) {
      // 得到目标位置的scrollY
      const scrollY = this.tops[index];
      // 立即更新scrollY(让点击的分类项成为当前分类)
      this.scrollY = scrollY;
      // 平滑滑动右侧列表
      this.foodsScroll.scrollTo(0, -scrollY, 300);
    },

    // 显示点击的food
    showFood(food) {
      // 获取food后赋值给data中的food变量
      this.food = food;
      // 显示food组件 (在父组件中调用子组件对象的方法)
      this.$refs.food.toggleShow();
    }
  },

  components: {
    CartControl,
    Food,
    ShopCart
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../common/stylus/mixins.styl';

.goods {
  display: flex;
  position: absolute;
  top: 195px;
  bottom: 46px;
  width: 100%;
  background: #fff;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      padding: 0 12px;
      line-height: 14px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        color: $green;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        bottom-border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      bottom-border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
