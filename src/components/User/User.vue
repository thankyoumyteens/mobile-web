<template>
  <div class="user">
    <div class="user-info">
      <!--未登录-->
      <div class="ui-login" @click="login" v-show="!isUser">
        <div class="ui-avatar"><img src="/static/default/avatar.jpg" alt=""></div>
        <div class="ui-text">登陆/注册</div>
      </div>
      <!--已登陆-->
      <div class="ui-user" v-if="isUser"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isUser: false
      }
    },
    methods: {
      login () {
        // 登陆
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user
    width 100%
    .user-info
      background #e31d1a
      width 90%
      margin 1em auto
      .ui-login
        padding 0.5em 0
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
          color #ccc
          &:active
            text-decoration underline
</style>
