<template>
  <transition name="user-info-move">
    <div class="reset-password-wrapper" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">修改密码</span>
        <a class="login-link" @click="doReset">更新</a>
      </header>
      <split></split>
      <div class="si-content">
        <wv-group title="">
          <wv-input label="旧密码" placeholder="请输入当前密码" v-model="pwdOld" type="password"></wv-input>
          <wv-input label="新密码" placeholder="请输入当前密码" v-model="pwdNew" type="password"></wv-input>
          <wv-input label="新密码" placeholder="请再次输入当前密码" v-model="pwdNewRepeat" type="password"></wv-input>
        </wv-group>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split
    },
    data () {
      return {
        isShow: false,
        pwdOld: '',
        pwdNew: '',
        pwdNewRepeat: ''
      }
    },
    methods: {
      doReset () {
        if (this.pwdNew !== this.pwdNewRepeat) {
          Dialog({
            title: '提示',
            message: '两次输入的密码不相同',
            skin: 'ios'
          })
          return false
        }
        this.$http.post(path()['resetPassword'], {
          'passwordOld': this.pwdOld,
          'passwordNew': this.pwdNew
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            Dialog({
              title: '成功',
              message: res['msg'],
              skin: 'ios'
            })
          } else {
            Dialog({
              title: '失败',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
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
  .user-info-move-enter-active
    animation bounce-in .2s linear
  .user-info-move-leave-active
    animation bounce-out .2s linear
  .reset-password-wrapper
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
      background #fff
      position relative
      text-align center
      color #000
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
    .si-content
      .si-label
        display block
        width 95%
        height 3em
        line-height 3em
        margin 1em auto
        padding-left 0.9em
        box-sizing border-box
        .sil-title
          float left
          width 20%
          line-height 3em
        .sil-text
          float left
          margin-left 1em
          line-height 3em
        .si-input
          margin-left 1em
          width 50%
          height 3em
          line-height 3em
          border 0.1em solid #ccc
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
