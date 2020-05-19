  // 底部导航组件

<!--该组件重点汇总:
1.如何实现点击导航栏下面的哪一个按钮，然后实现背景色的切换？
方法:通过给on属性绑定样式，用对象语法:如果当前的路由地址===url地址栏的地址则显示on样式;
2.如何实现点击对应的按钮实现对应路由组件的跳转?
方法:通过给每个按钮a标签绑定单击事假处理函数，传递一个实参(就是点击此按钮后要跳转的组件的path相对路径),然后再add方法中使用this.$router.replace(path)
-->

<template>
  <div class="footer_guide">
    <!--1. 如何实现点击导航栏下面的哪一个按钮，然后实现背景色的切换？ 方法:通过给on属性绑定样式，用对象语法:如果当前的路由地址===url地址栏的地址则显示on样式 -->
    <!-- 2.如何实现点击对应的按钮实现路由组件的跳转?
    方法:给每个按钮绑定单击事件，传递一个实参(要跳转到哪里的路由地址)-->

    <!-- 首页 -->
    <span class="guide_item" :class="{on: '/msite'===$route.path}" @click="goTo('/msite')">
      <span class="item_icon">
        <i class="iconfont icon-waimai"></i>
      </span>
      <span>外卖</span>
    </span>
    <!-- 搜索 -->
    <a
      href="javascript:;"
      class="guide_item"
      :class="{on: '/search'===$route.path}"
      @click="goTo('/search')"
    >
      <span class="item_icon">
        <i class="iconfont icon-search"></i>
      </span>
      <span>搜索</span>
    </a>
    <!-- 订单 -->
    <a
      href="javascript:;"
      class="guide_item"
      :class="{on: '/order'===$route.path}"
      @click="goTo('/order')"
    >
      <span class="item_icon">
        <i class="iconfont icon-dingdan"></i>
      </span>
      <span>订单</span>
    </a>

    <!--我的  -->
    <a
      href="javascript:;"
      class="guide_item"
      :class="{on: '/profile'===$route.path}"
      @click="goTo('/profile')"
    >
      <span class="item_icon">
        <i class="iconfont icon-geren"></i>
      </span>
      <span>我的</span>
    </a>
  </div>
</template>

<script>
export default {
  methods: {
    //功能: 跳转对应的路由地址
    goTo(path) {
      // replace同样是跳转到指定的url，但是这个方法不会向history里面添加新的记录，点击返回，不会跳转到上一个页面。上一个记录是不存在的
      this.$router.replace(path);
      // push会跳转到不同的url，但这个方法会向history栈添加一个记录，点击后退会返回到上一个页面
      // this.$router.push(path)
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.footer_guide { // footer
  top-border-1px(#e4e4e4);
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  height: 50px;
  display: flex;

  .guide_item {
    display: flex;
    flex: 1;
    text-align: center;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    color: #999999;

    &.on {
      color: #02a774;
    }

    span {
      font-size: 12px;
      margin-top: 2px;
      margin-bottom: 2px;

      .iconfont {
        font-size: 22px;
      }
    }
  }
}
</style>