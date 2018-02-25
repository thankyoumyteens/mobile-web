<template>
  <transition name="login-move">
    <div class="login" v-show="isShow">
      login
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isShow: false
      }
    },
    methods: {
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
</style>
