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
              <p class="order-list-item-title"
                 @click="doCancel(orderDetail['orderNo'])"
                 v-if="orderDetail['status']===orderStatus.NOT_PAY">取消订单</p>
              <p class="order-list-item-title"
                 @click="doPay(orderDetail)"
                 v-if="orderDetail['status']===orderStatus.NOT_PAY">去支付</p>
              <p class="order-list-item-title"
                 @click="sendDeliveryMessage(orderDetail['orderNo'])"
                 v-if="orderDetail['status']===orderStatus.PAYED">提醒发货</p>
              <p class="order-list-item-title"
                 @click="doConfirm(orderDetail['orderNo'])"
                 v-if="orderDetail['status']===orderStatus.SENT">确认收货</p>
              <p class="order-list-item-title"
                 @click="doComment(orderDetail)"
                 v-if="orderDetail['status']===orderStatus.SUCCESS">评论</p>
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
      <wait-pay ref="waitpWaitPay"></wait-pay>
      <make-comment ref="makeComment"></make-comment>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import WaitPay from '@/components/Util/UtilPage/WaitPay'
  import MakeComment from '@/components/Page/Production/MakeComment'
  import BetterScroll from 'better-scroll'
  import {path} from '@/commons/address'
  import {ResponseCode, OrderStatus} from '@/commons/config'

  export default {
    components: {
      Split,
      WaitPay,
      VHeader,
      MakeComment
    },
    data() {
      return {
        isShow: false,
        orderId: null,
        orderDetail: null,
        scWrapperScroll: null,
        orderStatus: {}
      }
    },
    created() {
      this.orderStatus = OrderStatus
    },
    methods: {
      /**
       * 提醒发货
       */
      sendDeliveryMessage(orderNo) {
        this.$http.get(path()['sendDeliveryMessage'] + '?orderNo=' + orderNo).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            Dialog({
              title: '提示',
              message: '提醒发货成功',
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
      /**
       * 评论
       */
      doComment(order) {
        order.orderItemList = order.itemList
        order.itemList = null
        this.$refs.makeComment.show(order)
      },
      /**
       * 确认收货
       * @param orderNo
       */
      doConfirm(orderNo) {
        this.$http.get(path()['orderConfirm'] + '?orderNo=' + orderNo).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            this.orderDetail['status'] = OrderStatus.SUCCESS
            this.orderDetail['statusMsg'] = '已完成'
            Dialog({
              title: '提示',
              message: '成功',
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
      /**
       * 取消订单
       * @param orderNo
       */
      doCancel(orderNo) {
        this.$http.get(path()['orderCancel'] + '?orderNo=' + orderNo).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            this.orderDetail['status'] = OrderStatus.CANCELED
            this.orderDetail['statusMsg'] = '已取消'
            Dialog({
              title: '提示',
              message: '成功',
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
      doPay(order) {
        this.$refs.waitpWaitPay.show(order)
      },
      show(orderId) {
        this.orderId = orderId
        this.getOrderDetail()
        this.initScroll()
        this.isShow = true
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
      getOrderDetail() {
        this.$http.post(path()['orderDetail'], {
          orderId: this.orderId
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
  @import "../../../commons/styles/color.styl"
  .user-info-move-enter-active
    animation bounce-in .2s linear

  .user-info-move-leave-active
    animation bounce-out .2s linear

  .order-detail
    position fixed
    top 0
    left 0
    bottom 0
    z-index 997
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
          color main-red
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
              color main-red
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
            color main-red
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
