<!--首页路由组件
重点归纳:
一:组件中正确使用vuex中管理的方法和数据
1.如何获取vuex中state中的数据变量?(获取state数据一般是在计算属性定义使用)
答:方法1:this.$store.state.变量名;
   方法2:引入映射函数mapState，并使用,
   步骤1:import {mapState} from "vuex";
   步骤2:在计算属性中调用mapState，即...mapState(["要获取的变量名"]);
   步骤3:此时获取到的数据变量就可以在temppalte模板中使用指令语法实现数据绑定显示 
2.组件中如何调用actions中的异步方法？(一般在钩子函数/methods中定义使用)
 方法1:this.$store.dispatch("异步方法名")
 方法2:引入映射函数mapActions，并使用;
 步骤1:import {mapActions} from "vuex";
 步骤2:在methods中调用mapActions,即： ...mapActions(["异步函数名"]);
 步骤3:假如钩子函数中想要创建组件自动调用actions中的异步函数，可以直接在created(){
   this.异步函数名
 }即可。
3.组件异步显示数据的步骤(☆☆☆☆☆☆☆)
答：共三步:
(1)在该组件的methods中调用vuex中actions中的异步方法;该异步方法调用后会获取web服务器响应回来的数据,并通过函数内自动调用mutations中的同步方法，进而修改state中的数据变量;
(2)在该组件的computed计算属性中读取state中的数据,
(3)将获取到的数据显示在template模板中
4.模板中显示数据的来源有哪些？
答:该组件中的data;props;computed(可以从当前data，props、别的compute，获取vuex中的state)
二.轮播图部分难点
4.☆☆☆☆☆如何将web服务器返回的一维数组转化成二维数组，并且每个二位子数组中保存的元素长度最多8个，也就是将[{},{},{},{},{}]=>[ [{},{}], [{},{}] ],具体查看计算属性中的categorysAr方法。
5.如何实现当页面异步加载结束后再立即创建new swiper轮播图实例对象？
答:在本页面组件中，分类列表显示格式为轮播图显示,但是轮播图实例创建时间必须注意。当脚手架向web服务器发送ajax请求后，响应回来的数据自动更新到state的categorys变量中，然后该组件再在计算属性中获取state中的categorys数据，最终显示到页面上,只有当界面异步更新完毕后，才能再创建轮播图实例对象，实现轮播图显示功能。那么如何才能知道当前页面数据是否更新了呢，应该在watch中监听categorys变量；那么如何才能知道界面异步更新结束了呢，这里可以使用this.$nextTick(()=>{}),当界面更新后立即执行该回调函数。创建轮播图实例对象。
三.
6.难点: if(!a)和if(a)代表啥意思？
答:
(1)如果a是一个Bool值，那么if(!a) <=>  if(a===false),则执行后面的操作;if(a) <=> if(a==true)
(2)如果a为整型,那么if(!a) <=> if(a===0),则执行后面操作;if(a) <=> if(a!==0)，则执行后续操作
(3)如果在三目或者if/v-if语句中判断一个对象中的某个属性是否存在，则if(a)通常表示，如果a存在;if(!a)则表示如果a不存在，则...
--> 
 
<template>
  <section class="msite">
    <!--首页头部,引入HeadedTop组件-->
    <HeaderTop :title="address.name">
      <!-- slot传递给子组件HeadTop -->
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <!-- 如果userInfo._id存在，则跳转到/userInfo路由组件；否则跳转到登录组件 -->
      <router-link class="header_login" slot="right" :to="userInfo._id ? '/userinfo': '/login'">
        <!-- 如果userInfo._id不存在，则显示登录/注册 -->
        <span class="header_login_text" v-if="!userInfo._id">登录|注册</span>
        <!-- 否则显示图标 -->
        <span class="header_login_text" v-else>
          <i class="iconfont icon-person"></i>
        </span>
      </router-link>
    </HeaderTop>
    <div class="miste-content-wrapper">
      <div class="miste-content">
        <!--首页导航-->
        <nav class="msite_nav">
          <!-- 添加轮播图 -->
          <div class="swiper-container" v-if="categorys.length">
            <div class="swiper-wrapper">
              <!-- categorysArr表示将一维数组格式转换成二维数组形式后的数据：
              [ [{},{}], [{},{}], [{},{}] ] 
              categorys表示每一个二维子数组[{}],
              -->
              <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">
                <!-- category表示二维子数组中的一个对象 -->
                <a
                  href="javascript:"
                  class="link_to_food"
                  v-for="(category, index) in categorys"
                  :key="index"
                >
                  <div class="food_container">
                    <!-- 因为服务器返回的地址是不完整的，所有前面可以拼接上地址前面的那部分 -->
                    <img :src="baseImageUrl+category.image_url" />
                  </div>
                  <span>{{category.title}}</span>
                </a>
              </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
          </div>
          <img src="./images/msite_back.svg" alt="back" v-else />
        </nav>
        <!--首页附近商家-->
        <div class="msite_shop_list">
          <div class="shop_header">
            <i class="iconfont icon-xuanxiang"></i>
            <span class="shop_header_title">附近商家</span>
          </div>
          <!-- 引入商家列表组件ShopList -->
          <ShopList />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BScroll from "better-scroll";
import { mapState } from "vuex";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";

import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import ShopList from "../../components/ShopList/ShopList.vue";

export default {
  data() {
    return {
      // 存储图片地址前半个路径
      baseImageUrl: "https://fuss10.elemecdn.com"
    };
  },
  mounted() {
    // 调用actions中的异步处理函数，向web服务器发送ajax请求,获取食品分类和商家列表数据,间接实现state中数据变量的更新。
    this.$store.dispatch("getCategorys");
    this.$store.dispatch("getShops");
  },

  computed: {
    // 获取state中的数据变量，用来在template模板中界面异步显示。
    ...mapState(["address", "categorys", "userInfo"]),

    /* categorsArr功能:根据categorys一维数组生成一个2维数组,且小数组中的元素个数最大是8
    即将[{},{},{},{},{}]=>[ [{},{}], [{},{}] ]。*/
    categorysArr() {
      // 从this对象中解构出categorys数组
      const { categorys } = this;
      // arr表示外侧空的大数组,即 arr=[];
      const arr = [];
      // minArr表示内层空的二维小数组,即minArr=[],
      let minArr = [];
      // 遍历categorys一维数组,c表示数组中的每个对象元素
      categorys.forEach(c => {
        // 如果当前小数组已经满了, 创建一个新的,
        if (minArr.length === 8) {
          minArr = [];
        }
        // 如果minArr是空的, 将小数组保存到大数组中
        if (minArr.length === 0) {
          arr.push(minArr);
        }
        // 将当前分类保存到小数组中
        minArr.push(c);
      });
      // 上面的逻辑为:[]=>[[]]=>[[{}]]=>[ [{}*8] ]=>创建一个空数组[]=>[[{}*8],[]]=>return arr

      return arr;
    }
  },

  watch: {
    //功能: 用来监听categorys数据是否更新，当页面异步加载完毕后，自动创建轮播图实例对象。
    categorys(value) {
      // categorys数组中有数据了, 在异步更新界面之前执行
      // 使用setTimeout可以实现效果, 但不是太好，因为无法把握当前页面异步加载何时完成。
      /*setTimeout(() => {
          // 创建一个Swiper实例对象, 来实现轮播
          new Swiper('.swiper-container', {
            loop: true, // 可以循环轮播
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
          })
        }, 100)*/

      // 界面更新就立即创建Swiper对象
      this.$nextTick(() => {
        // 一旦完成界面更新, 立即调用(此条语句要写在数据更新之后)
        // 创建一个Swiper实例对象, 来实现轮播
        new Swiper(".swiper-container", {
          loop: true, // 可以循环轮播
          // 如果需要分页器
          pagination: {
            el: ".swiper-pagination"
          }
        });

        new BScroll(".miste-content-wrapper", {
          click: true
        });
      });
    }
  },

  components: {
    HeaderTop,
    ShopList
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.msite { // 首页
  width: 100%;

  .miste-content-wrapper {
    position: fixed;
    top: 45px;
    bottom: 46px;
    width: 100%;

    .msite_nav {
      bottom-border-1px(#e4e4e4);
      margin-top: 15px;
      height: 200px;
      background: #fff;

      .swiper-container {
        width: 100%;
        height: 100%;

        .swiper-wrapper {
          width: 100%;
          height: 100%;

          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap;

            .link_to_food {
              width: 25%;

              .food_container {
                display: block;
                width: 100%;
                text-align: center;
                padding-bottom: 10px;
                font-size: 0;

                img {
                  display: inline-block;
                  width: 50px;
                  height: 50px;
                }
              }

              span {
                display: block;
                width: 100%;
                text-align: center;
                font-size: 13px;
                color: #666;
              }
            }
          }
        }

        .swiper-pagination {
          >span.swiper-pagination-bullet-active {
            background: #02a774;
          }
        }
      }
    }

    .msite_shop_list {
      top-border-1px(#e4e4e4);
      margin-top: 10px;
      background: #fff;

      .shop_header {
        padding: 10px 10px 0;

        .shop_icon {
          margin-left: 5px;
          color: #999;
        }

        .shop_header_title {
          color: #999;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>