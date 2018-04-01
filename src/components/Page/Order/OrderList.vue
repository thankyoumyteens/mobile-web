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
            <div class="order-list-item" @click="showOrderDetail(item['orderId'])" v-for="(item,index) in orderList">
              <div class="order-list-item-order-no">订单号: {{item['orderNo']}}</div>
              <splits></splits>
              <div class="order-item-list-wrapper">
                <div class="oil-item" v-for="orderItem in item['orderItemList']">
                  <div class="order-item-list-item-img"><img :src="orderItem['mainImage']" alt=""></div>
                  <div class="order-item-item-list-item-name">{{orderItem['productName']}}</div>
                  <div class="order-item-item-list-item-detail">{{orderItem['detailStr']}}</div>
                  <div class="order-item-item-list-item-quantity">x{{orderItem['quantity']}}</div>
                  <div class="order-item-item-list-item-price">￥{{orderItem['totalPrice']}}</div>
                </div>
              </div>
              <splits></splits>
              <div class="order-list-item-detail">
                <p class="order-list-item-title">{{item['status']}}</p>
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
      show (type) {
        this.orderList = []
        this.pageNum = 1
        switch (type) {
          case 'all':
            this.title = '全部订单'
            this.status = -1
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
        // todo 订单详情
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
        let param = ''
        switch (this.status) {
          case -1:
            param = '?pageNum=' + this.pageNum
            break
        }
        this.$http.get(path()['orderList'] + param).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = response.body['data']['list']
            this.pages = response.body['data']['pages']
            this.hasNextPage = response.body['data']['hasNextPage']
            for (let i = 0; i < data.length; i++) {
              let item = data[i]
              // todo 改进商品参数处理
              for (let k = 0; k < item['orderItemList'].length; k++) {
                let orderItem = item['orderItemList'][k]
                orderItem['detail'] = JSON.parse(orderItem['detail'])
                let text = ''
                for (let j = 0; j < orderItem['detail'].length; j++) {
                  let detail = orderItem['detail'][j]
                  text += '[' + detail['key'] + ':' + detail['value'][detail['selected']]['val'] + ']'
                }
                orderItem['detailStr'] = text
              }
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
</style>