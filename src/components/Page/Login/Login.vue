<template>
  <transition name="login-move">
    <div class="login" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <h1 class="title"></h1>
        <a class="login-link" @click="doLogin" v-show="isLogin">{{loginText}}</a>
        <a class="login-link" @click="doRegister" v-show="!isLogin">{{regText}}</a>
      </header>
      <div class="si-content" v-show="isLogin">
        <input type="text" ref="username" placeholder="账号">
        <input type="password" ref="password" placeholder="密码">
        <a class="change-link" @click="changeContent">新用户注册</a>
        <a class="change-link" @click="forgetPassword">忘记密码?</a>
        <!--<button class="login-button">登陆</button>-->
      </div>
      <div class="si-content" v-show="!isLogin">
        <input type="text" ref="usernameRegister" placeholder="账号">
        <input type="text" ref="nicknameRegister" placeholder="昵称">
        <input type="password" ref="passwordRegister" placeholder="密码">
        <input type="password" ref="repeatPassword" placeholder="确认密码">
        <input type="text" ref="emailRegister" placeholder="邮箱">
        <input type="number" ref="phoneRegister" placeholder="手机号码">
        <a class="change-link" @click="changeContent">已有账号登陆</a>
      </div>
      <qrpw ref="qrpw"></qrpw>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { Dialog } from 'we-vue'
  import qrpw from '@/components/Util/UtilPage/QuestionResetPasswordWrapper'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      qrpw
    },
    data () {
      return {
        isShow: false,
        isLogin: true,
        loginText: '登陆',
        regText: '注册'
      }
    },
    methods: {
      doRegister () {
        let username = this.$refs.usernameRegister.value
        let password = this.$refs.passwordRegister.value
        let repeatPassword = this.$refs.repeatPassword.value
        let nickname = this.$refs.nicknameRegister.value
        let email = this.$refs.emailRegister.value
        let phone = this.$refs.phoneRegister.value
        if (username === '' || password === '' || repeatPassword === '') {
          return
        }
        if (password !== repeatPassword) {
          Dialog({
            title: '提示',
            message: '两次输入的密码不相同',
            skin: 'ios'
          })
          return
        }
        if (!(/^[a-zA-z]\w{3,15}$/.test(username))) {
          Dialog({
            title: '提示',
            message: '用户名格式有误，请重填',
            skin: 'ios'
          })
          return false
        }
        if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
          Dialog({
            title: '提示',
            message: '邮箱格式有误，请重填',
            skin: 'ios'
          })
          return false
        }
        if (!(/^1[34578]\d{9}$/.test(phone))) {
          Dialog({
            title: '提示',
            message: '请输入有效的手机号码',
            skin: 'ios'
          })
          return false
        }
        this.regText = '请稍等...'
        this.$http.post(path()['register'], {
          'username': username,
          'password': password,
          'nickname': nickname,
          'email': email,
          'phone': phone
        }).then(response => {
          let res = response.body
          this.regText = '注册'
          if (res['status'] === 0) {
            Dialog({
              title: '注册成功',
              message: res['msg'],
              skin: 'ios'
            })
            this.changeContent()
          } else {
            Dialog({
              title: '注册失败',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      doLogin () {
        let username = this.$refs.username.value
        let password = this.$refs.password.value
        if (username === '' || password === '') {
          return
        }
        this.loginText = '请稍等...'
        this.$http.post(path()['login'], {
          'username': username,
          'password': password
        }).then(response => {
          let res = response.body
          this.loginText = '登陆'
          if (res['status'] === 0) {
            let data = res['data']
            this.$emit('success', data)
            this.hide()
          } else {
            Dialog({
              title: '登陆失败',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      changeContent () {
        this.isLogin = !this.isLogin
      },
      forgetPassword () {
        this.$refs.qrpw.show()
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
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
    header
      width 100%
      height 3em
      line-height 3em
      background #dc143c
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
      color #dc143c
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
