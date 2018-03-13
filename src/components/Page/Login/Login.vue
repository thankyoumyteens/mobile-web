<template>
  <transition name="login-move">
    <div class="login" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <h1 class="title"></h1>
        <a class="login-link" @click="doLogin" v-show="isLogin">登陆</a>
        <a class="login-link" @click="doRegister" v-show="!isLogin">注册</a>
      </header>
      <div class="si-content" v-show="isLogin">
        <input type="text" ref="username" placeholder="账号">
        <input type="password" ref="password" placeholder="密码">
        <a class="change-link" @click="changeContent">新用户注册</a>
        <!--<button class="login-button">登陆</button>-->
      </div>
      <div class="si-content" v-show="!isLogin">
        <input type="text" ref="usernameRegister" placeholder="账号">
        <input type="password" ref="passwordRegister" placeholder="密码">
        <input type="password" ref="repeatPassword" placeholder="确认密码">
        <a class="change-link" @click="changeContent">已有账号登陆</a>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {
    path
  } from '@/commons/address.js'

  export default {
    data () {
      return {
        isShow: false,
        isLogin: true
      }
    },
    methods: {
      doRegister () {
        let username = this.$refs.usernameRegister.value
        let password = this.$refs.passwordRegister.value
        let repeatPassword = this.$refs.repeatPassword.value
        if (username === '' || password === '' || repeatPassword === '') {
          return
        }
        if (password !== repeatPassword) {
          alert('两次输入的密码不相同')
          return
        }
        // todo 改成post
        this.$http.get(path()['register'], {
          params: {
            'username': username,
            'password': password
          }
        }).then(response => {
          let res = response.body
          if (res['status'] === 200) {
            let data = res['data']
            this.$emit('success', data)
            this.hide()
          } else {
            console.log(res['message'])
          }
        })
      },
      doLogin () {
        let username = this.$refs.username.value
        let password = this.$refs.password.value
        if (username === '' || password === '') {
          return
        }
        // todo 改成post
        this.$http.post(path()['login'], {
          'username': username,
          'password': password
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = res['data']
            this.$emit('success', data)
            this.hide()
          } else {
            console.log(res['message'])
          }
        })
      },
      changeContent () {
        this.isLogin = !this.isLogin
      },
      show () {
        this.isShow = true
      },
      hide () {
        this.isShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @keyframes bounce-in
    0%
      transform translate3d(100%, 0, 0)
    100%
      transform translate3d(0, 0, 0)
  @keyframes bounce-out
    0%
      transform translate3d(0, 0, 0)
    100%
      transform translate3d(100%, 0, 0)
  .login-move-enter-active
    animation bounce-in .2s linear
  .login-move-leave-active
    animation bounce-out .2s linear
  .login
    position fixed
    top 0
    left 0
    bottom 0
    z-index 999999
    width 100%
    background #fff
    box-sizing border-box
    header
      width 100%
      height 3em
      line-height 3em
      background #c31d00
      position relative
      text-align center
      color #fff
      .close
        position absolute
        left 10px
        top 0
        height 3em
        line-height 3em
        width 3em
      .title
        display inline-block
        height 3em
        line-height 3em
      .login-link
        float right
        margin-right 1em
    .change-link
      display block
      width 95%
      height 2em
      line-height 2em
      color #e31d1a
      margin-left 2.5%
      text-decoration underline
    .si-content
      input, .login-button
        display block
        width 95%
        height 3em
        line-height 3em
        border 0.1em solid #ccc
        margin 1em auto
        border-radius 5px
        padding-left 1em
        box-sizing border-box
      .login-button
        color #fff
        background rgba(240, 20, 20, 0.9)
        &:active
          background rgba(240, 20, 20, 0.8)
        &.disable
          color #ccc
          background rgba(240, 20, 20, 0.7)
</style>
