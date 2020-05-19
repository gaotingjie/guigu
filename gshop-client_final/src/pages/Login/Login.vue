<!--登录页面组件
重点及难点汇总：
一.前端界面效果难点
1.如何实现短信登录和密码登录的页面切换?使得登录头和登录页面关联。
答: 
(1)登录头通过判断on属性是否生效，如果on生效，即on=true，则当前a标签为加粗显示；否则on失效。所以可以借助定义一个变量用来保存on属性的属性值为true还是false实现登录头切换的功能；再通过点击事件可以改变data中变量的值。
(2)登录内容的切换也是根据on属性来判断的，登录内容默认样式为隐藏，只有当登录内容的div的on属性生效，则当前登录内容才会显示,所以当其中一个on=ture，那么另一个on=!true,即可以实现登录内容的切换。
以上可知,页面切换的难点在于用一个变量定义on的状态，进而一个变量可以同时控制登录头和登录内容。

2.如何实现输入手机号后,通过判断手机号的正确与否，改变“获取验证码”的样式呢？
答:分析需求分析可知，假如输入的手机号正确,"获取验证码"黑色显示；假如输入的手机号错误,“获取验证码”呈现灰色，所以改变的是"获取验证码"的格式,通过添加一个class类属性rightPhone,通过判断手机号是否正确实现该属性是否生效，又因为该属性为true或者false,与手机号的正确与否而实现的，所以应该讲rightPhone的属性值定义为一个计算属性，返回值为true或者false,这样一想，只有正则中reg.test(str)来实现；

3.form表单默认行为是当点击表单中任意一个点击事件后，都会将整个表单进行提交，但是例如在点击获取验证码按钮时，我们只想给对应的手机号发送ajax请求，不想提交整个表单，这时候的解决办法是在绑定的点击事件后加上阻止默认行为即可:  @click.prevent="getCode"

4.如何实现当点击“获取验证码”按钮时，实现倒计时效果？【难点】
答:要实现的功能为:当点击获取验证码时,子样由“获取验证码”变为"已发送(30s)",所以需要内容绑定，定义一个变量computeTime=0,当该变量为0时,显示获取验证码,当点击验证码事件后，该变量就会>0，显示倒计时xxs，所以在定义点击事件getCode时声明其实时间，并排除不可点的情况:①当定时器在倒计时时，不能再点；当发送请求失败后，不能执行定时器。

5.实现密码登录表单中密码的显示与隐藏？
答:其实是两个input标签(type="text"和type="password")，通过定义一个变量，通过判断该变量时true还是false，用v-if语法实现两种显示的的隐藏和显示。
6.难点: if(!a)和if(a)代表啥意思？
答:如果a是一个Bool值，那么if(!a)  (等价于)<=>  if(a===false),则执行后面的操作
  如果a为整型,那么if(!a) <=> if(a===0),则执行后面操作。
  如果在三目或者if语句中判断一个对象中的某个属性是否存在，则if(a)通常表示，如果a存在;if(!a)则表示如果a不存在，则...
7.点击登录按钮后如何实现弹出提示框，并实现提示框的内容根据实际情况切换？
答:(1)把弹出的提示框封装成一个组件AlertTip.vue
(2)通过v-show实现其是否显示或者隐藏；通过closeTip方法(子组件分发了一个函数出来)，实现关闭当前提示框并清空提示框中内容。

二.前后端交互难点
8.异步登录步骤
步骤:
(1)先判断是短信登录还是密码登录；
(2)如果是短信登录，需要先进行前台格式验证。需要先解构出短信登录需要的变量，判断这些变量格式是否正确,如果不正确弹出提示框，如果正确，则继续执行ajax请求。获取响应结果
(3)否则如果是密码登录，需要先进行前台格式验证。需要先解构出密码登录需要的变量，判断这些变量的格式是否正确，如果不正确，弹出提示框没如果正确，则继续执行ajax请求。获取响应结果。
(4)然后判断定时器是否还处于倒计时，如果是则停止定时器；
(5)根据服务器响应回来的数据，进行判断请求是否成功。
(5-1)如果请求成功，需要做两件事情:①保存当前用户的信息至state中管理;②跳转页面至个人中心。
(5-2)如果请求失败,需要做两件事情:①更新图片验证码;②弹出错误提示框;

9.如何实现自动登录?
步骤:1.当加载app.vue时候，自动给web服务器发送ajax请求获取用户信息userinfo，如果得到则会自动登录，否则，不会自动登录。
步骤2:在action中创建一个方法，用来异步发送ajax请求，获取用户信息。
-->

<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <!-- 登录头 -->
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <!-- 登录内容 -->
      <div class="login_content">
        <form @submit.prevent="login">
          <!-- 短信登录表单 -->
          <div :class="{on: loginWay}">
            <!-- 输入手机号并点击获取验证码 -->
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" />
              <!-- rightPhone的值为true/false，与v-model中的phone有关，所以rigtPhone是一个计算属性 -->
              <button
                :disabled="!rightPhone"
                class="get_verification"
                :class="{right_phone: rightPhone}"
                @click.prevent="getCode"
              >{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
            </section>
            <!-- 输入获取到的验证码 -->
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code" />
            </section>
            <!-- 温馨提示 -->
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <!-- 密码登录表单 -->
          <div :class="{on: !loginWay}">
            <section>
              <!-- 输入手机号/邮箱/用户名 -->
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name" />
              </section>
              <!-- 输入密码 -->
              <section class="login_verification">
                <!-- 如果v-if判断条件为false,则隐藏，所以text隐藏，password显示 -->
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd" />
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd" />
                <!-- 当showPwd为ture时，也就是显示type="text"时，显示on；否则显示off -->
                <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                  <!-- 当showPwd为true时，也就是显示形式为text时，添加right类 -->
                  <div class="switch_circle" :class="{right: showPwd}"></div>
                  <!-- 当showPwd为true时，也就是显示形式为text时，显示文本为abc -->
                  <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                </div>
              </section>
              <!-- 输入验证码 -->
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha" />
                <img
                  class="get_verification"
                  src="http://localhost:4000/captcha"
                  alt="captcha"
                  @click="getCaptcha"
                  ref="captcha"
                />
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <!-- $router.back()表示返回上一个路由 -->
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <!-- closeTip函数的作用是关闭显示框，清空alertTxet内容 -->
    <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip" />
  </section>
</template>

<script>
import AlertTip from "../../components/AlertTip/AlertTip.vue";
import { reqSendCode, reqSmsLogin, reqPwdLogin } from "../../api";
export default {
  data() {
    return {
      loginWay: false, // true代表短信登陆, false代表密码
      computeTime: 0, // 计时的时间
      showPwd: false, // 是否显示密码
      phone: "", // 手机号
      code: "", // 短信验证码
      name: "", // 用户名
      pwd: "", // 密码
      captcha: "", // 图形验证码
      alertText: "", // 提示文本
      alertShow: false // 是否显示警告框
    };
  },

  computed: {
    // 功能:通过判断手机号格式是否正确，从而实现"获取验证码"按钮中的rightPhone属性是否生效。
    rightPhone() {
      return /^1\d{10}$/.test(this.phone);
    }
  },

  methods: {
    // 方法功能:异步获取短信验证码
    // 步骤:
    // (1)先做未交互时验证码倒计时的效果;
    // (1-1)如果computeTime==0,则启动定时器倒计时，如果倒计时<=0,则停止倒计时;
    // (2)再发送ajax请求,获取响应回来的数据;
    // (3)如果请求失败，则弹出错误提示框，并且倒计时停止。
    async getCode() {
      // 如果当前没有计时,也就是说如果当前computeTime=0,则才可以执行定时器操作，如果当前处于倒计时过程，即computeTine>0,不可以执行倒计时操作。
      // this.computeTime=0 等价于!this.computeTime
      if (!this.computeTime) {
        // 启动倒计时
        this.computeTime = 30;
        this.intervalId = setInterval(() => {
          this.computeTime--;
          if (this.computeTime <= 0) {
            // 停止计时
            clearInterval(this.intervalId);
          }
        }, 1000);

        // 发送ajax请求(向指定手机号发送验证码短信)
        const result = await reqSendCode(this.phone);
        // 如果发送失败
        if (result.code === 1) {
          // 显示提示
          this.showAlert(result.msg);
          // 停止计时
          // if(this.computeTime) <=> if(this.computeTime≠0)，也就是还在倒计时
          if (this.computeTime) {
            this.computeTime = 0;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
          }
        }
      }
    },
    // 方法功能:点击登录,实现弹出提示框显示，并且输入对应提示文本。
    showAlert(alertText) {
      this.alertShow = true;
      this.alertText = alertText;
    },
    // 方法功能:异步登陆
    // 步骤:
    // (1)先判断是短信登录还是密码登录；
    // (2)如果是短信登录，需要先解构出短信登录需要的变量，判断这些变量格式是否正确,如果不正确弹出提示框，如果正确，则继续执行ajax请求。
    // (3)否则如果是密码登录，需要先解构出密码登录需要的变量，判断这些变量的格式是否正确，如果不正确，弹出提示框没如果正确，则继续执行ajax请求。
    // (4)然后判断定时器是否还处于倒计时，如果是则停止定时器；
    // (5)根据服务器响应回来的数据，进行判断请求是否成功。
    // (5-1)如果请求成功，需要做两件事情:①保存当前用户的信息至state中管理;②跳转页面至个人中心。
    // (5-2)如果请求失败,需要做两件事情:①更新图片验证码;②弹出错误提示框;
    async login() {
      let result;
      // 1.先判断是短信登录还是密码登录
      // (1)如果是短信登录表单
      if (this.loginWay) {
        // (1-1).对象解构出短信登录中的变量
        const { rightPhone, phone, code } = this;
        //notes: if(!this.rightPhone <=> if(this.rightPhone===false),即如果正确手机号为false，则执行后续操作
        if (!this.rightPhone) {
          // 手机号不正确
          this.showAlert("手机号不正确");
          return;
          // 如果验证码错误
        } else if (!/^\d{6}$/.test(code)) {
          // 验证必须是6位数字
          this.showAlert("验证必须是6位数字");
          return;
        }
        // 2.发送ajax请求短信登陆
        result = await reqSmsLogin(phone, code);
      } else {
        // (2)如果是密码表单登陆
        const { name, pwd, captcha } = this;
        // 如果用户名不正确
        if (!this.name) {
          // 用户名必须指定
          this.showAlert("用户名必须指定");
          return;
          // 如果密码不正确
        } else if (!this.pwd) {
          // 密码必须指定
          this.showAlert("密码必须指定");
          return;
          // 如果acptcha不正确
        } else if (!this.captcha) {
          // 验证码必须指定
          this.showAlert("验证码必须指定");
          return;
        }
        // 发送ajax请求密码登陆
        result = await reqPwdLogin({ name, pwd, captcha });
      }

      // 停止计时
      if (this.computeTime) {
        this.computeTime = 0;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }

      // 根据结果数据处理
      if (result.code === 0) {
        const user = result.data;
        // 将user保存到vuex的state
        this.$store.dispatch("recordUser", user);
        // 去个人中心界面
        this.$router.replace("/profile");
      } else {
        // 显示新的图片验证码
        this.getCaptcha();
        // 显示警告提示
        const msg = result.msg;
        this.showAlert(msg);
      }
    },
    // 方法功能:关闭警告框
    closeTip() {
      this.alertShow = false;
      this.alertText = "";
    },
    // 获取一个新的图片验证码
    getCaptcha() {
      // 每次指定的src要不一样
      this.$refs.captcha.src =
        "http://localhost:4000/captcha?time=" + Date.now();
    }
  },

  components: {
    AlertTip
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.loginContainer {
  width: 100%;
  height: 100%;
  background: #fff;

  .loginInner {
    padding-top: 60px;
    width: 80%;
    margin: 0 auto;

    .login_header {
      .login_logo {
        font-size: 40px;
        font-weight: bold;
        color: #02a774;
        text-align: center;
      }

      .login_header_title {
        padding-top: 40px;
        text-align: center;

        >a {
          color: #333;
          font-size: 14px;
          padding-bottom: 4px;

          &:first-child {
            margin-right: 40px;
          }

          &.on {
            color: #02a774;
            font-weight: 700;
            border-bottom: 2px solid #02a774;
          }
        }
      }
    }

    .login_content {
      >form {
        >div {
          display: none;

          &.on {
            display: block;
          }

          input {
            width: 100%;
            height: 100%;
            padding-left: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: 0;
            font: 400 14px Arial;

            &:focus {
              border: 1px solid #02a774;
            }
          }

          .login_message {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .get_verification {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
              border: 0;
              color: #ccc;
              font-size: 14px;
              background: transparent;

              &.right_phone {
                color: black;
              }
            }
          }

          .login_verification {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .switch_button {
              font-size: 12px;
              border: 1px solid #ddd;
              border-radius: 8px;
              transition: background-color 0.3s, border-color 0.3s;
              padding: 0 6px;
              width: 30px;
              height: 16px;
              line-height: 16px;
              color: #fff;
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);

              &.off {
                background: #fff;

                .switch_text {
                  float: right;
                  color: #ddd;
                }
              }

              &.on {
                background: #02a774;
              }

              >.switch_circle {
                position: absolute;
                top: -1px;
                left: -1px;
                width: 16px;
                height: 16px;
                border: 1px solid #ddd;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                transition: transform 0.3s;

                &.right {
                  transform: translateX(30px);
                }
              }
            }
          }

          .login_hint {
            margin-top: 12px;
            color: #999;
            font-size: 14px;
            line-height: 20px;

            >a {
              color: #02a774;
            }
          }
        }

        .login_submit {
          display: block;
          width: 100%;
          height: 42px;
          margin-top: 30px;
          border-radius: 4px;
          background: #4cd96f;
          color: #fff;
          text-align: center;
          font-size: 16px;
          line-height: 42px;
          border: 0;
        }
      }

      .about_us {
        display: block;
        font-size: 12px;
        margin-top: 20px;
        text-align: center;
        color: #999;
      }
    }

    .go_back {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 30px;
      height: 30px;

      >.iconfont {
        font-size: 20px;
        color: #999;
      }
    }
  }
}
</style>