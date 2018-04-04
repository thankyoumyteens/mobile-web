<template>
  <transition name="user-info-move">
    <div class="order-detail" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">订单详情</span>
      </header>
      <split></split>
      <div class="sc-wrapper" ref="scWrapper">
        <div>
          <div class="order-detail-wrapper" v-if="orderDetail">
            <div class="order-list-item-order-no">订单号: {{orderDetail['orderNo']}}</div>
            <splits></splits>
            <div class="order-item-list-wrapper">
              <div class="oil-item" v-for="orderItem in orderDetail['orderItemList']">
                <div class="order-item-list-item-img"><img :src="orderItem['productImage']" alt=""></div>
                <div class="order-item-item-list-item-name">{{orderItem['productName']}}</div>
                <div class="order-item-item-list-item-detail">{{orderItem['detailStr']}}</div>
                <div class="order-item-item-list-item-quantity">x{{orderItem['quantity']}}</div>
                <div class="order-item-item-list-item-price">￥{{orderItem['totalPrice']}}</div>
              </div>
            </div>
            <splits></splits>
            <div class="order-list-item-detail">
              <p class="order-list-item-title">{{orderDetail['statusMsg']}}</p>
              <p class="order-list-item-price">￥{{orderDetail['payment']}}</p>
            </div>
            <split></split>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import split from '@/components/Util/Split/Split'
  import splits from '@/components/Util/Split/SplitSmall'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      splits
    },
    data () {
      return {
        isShow: false,
        orderId: null,
        orderDetail: null,
        scWrapperScroll: null
      }
    },
    methods: {
      show (orderId) {
        this.orderId = orderId
        this.getOrderDetail()
        this.initScroll()
        this.isShow = true
      },
      hide () {
        this.isShow = false
      },
      initScroll () {
        this.$nextTick(() => {
          if (!this.scWrapperScroll) {
            this.scWrapperScroll = new BetterScroll(this.$refs.scWrapper, {
              click: true
            })
          } else {
            this.scWrapperScroll.refresh()
          }
        })
      },
      getOrderDetail () {
        this.$http.post(path()['orderDetail'], {
          orderId: this.orderId
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = res['data']
            for (let k = 0; k < data['orderItemList'].length; k++) {
              let orderItem = data['orderItemList'][k]
              orderItem['typeNames'] = JSON.parse(orderItem['typeNames'])
              let text = ''
              for (let j = 0; j < orderItem['typeNames'].length; j++) {
                let detail = orderItem['typeNames'][j]
                text += '[' + detail['key'] + ':' + detail['value'][detail['selected']]['val'] + ']'
              }
              orderItem['detailStr'] = text
            }
            this.orderDetail = data
            this.initScroll()
          } else {
            console.log(res['msg'])
          }
        })
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
  .order-detail
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
    .rel
      position relative
      height 100%
    .sc-wrapper
      overflow hidden
      position absolute
      top 4.5em
      bottom 0
      width 100%
      .order-detail-wrapper
        width 100%
        margin 0
        position relative
        .order-list-item-order-no
          font-size 1.1em
          margin-left 1em
          margin-top 0.3em
          margin-bottom 0.3em
        .order-item-list-wrapper
          width 100%
          .oil-item
            width 100%
            height 6em
            margin-bottom 0.5em
            overflow hidden
            position relative
            &:last-child
              margin 0
            .order-item-list-item-img
              float left
              max-width 40%
              height 6em
              img
                height 100%
            .order-item-item-list-item-name
              position absolute
              top 0.5em
              right 1em
              width 60%
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
            .order-item-item-list-item-detail
              position absolute
              top 2.5em
              right 1em
              width 60%
              color #ccc
              font-size 0.9em
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
            .order-item-item-list-item-quantity
              position absolute
              bottom 0.5em
              left 40%
              color #000
            .order-item-item-list-item-price
              position absolute
              bottom 0.5em
              right 1em
              color crimson
        .order-list-item-detail
          width 100%
          display flex
          margin-top 0.5em
          margin-bottom 0.5em
          .order-list-item-title
            flex 1
            margin-left 1em
          .order-list-item-type
            flex 1
          .order-list-item-price
            flex 1
            margin-right 1em
            text-align right
            color crimson
    .shipping-list-item
      .sli-line
        width 100%
        margin-top 1em
        height 2em
        line-height 2em
        margin-bottom 1em
        &.sli-top
          font-weight bold
        &.flex-line
          display flex
          margin 0
          height 2em
          line-height 2em
        .sli-item
          display inline
          &.flex-item
            border-top 0.1em solid #ccc
            flex 1
            height 2em
            line-height 2em
            text-align center
    .cart-list
      width 100%
      margin-bottom 0
      .cart-item
        width 100%
        margin 0
        height 7em
        position relative
        .cart-item-img
          float left
          max-width 40%
          height 7em
          img
            max-width 100%
            height 100%
        .cart-item-detail
          float left
          width 45%
          margin-left 5%
          height 7em
          .cart-item-title
            width 100%
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          .cart-item-type
            width 100%
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            color #ccc
            font-size 0.8em
            line-height 3em
          .cart-item-price
            color crimson
        .cart-item-count
          position absolute
          right 1em
          bottom 1em
          display flex
          .cart-item-count-item
            flex 1
            width 1em
            line-height 1em
            text-align center
            &.cart-item-count-op
              border 0.1em solid #ccc
            &.cart-item-count-text
              margin 0 0.5em
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
