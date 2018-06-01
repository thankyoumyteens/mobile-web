<template>
  <transition name="user-info-move">
    <div class="order-list" v-show="isShow">
      <v-header :titleText="title" @back="hide"></v-header>
      <div class="loading" v-if="isLoading&&orderList.length<=0">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <div class="loading" v-if="!isLoading&&orderList.length<=0">
        没有订单
      </div>
      <div class="sc-wrapper" ref="olistWrapper" v-if="orderList.length>0">
        <div>
          <div class="order-list-wrapper">
            <div class="order-list-item" v-for="(item,index) in orderList">
              <div class="order-list-item-order-no">订单号: {{item['orderNo']}}</div>
              <div class="order-list-item-order-status">{{item['statusMsg']}}</div>
              <split :size="0.5"></split>
              <div class="order-item-list-wrapper" @click="showOrderDetail(item['orderId'])">
                <div class="oil-item" v-for="orderItem in item['orderItemList']">
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
                   @click="doCancel(index, item['orderNo'])"
                   v-if="item['status']===orderStatus.NOT_PAY">取消订单</p>
                <p class="order-list-item-title"
                   @click="doPay(item['orderId'], item['orderNo'])"
                   v-if="item['status']===orderStatus.NOT_PAY">去支付</p>
                <p class="order-list-item-title"
                   @click="sendDeliveryMessage(item['orderNo'])"
                   v-if="item['status']===orderStatus.PAYED">提醒发货</p>
                <p class="order-list-item-title"
                   @click="doConfirm(index, item['orderNo'])"
                   v-if="item['status']===orderStatus.SENT">确认收货</p>
                <p class="order-list-item-title"
                   @click="doComment(index, item)"
                   v-if="item['status']===orderStatus.SUCCESS">评论</p>
                <p class="order-list-item-price">￥{{item['totalPrice']}}</p>
              </div>
              <split></split>
            </div>
            <div class="next-page" @click="getMore" v-show="hasNextPage">
              点击加载更多
            </div>
          </div>
        </div>
      </div>
      <order-detail ref="comp_od"></order-detail>
      <wait-pay ref="waitpWaitPay"></wait-pay>
      <make-comment ref="makeComment" @done="updateStatus"></make-comment>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import OrderDetail from '@/components/Page/Order/OrderDetail'
  import WaitPay from '@/components/Util/UtilPage/WaitPay'
  import MakeComment from '@/components/Page/Production/MakeComment'
  import BetterScroll from 'better-scroll'
  import {path} from '@/commons/address'
  import {ResponseCode, OrderStatus} from '@/commons/config'

  export default {
    components: {
      Split,
      OrderDetail,
      WaitPay,
      VHeader,
      MakeComment
    },
    data() {
      return {
        isShow: false,
        orderList: [],
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        hasNextPage: false,
        shippingIndex: 0,
        olistWrapperScroll: null,
        status: -1,
        title: '',
        isLoading: false,
        orderStatus: {}
      }
    },
    created() {
      this.orderStatus = OrderStatus
    },
    methods: {
      updateStatus(index) {
        this.orderList[index]['status'] = OrderStatus.CLOSED
        this.orderList[index]['statusMsg'] = ''
      },
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
      doComment(index, order) {
        this.$refs.makeComment.show(index, order)
      },
      doConfirm(index, orderNo) {
        this.$http.get(path()['orderConfirm'] + '?orderNo=' + orderNo).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            this.orderList[index]['status'] = OrderStatus.SUCCESS
            this.orderList[index]['statusMsg'] = '已完成'
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
      doCancel(index, orderNo) {
        this.$http.get(path()['orderCancel'] + '?orderNo=' + orderNo).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            this.orderList[index]['status'] = OrderStatus.CANCELED
            this.orderList[index]['statusMsg'] = '已取消'
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
      doPay(orderId, orderNo) {
        this.$refs.waitpWaitPay.showById(orderId, orderNo)
      },
      show(type) {
        this.orderList = []
        this.pageNum = 1
        switch (type) {
          case 'all':
            this.title = '全部订单'
            this.status = OrderStatus.ALL
            break
          case 'notPay':
            this.title = '待付款'
            this.status = OrderStatus.NOT_PAY
            break
          case 'payed':
            this.title = '待发货'
            this.status = OrderStatus.PAYED
            break
          case 'sent':
            this.title = '待收货'
            this.status = OrderStatus.SENT
            break
        }
        this.getOrderList()
        this.isShow = true
      },
      hide() {
        this.isShow = false
        this.olistWrapperScroll = null
      },
      showOrderDetail(orderId) {
        console.log(orderId)
        this.$refs.comp_od.show(orderId)
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.olistWrapperScroll) {
            this.olistWrapperScroll = new BetterScroll(this.$refs.olistWrapper, {
              click: true
            })
          } else {
            this.olistWrapperScroll.refresh()
          }
        })
      },
      getMore() {
        this.pageNum++
        this.getOrderList()
      },
      getOrderList() {
        this.isLoading = true
        let url = ''
        switch (this.status) {
          case OrderStatus.ALL:
            url = path()['orderList'] + '?pageNum=' + this.pageNum
            break
          case OrderStatus.NOT_PAY:
            url = path()['orderListNotPay'] + '?pageNum=' + this.pageNum
            break
          case OrderStatus.PAYED:
            url = path()['orderListPayed'] + '?pageNum=' + this.pageNum
            break
          case OrderStatus.SENT:
            url = path()['orderListSent'] + '?pageNum=' + this.pageNum
            break
        }
        this.$http.get(url).then(response => {
          this.isLoading = false
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            let data = response.body['data']['list']
            this.pages = response.body['data']['pages']
            this.hasNextPage = response.body['data']['hasNextPage']
            for (let i = 0; i < data.length; i++) {
              let item = data[i]
              // 下一页数据追加到数组末尾
              let index = this.orderList.length
              Vue.set(this.orderList, index, item)
            }
            console.log(this.hasNextPage)
            this.initScroll()
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-info-move-enter-active
    animation bounce-in .2s linear

  .user-info-move-leave-active
    animation bounce-out .2s linear

  .order-list
    position fixed
    top 0
    left 0
    bottom 0
    z-index 990
    width 100%
    background #fff
    box-sizing border-box
    .sc-wrapper
      overflow hidden
      position absolute
      top 50px
      bottom 0
      width 100%
    .order-list-wrapper
      width 100%
      margin-bottom 0
      .order-list-item
        width 100%
        margin 0
        position relative
        .order-list-item-order-no
          font-size 1em
          margin-left 0.5em
          height 2em
          line-height 2em
        .order-list-item-order-status
          position absolute
          right 0.5em
          top 0.3em
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
</style>
