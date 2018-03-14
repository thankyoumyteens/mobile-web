<template>
  <transition name="user-info-move">
    <div class="user-info" v-if="user!==null" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">账户设置</span>
      </header>
      <split></split>
      <div class="ui-user">
        <div class="ui-avatar" @click="changeAvatar"><img :src="user['avatar']" alt=""></div>
        <div class="ui-info">
          <div class="ui-info-item">{{user['nickname']}}</div>
          <div class="ui-info-item ui-info-username">用户名: {{user['username']}}</div>
        </div>
      </div>
      <split></split>
      <div class="ui-show ui-underline" @click="showDetail">
        <div class="uis-title">个人信息</div>
        <div class="uis-icon"> > </div>
      </div>
      <div class="ui-show" @click="showShipping">
        <div class="uis-title">收货地址</div>
        <div class="uis-icon"> > </div>
      </div>
      <split></split>
      <div @click="logout" class="u-logout">
        退出登录
      </div>
      <uiw ref="uiw" :user="user" @success="updateSuccess"></uiw>
      <sw ref="sw" :user="user"></sw>
      <aw ref="aw" :user="user" @avatar="changeAvatarSuccess"></aw>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/Util/Split/Split'
  import uiw from '@/components/Util/UtilPage/UserInfoWrapper'
  import sw from '@/components/Util/UtilPage/ShippingWrapper'
  import aw from '@/components/Util/UtilPage/AvatarWrapper'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      uiw,
      sw,
      aw
    },
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      changeAvatarSuccess (uri) {
        this.$emit('avatar', uri)
      },
      updateSuccess (user) {
        this.$emit('update', user)
      },
      changeAvatar () {
        this.$refs.aw.show()
      },
      showShipping () {
        this.$refs.sw.show()
      },
      showDetail () {
        this.$refs.uiw.show()
      },
      logout () {
        this.$http.post(path()['logout']).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            this.$emit('logout')
            this.hide()
          } else {
            console.log(res['msg'])
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
  .user-info
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
    .ui-user
      padding 1em 0
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
      .ui-info
        display inline-block
        text-align left
        height 3em
        line-height 3em
        vertical-align top
        margin-left 1em
        overflow hidden
        .ui-info-item
          width 100%
          height 1.5em
          line-height 1.5em
          vertical-align top
          &.ui-info-username
            color #aaa
    .ui-show
      width 100%
      height 3em
      &.ui-underline
        border-bottom 0.1em solid #ccc
      .uis-title
        float left
        margin-left 1em
        line-height 3em
      .uis-icon
        float right
        margin-right 1em
        line-height 3em
    .u-logout
      width 100%
      height 3em
      line-height 3em
      text-align center
</style>
