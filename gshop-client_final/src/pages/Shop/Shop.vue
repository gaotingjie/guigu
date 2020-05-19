<!--创建一级路由组件shop.vue商家页面组件，其中包括三个2级路由组件:ShopGoods,ShopRating,shopInfo
重点:
1.views文件夹中存储哪些组件?
答:views也就是这里的pages文件夹，用来存储所有的路由组件，当然路由组件主要分为一级路由(页面组件)
和二级路由。
2.如何实现路由的嵌套？
答: 
(1).分别创建1级路由(shop.vue)和2级路由(shopGoods,shopInfo,shopRating),并在router.js中配置路由信息，2级路由写在1级路由的children数组中;
(2).在1级路由组件中使用<router-view></router-view>;用来显示2级路由

-->
<template>
  <div>
    <!-- 商品头信息 -->
    <ShopHeader />
    <!-- 中间导航 -->
    <div class="tab">
      <div class="tab-item"> 
        <router-link to="/shop/goods" replace>点餐</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/shop/ratings" replace>评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/shop/info" replace>商家</router-link>
      </div>
    </div>
    <!-- 2级路由显示区域 --> 
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import ShopHeader from "../../components/ShopHeader/ShopHeader.vue";

export default {
  mounted() {
    this.$store.dispatch("getShopInfo");
  },
  components: {
    ShopHeader
  } 
};
</script> 

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.tab {
  height: 40px;
  line-height: 40px;
  background: #fff;
  bottom-border-1px(rgba(7, 17, 27, 0.1));

  .tab-item {
    float: left;
    width: 33.33333%;
    text-align: center;
    font-size: 14px;
    color: rgb(77, 85, 93);

    a {
      display: block;
      position: relative;

      &.router-link-active {
        color: #02a774;

        &::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 1px;
          width: 35px;
          height: 2px;
          transform: translateX(-50%);
          background: #02a774;
        }
      }
    }
  }
}
</style>