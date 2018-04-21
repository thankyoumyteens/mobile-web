<template>
  <transition name="user-info-move">
    <div class="order-detail" v-show="isShow">
      <v-header titleText="订单详情" @back="hide"></v-header>
      <div class="loading" v-if="!orderDetail">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <div class="sc-wrapper" ref="scWrapper">
        <div>
          <div class="order-detail-wrapper" v-if="orderDetail">
            <div class="shipping-list-item">
              <div class="sli-line sli-top">
                <div class="sli-item">{{orderDetail['shipping']['receiverName']}}</div>
                <div class="sli-item">{{orderDetail['shipping']['receiverMobile']}}</div>
              </div>
              <div class="sli-line">
                <div class="sli-item">
                  {{orderDetail['shipping']['receiverProvince']}}
                  {{orderDetail['shipping']['receiverCity']}}
                  {{orderDetail['shipping']['receiverDistrict']}}
                  {{orderDetail['shipping']['receiverAddress']}}
                  {{orderDetail['shipping']['receiverZip']}}
                </div>
              </div>
            </div>
            <split></split>
            <div class="order-list-item-order-status">{{orderDetail['statusMsg']}}</div>
            <div class="order-list-item-order-no">订单号: {{orderDetail['orderNo']}}</div>
            <splits></splits>
            <div class="order-item-list-wrapper">
              <div class="oil-item" v-for="orderItem in orderDetail['itemList']">
                <div class="order-item-list-item-img"><img :src="orderItem['mainImage']" alt=""></div>
                <div class="order-item-item-list-item-name">{{orderItem['productName']}}</div>
                <div class="order-item-item-list-item-detail">{{orderItem['detail']}}</div>
                <div class="order-item-item-list-item-quantity">x{{orderItem['quantity']}}</div>
                <div class="order-item-item-list-item-price">￥{{orderItem['totalPrice']}}</div>
              </div>
            </div>
            <splits></splits>
            <div class="order-list-item-detail">
              <p class="order-list-item-title" @click="doPay(orderDetail['orderNo'])" v-if="orderDetail['status']===10">去支付</p>
              <p class="order-list-item-title" v-if="orderDetail['status']===20">提醒发货</p>
              <p class="order-list-item-title" v-if="orderDetail['status']===40">确认收货</p>
              <p class="order-list-item-price">￥{{orderDetail['payment']}}</p>
            </div>
            <split></split>
            <div class="order-list-item-time" v-if="orderDetail['createTime']">
              <p class="order-list-item-time-title">创建时间:</p>
              <p class="order-list-item-time-text">{{formatDate(orderDetail['createTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['paymentTime']">
              <p class="order-list-item-time-title">支付时间:</p>
              <p class="order-list-item-time-text">{{formatDate(orderDetail['paymentTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['sendTime']">
              <p class="order-list-item-time-title">发货时间:</p>
              <p class="order-list-item-time-text">{{formatDate(orderDetail['sendTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['endTime']">
              <p class="order-list-item-time-title">完成时间:</p>
              <p class="order-list-item-time-text">{{formatDate(orderDetail['endTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['closeTime']">
              <p class="order-list-item-time-title">关闭时间:</p>
              <p class="order-list-item-time-text">{{formatDate(orderDetail['closeTime'])}}</p>
            </div>
          </div>
        </div>
      </div>
      <waitp ref="waitpWaitPay"></waitp>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import VHeader from '@/components/Util/Header/Header'
  import split from '@/components/Util/Split/Split'
  import splits from '@/components/Util/Split/SplitSmall'
  import waitp from '@/components/Util/UtilPage/WaitPay'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'
  import {
    formatTimestamp
  } from '@/commons/util.js'

  export default {
    components: {
      split,
      splits,
      waitp,
      VHeader
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
      doPay(orderNo) {
        this.$refs.waitpWaitPay.show(orderNo)
      },
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
      formatDate (string) {
        return formatTimestamp(string)
      },
      getOrderDetail () {
        this.$http.post(path()['orderDetail'], {
          orderId: this.orderId
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = res['data']
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
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
    .rel
      position relative
      height 100%
    .sc-wrapper
      overflow hidden
      position absolute
      top 50px
      bottom 0
      width 100%
      .order-detail-wrapper
        width 100%
        margin 0
        position relative
        .shipping-list-item
          .sli-line
            /* 加margin会影响滚动条 */
            width 95%
            margin-left 2.5%
            margin-right 2.5%
            height 3em
            line-height 3em
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
        .order-list-item-order-no
          font-size 1em
          margin-left 1em
          height 2em
          line-height 2em
        .order-list-item-order-status
          float right
          margin-top 0.3em
          margin-right 0.3em
          color crimson
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
                max-width 96px
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
            float left
            box-sizing border-box
            padding 0 0.3em
            border-radius 0.5em
            margin-left 1em
            box-shadow 0.05em 0.05em #ccc
            border 0.1em solid #ccc
          .order-list-item-type
            flex 1
          .order-list-item-price
            flex 1
            margin-right 1em
            text-align right
            color crimson
        .order-list-item-time
          width 100%
          margin-top 0.5em
          margin-bottom 0.5em
          .order-list-item-time-title
            display inline-block
            margin-left 0.5em
          .order-list-item-time-text
            display inline-block
            margin-left 1em
            color #777
            margin-right 0.5em
</style>
