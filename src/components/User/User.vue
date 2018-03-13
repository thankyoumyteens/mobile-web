<template>
  <div class="user">
    <div class="user-info">
      <!--未登录-->
      <div class="ui-login" @click="showLogin" v-show="!isUser">
        <div class="ui-avatar"><img src="/static/default/avatar.jpg" ></div>
        <div class="ui-text">登陆/注册</div>
      </div>
      <!--已登陆-->
      <div class="ui-user" v-if="isUser&&user!=null">
        <div class="ui-avatar"><img :src="'/static/' + user['avatar']" alt=""></div>
        <div class="ui-username">{{user['nickname']}}</div>
      </div>
    </div>
    <div class="order-info">
      <div class="order-info-item"><img src="./bg.jpg" class="order-info-item-img"><span
        class="order-info-title">全部订单</span></div>
      <div class="order-info-item"><img src="./bg.jpg" class="order-info-item-img"><span
        class="order-info-title">待付款</span></div>
      <div class="order-info-item"><img src="./bg.jpg" class="order-info-item-img"><span
        class="order-info-title">待收货</span></div>
      <div class="order-info-item"><img src="./bg.jpg" class="order-info-item-img"><span
        class="order-info-title">待评价</span></div>
    </div>
    <split></split>
    <login ref="login" @success="loginSuccess"></login>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/Util/Split/Split'
  import login from '@/components/Page/Login/Login'

  export default {
    components: {
      split,
      login
    },
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        isUser: false
      }
    },
    watch: {
      'user' () {
        if (this.user !== null && this.user !== undefined) {
          this.isUser = true
        }
      }
    },
    created () {
      if (this.user !== null && this.user !== undefined) {
        this.isUser = true
      }
    },
    methods: {
      loginSuccess (user) {
        this.$emit('success', user)
      },
      showLogin () {
        this.$refs.login.show()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user
    width 100%
    background #fff
    .user-info
      width 100%
      background url("./bg.jpg") top left no-repeat
      background-size 100%
      margin auto
      border-bottom-left-radius 5%
      border-bottom-right-radius 5%
      .ui-login
        padding 2.5em 0
        width 100%
        text-align center
        .ui-avatar
          display inline-block
          width 3em
          height 3em
          overflow hidden
          border-radius 50%
          img
            width 100%
            height 100%
        .ui-text
          display inline-block
          height 3em
          line-height 3em
          vertical-align top
          margin-left 1em
          color #fff
          &:active
            text-decoration underline
      .ui-user
        padding 2.5em 0
        width 100%
        text-align center
        .ui-avatar
          display inline-block
          width 3em
          height 3em
          overflow hidden
          border-radius 50%
          img
            width 100%
            height 100%
        .ui-username
          display inline-block
          height 3em
          line-height 3em
          vertical-align top
          margin-left 1em
          color #fff
    .order-info
      margin 1em 0
      width 100%
      display flex
      .order-info-item
        flex 1
        text-align center
        .order-info-item-img
          width 50%
          display inline-block
        .order-info-title
          width 100%
          display inline-block
          color #000
</style>
