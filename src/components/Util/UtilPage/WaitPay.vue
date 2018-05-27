<template>
  <transition name="wait-pay-move">
    <div class="wait-pay" v-show="isShow">
      <!--<v-header titleText="支付" actionText="去支付" @back="hide" @action=""></v-header>-->
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">订单</span>
        <a class="login-link" v-if="payLink" @click="confirmPayStatus" target="_blank" :href="payLink">去支付</a>
      </header>
      <split></split>
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
            <split :size="0.5"></split>
            <div class="order-item-list-wrapper">
              <div class="oil-item" v-for="orderItem in orderDetail['itemList']">
                <div class="order-item-list-item-img"><img :src="orderItem['mainImage']" alt=""></div>
                <div class="order-item-item-list-item-name">{{orderItem['productName']}}</div>
                <div class="order-item-item-list-item-detail">{{orderItem['detail']}}</div>
                <div class="order-item-item-list-item-quantity">x{{orderItem['quantity']}}</div>
                <div class="order-item-item-list-item-price">￥{{orderItem['totalPrice']}}</div>
              </div>
            </div>
            <split :size="0.1"></split>
            <div class="order-list-item-detail">
              <p class="order-list-item-price">￥{{orderDetail['payment']}}</p>
            </div>
            <split></split>
            <div class="order-list-item-time" v-if="orderDetail['createTime']">
              <p class="order-list-item-time-title">创建时间:</p>
              <p class="order-list-item-time-text">{{(orderDetail['createTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['paymentTime']">
              <p class="order-list-item-time-title">支付时间:</p>
              <p class="order-list-item-time-text">{{(orderDetail['paymentTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['sendTime']">
              <p class="order-list-item-time-title">发货时间:</p>
              <p class="order-list-item-time-text">{{(orderDetail['sendTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['endTime']">
              <p class="order-list-item-time-title">完成时间:</p>
              <p class="order-list-item-time-text">{{(orderDetail['endTime'])}}</p>
            </div>
            <div class="order-list-item-time" v-if="orderDetail['closeTime']">
              <p class="order-list-item-time-title">关闭时间:</p>
              <p class="order-list-item-time-text">{{(orderDetail['closeTime'])}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import BetterScroll from 'better-scroll'
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
        payLink: null,
        orderDetail: null
      }
    },
    methods: {
      confirmPayStatus() {
        Dialog({
          title: '',
          message: '支付完成?',
          skin: 'ios',
          confirmButtonText: '是',
          cancelButtonText: '否',
          showConfirmButton: true,
          showCancelButton: true
        }).then(() => {
          this.queryPayStatus()
        }).catch(() => {
          console.log('cancel')
        })
      },
      queryPayStatus() {
        this.$http.get(path()['alipayQuery'] + '?orderNo=' + this.orderDetail['orderNo']).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      show(order) {
        this.isShow = true
        this.orderDetail = order
        this.payLink = path()['payLink'] + '?orderNo=' + order['orderNo']
      },
      showById(orderId, orderNo) {
        this.getOrderDetail(orderId)
        this.isShow = true
        this.payLink = path()['payLink'] + '?orderNo=' + orderNo
      },
      hide() {
        this.isShow = false
      },
      initScroll() {
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
      getOrderDetail(orderId) {
        this.$http.post(path()['orderDetail'], {
          orderId: orderId
        }).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            this.orderDetail = res['data']
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
  @import "../../../commons/mixin.styl"

  .wait-pay-move-enter-active
    animation bounce-in .2s linear

  .wait-pay-move-leave-active
    animation bounce-out .2s linear

  .wait-pay
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
            /*height 3em*/
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
