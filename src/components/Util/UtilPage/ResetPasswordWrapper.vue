<template>
  <transition name="user-info-move">
    <div class="reset-password-wrapper" v-show="isShow">
      <v-header titleText="修改密码" actionText="修改" @back="hide" @action="doReset"></v-header>
      <div class="si-content">
        <wv-group title="修改密码">
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
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'

  export default {
    components: {
      Split,
      VHeader
    },
    data() {
      return {
        isShow: false,
        pwdOld: '',
        pwdNew: '',
        pwdNewRepeat: ''
      }
    },
    methods: {
      doReset() {
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
          if (res['status'] === ResponseCode.SUCCESS) {
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
</style>
