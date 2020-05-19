<!--重点：
 1.如何实现一个组件在不同的页面组件中的显示与隐藏?
  步骤:在路由字典中给不同的路由字典添加meta属性，meta是一个对象，通过判断showFooter的属性值是false还是true，从而实现显示与隐藏。-->
<template>
  <div id="app">
    <router-view />
    <FooterGuide v-show="$route.meta.showFooter" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import FooterGuide from "./components/FooterGuide/FooterGuide.vue";

export default {
  mounted() {
    // this.$store.dispatch('getAddress')
    this.getAddress();
    this.getUserInfo();
  },

  methods: {
    ...mapActions(["getAddress", "getUserInfo"])
  },

  components: {
    FooterGuide
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.app {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
</style>