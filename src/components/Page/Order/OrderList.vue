<template>
  <transition name="user-info-move">
    <div class="order-list" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">{{title}}</span>
      </header>
      <split></split>
      <div class="sc-wrapper" ref="olistWrapper">
        <div>
          <div class="order-list-wrapper">
            <div class="order-list-item" v-for="(item,index) in orderList">
              <div class="order-list-item-order-no">订单号: {{item['orderNo']}}</div>
              <div class="order-list-item-order-status">{{item['statusMsg']}}</div>
              <splits></splits>
              <div class="order-item-list-wrapper" @click="showOrderDetail(item['orderId'])">
                <div class="oil-item" v-for="orderItem in item['orderItemList']">
                  <div class="order-item-list-item-img"><img :src="orderItem['mainImage']" alt=""></div>
                  <div class="order-item-item-list-item-name">{{orderItem['productName']}}</div>
                  <div class="order-item-item-list-item-detail">{{orderItem['detail']}}</div>
                  <div class="order-item-item-list-item-quantity">x{{orderItem['quantity']}}</div>
                  <div class="order-item-item-list-item-price">￥{{orderItem['totalPrice']}}</div>
                </div>
              </div>
              <splits></splits>
              <div class="order-list-item-detail">
                <p class="order-list-item-title" @click="doPay(item['orderNo'])" v-if="item['status']===10">去支付</p>
                <p class="order-list-item-title" v-if="item['status']===20">提醒发货</p>
                <p class="order-list-item-title" v-if="item['status']===40">确认收货</p>
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
      <od ref="comp_od"></od>
      <waitp ref="waitpWaitPay"></waitp>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import split from '@/components/Util/Split/Split'
  import splits from '@/components/Util/Split/SplitSmall'
  import od from '@/components/Page/Order/OrderDetail'
  import waitp from '@/components/Util/UtilPage/WaitPay'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      splits,
      od,
      waitp
    },
    data () {
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
        title: ''
      }
    },
    methods: {
      doPay(orderNo) {
        this.$refs.waitpWaitPay.show(orderNo)
      },
      show (type) {
        this.orderList = []
        this.pageNum = 1
        switch (type) {
          case 'all':
            this.title = '全部订单'
            this.status = -1
            break
          case 'notPay':
            this.title = '待付款'
            this.status = 1
            break
          case 'payed':
            this.title = '待收货'
            this.status = 2
            break
          case 'sent':
            this.title = '待收货'
            this.status = 3
            break
        }
        this.getOrderList()
        this.isShow = true
      },
      hide () {
        this.isShow = false
      },
      showOrderDetail (orderId) {
        console.log(orderId)
        this.$refs.comp_od.show(orderId)
      },
      initScroll () {
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
      getMore () {
        this.pageNum++
        this.getOrderList()
      },
      getOrderList () {
        let url = ''
        switch (this.status) {
          case -1:
            url = path()['orderList'] + '?pageNum=' + this.pageNum
            break
          case 1:
            url = path()['orderListNotPay'] + '?pageNum=' + this.pageNum
            break
          case 2:
            url = path()['orderListPayed'] + '?pageNum=' + this.pageNum
            break
          case 3:
            url = path()['orderListPayed'] + '?pageNum=' + this.pageNum
            break
        }
        this.$http.get(url).then(response => {
          let res = response.body
          if (res['status'] === 0) {
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
  .order-list
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
    .sc-wrapper
      overflow hidden
      position absolute
      top 4.5em
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
