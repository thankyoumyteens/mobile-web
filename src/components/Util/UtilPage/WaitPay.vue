<template>
  <transition name="wait-pay-move">
    <div class="wait-pay" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">订单</span>
        <a class="login-link" v-if="payLink" target="_blank" :href="payLink">去支付</a>
      </header>
      <split></split>
      <div class="si-content">
        <!--<div class="si-label">-->
          <!--<div class="sil-title">原密码:</div>-->
          <!--<input type="password" class="si-input" ref="passwordOld" value="">-->
        <!--</div>-->
        <!--<div class="si-label">-->
          <!--<div class="sil-title">新密码:</div>-->
          <!--<input type="password" class="si-input" ref="passwordNew" value="">-->
        <!--</div>-->
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
    data() {
      return {
        isShow: false,
        payLink: null
      }
    },
    methods: {
      show(orderNo) {
        this.isShow = true
        this.payLink = path()['payLink'] + '?orderNo=' + orderNo
      },
      hide() {
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

  .wait-pay-move-enter-active
    animation bounce-in .2s linear

  .wait-pay-move-leave-active
    animation bounce-out .2s linear

  .wait-pay
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
