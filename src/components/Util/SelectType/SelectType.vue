<template>
  <transition name="select-move">
    <div class="select-type border-1px" v-if="production!=null" v-show="selectShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <div class="st-main">
        <header class="border-1px">
          <div class="st-price">
            ￥{{production['price']}}
          </div>
        </header>
      </div>
      <div class="st-buttons">
        <button class="st-button st-add-cart">加入购物车</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        selectShow: false,
        production: null
      }
    },
    methods: {
      show (production) {
        this.production = production
        this.selectShow = true
      },
      hide () {
        this.selectShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

  @keyframes bounce-in-vertical
    0%
      transform translate3d(0, 100%, 0)
    100%
      transform translate3d(0, 0, 0)
  @keyframes bounce-out-vertical
    0%
      transform translate3d(0, 0, 0)
    100%
      transform translate3d(0, 100%, 0)
  .select-move-enter-active
    animation bounce-in-vertical .2s linear
  .select-move-leave-active
    animation bounce-out-vertical .2s linear
  .select-type
    border-top-1px(#ccc)
    position fixed
    z-index 100000
    bottom 0
    left 0
    right 0
    .close
      position absolute
      z-index 100001
      top 0
      right 0
      margin-right 0.5em
      font-weight normal
    .st-main
      margin-bottom 4em
      header
        border-1px(#ccc)
    .st-buttons
      position fixed
      bottom 0
      left 0
      width 100%
      height 4em
      .st-button
        height 100%
        color #fff
        background #e31d1a
        outline none
        border 0
      .st-add-cart
        width 100%
</style>
