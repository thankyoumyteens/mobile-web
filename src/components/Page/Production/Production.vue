<template>
  <transition name="production-move">
    <div class="production" v-show="productionShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
//  import Vue from 'vue'

  export default {
    props: {
      productionSimple: {
        type: Object
      }
    },
    watch: {
      'productionSimple' () {
        console.log(this.productionSimple)
      }
    },
    data () {
      return {
        productionShow: false
      }
    },
    methods: {
      show () {
        this.productionShow = true
      },
      hide () {
        this.productionShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

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
  .production-move-enter-active
    animation bounce-in .2s linear
  .production-move-leave-active
    animation bounce-out .2s linear
  .production
    position fixed
    top 0
    left 0
    bottom 0
    z-index 99999
    width 100%
    background #fff
    box-sizing border-box
    .close
      margin-top 0.3em
      margin-right 0.5em
      float left
</style>
