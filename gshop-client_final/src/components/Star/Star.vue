<!--星星评分组件☆☆☆☆☆☆
重点/难点:
1.星星评分与哪些变量有关?
答:(1)首先星星有三种尺寸区分,所以第一个变量就是星星尺寸的大小，定义变量size，有父组件shopList传递过来；
   (2)星星的评分要与真实的商家评分相吻合，根据商家实际评分，选择该商家需要多少个on全星，多少个half半星，所少个off空灰星。
2.如何动态生成星星评分，实现on，half，off的数量与评分数字相吻合?
答:
(1).先写出静态页面内容;
(2).静态页面是根据class类选择器绑定on，off,half从而实现全星，半星，灰星的切换，所有动态实现也得从类选择器下手;
(3).使用反推的方式进行:①假设starClasses为一个数组，存储了单个商家所有的on,off,half类，例如["on","off","half"];那么只要能确定starClasses数组内部元素的具体值，即可通过遍历starClasses数组，然后将每一个遍历的类名绑定class指令，即可实现单个商户的星星评分功能。所有重点在如何计算starClasses数组的具体值。
-->
<template>
  <div class="star" :class="'star-'+size">
    <span class="star-item" v-for="(sc, index) in starClasses" :class="sc" :key="index"></span>
  </div>
</template>
<script>
// 类名常量
const CLASS_ON = "on";
const CLASS_HALF = "half";
const CLASS_OFF = "off";

export default {
  props: {
    score: Number,
    size: Number
  },

  computed: {
    /*总分=整星个数on+半星个数half(半星个数只有可能是0或者1)+灰星个数off;
      3.2: 3 + 0 + 2
      3.5: 3 + 1 + 1
       */
    starClasses() {
      const { score } = this;
      const scs = [];
      // 向scs中添加n个CLASS_ON
      const scoreInteger = Math.floor(score);
      for (let i = 0; i < scoreInteger; i++) {
        scs.push(CLASS_ON);
      }
      // 向scs中添加0/1个CLASS_HALF
      if (score * 10 - scoreInteger * 10 >= 5) {
        scs.push(CLASS_HALF);
      }
      // 向scs中添加n个CLASS_OFF
      while (scs.length < 5) {
        scs.push(CLASS_OFF);
      }

      return scs;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.star { // 2x图 3x图
  float: left;
  font-size: 0;

  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }

  &.star-48 {
    .star-item {
      width: 20px;
      height: 20px;
      margin-right: 22px;
      background-size: 20px 20px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('./images/star48_on');
      }

      &.half {
        bg-image('./images/star48_half');
      }

      &.off {
        bg-image('./images/star48_off');
      }
    }
  }

  &.star-36 {
    .star-item {
      width: 15px;
      height: 15px;
      margin-right: 6px;
      background-size: 15px 15px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('./images/star36_on');
      }

      &.half {
        bg-image('./images/star36_half');
      }

      &.off {
        bg-image('./images/star36_off');
      }
    }
  }

  &.star-24 {
    .star-item {
      width: 10px;
      height: 10px;
      margin-right: 3px;
      background-size: 10px 10px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('./images/star24_on');
      }

      &.half {
        bg-image('./images/star24_half');
      }

      &.off {
        bg-image('./images/star24_off');
      }
    }
  }
}
</style>