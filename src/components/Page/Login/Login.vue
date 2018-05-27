<template>
  <transition name="login-move">
    <div class="login" v-show="isShow">
      <v-header :titleText="isLogin ? '登陆' : '注册'" actionText="" @back="hide"></v-header>
      <div class="si-content" v-show="isLogin">
        <wv-group title="">
          <wv-input label="用户名" placeholder="" v-model="username"></wv-input>
          <wv-input label="密码" placeholder="" v-model="password" type="password"></wv-input>
        </wv-group>
        <a class="change-link" @click="changeContent">新用户注册</a>
        <a class="change-link" @click="forgetPassword">忘记密码?</a>
        <wv-group title="">
          <wv-button type="warn" :is-loading="isLoginDoing" @click="doLogin">登陆</wv-button>
        </wv-group>
      </div>
      <div class="si-content" v-show="!isLogin">
        <wv-group title="">
          <wv-input label="用户名" placeholder="" v-model="usernameRegister"></wv-input>
          <wv-input label="昵称" placeholder="" v-model="nicknameRegister"></wv-input>
          <wv-input label="密码" placeholder="" v-model="passwordRegister" type="password"></wv-input>
          <wv-input label="确认密码" placeholder="" v-model="repeatPassword" type="password"></wv-input>
          <wv-input label="邮箱" placeholder="" v-model="emailRegister"></wv-input>
          <wv-input label="手机号码" placeholder="" v-model="phoneRegister"></wv-input>
        </wv-group>
        <a class="change-link" @click="changeContent">已有账号登陆</a>
        <wv-group title="">
          <wv-button type="warn" :is-loading="isRegDoing" @click="doRegister">注册</wv-button>
        </wv-group>
      </div>
      <question-reset-password-wrapper ref="qrpw"></question-reset-password-wrapper>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import QuestionResetPasswordWrapper from '@/components/Util/UtilPage/QuestionResetPasswordWrapper'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'

  export default {
    components: {
      QuestionResetPasswordWrapper,
      VHeader
    },
    data() {
      return {
        isShow: false,
        isLogin: true,
        loginText: '登陆',
        regText: '注册',
        isLoginDoing: false,
        isRegDoing: false,
        username: '',
        password: '',
        usernameRegister: '',
        nicknameRegister: '',
        passwordRegister: '',
        repeatPassword: '',
        emailRegister: '',
        phoneRegister: ''
      }
    },
    methods: {
      /**
       * 注册
       */
      doRegister() {
        let username = this.usernameRegister
        let password = this.passwordRegister
        let repeatPassword = this.repeatPassword
        let nickname = this.nicknameRegister
        let email = this.emailRegister
        let phone = this.phoneRegister
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
        // this.regText = '请稍等...'
        this.isRegDoing = true
        this.$http.post(path()['register'], {
          'username': username,
          'password': password,
          'nickname': nickname,
          'email': email,
          'phone': phone
        }).then(response => {
          let res = response.body
          // this.regText = '注册'
          this.isRegDoing = false
          if (res['status'] === ResponseCode.SUCCESS) {
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
      /**
       * 登陆
       */
      doLogin() {
        let username = this.username
        let password = this.password
        if (username === '' || password === '') {
          return
        }
        // this.loginText = '请稍等...'
        this.isLoginDoing = true
        this.$http.post(path()['login'], {
          'username': username,
          'password': password
        }).then(response => {
          let res = response.body
          // this.loginText = '登陆'
          this.isLoginDoing = false
          if (res['status'] === ResponseCode.SUCCESS) {
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
      changeContent() {
        this.isLogin = !this.isLogin
      },
      forgetPassword() {
        this.$refs.qrpw.show()
      },
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

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
    .change-link
      display block
      width 95%
      height 2em
      line-height 2em
      color #e64340
      margin-left 2.5%
      text-decoration underline
</style>
