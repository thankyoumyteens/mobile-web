<template>
  <transition name="user-info-move">
    <div class="user-info" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">账户设置</span>
      </header>
      <split></split>
      <div @click="logout" class="u-logout">
        退出登录
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split
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
    .u-logout
      width 100%
      height 3em
      line-height 3em
      text-align center
</style>
