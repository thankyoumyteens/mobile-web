<template>
  <transition name="user-info-move">
    <div class="create-order" v-show="isShow">
      <v-header titleText="确认订单" actionText="确定" @back="hide" @action="doReset"></v-header>
      <div class="shipping-list-item" v-if="shippingList[shippingIndex]">
        <div class="sli-line sli-top">
          <div class="sli-item">{{shippingList[shippingIndex]['receiverName']}}</div>
          <div class="sli-item">{{shippingList[shippingIndex]['receiverMobile']}}</div>
        </div>
        <div class="sli-line">
          <div class="sli-item">
            {{shippingList[shippingIndex]['receiverProvince']}}
            {{shippingList[shippingIndex]['receiverCity']}}
            {{shippingList[shippingIndex]['receiverDistrict']}}
            {{shippingList[shippingIndex]['receiverAddress']}}
            {{shippingList[shippingIndex]['receiverZip']}}
          </div>
        </div>
        <div class="sli-line flex-line">
          <div class="sli-item flex-item" @click="prevOne">上一个</div>
          <div @click="nextOne" class="sli-item flex-item">下一个</div>
        </div>
      </div>
      <split></split>
      <div class="sc-wrapper" ref="scWrapper">
        <div>
          <div class="cart-list">
              <div class="cart-item" v-for="(item,index) in cartList">
                <div class="cart-item-img"><img :src="item['mainImage']" alt=""></div>
                <div class="cart-item-detail">
                  <p class="cart-item-title">{{item['productName']}}</p>
                  <p class="cart-item-type">{{item['typeStr']}}</p>
                  <p class="cart-item-price">￥{{item['unitPrice']}}</p>
                </div>
                <div class="cart-item-count">
                  <div @click="cartItemSub(index)" class="cart-item-count-item cart-item-count-op cart-item-count-sub">-</div>
                  <div class="cart-item-count-item cart-item-count-text">{{item['quantity']}}</div>
                  <div @click="cartItemAdd(index)" class="cart-item-count-item cart-item-count-op cart-item-count-add">+</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import split from '@/components/Util/Split/Split'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      VHeader
    },
    data () {
      return {
        isShow: false,
        cartList: [],
        shippingList: [],
        shippingIndex: 0,
        scWrapperScroll: null
      }
    },
    methods: {
      cartItemSub (index) {
        let item = this.cartList[index]
        this.$http.get(path()['sub'] + '?cartId=' + item['id']).then(response => {
          let res = response.body
          console.log(res)
          if (res['status'] === 0) {
            let quantity = this.cartList[index]['quantity']
            this.cartList[index]['quantity'] = (quantity - 1)
            // this.computeTotalPrice()
          } else {
            console.log(res['msg'])
          }
        })
      },
      cartItemAdd (index) {
        let item = this.cartList[index]
        this.$http.get(path()['add'] + '?cartId=' + item['id']).then(response => {
          let res = response.body
          console.log(res)
          if (res['status'] === 0) {
            let quantity = this.cartList[index]['quantity']
            this.cartList[index]['quantity'] = (quantity + 1)
            // this.computeTotalPrice()
          } else {
            console.log(res['msg'])
          }
        })
      },
      prevOne () {
        if (this.shippingIndex <= 0) {
          this.shippingIndex = this.shippingList.length - 1
        } else {
          this.shippingIndex--
        }
      },
      nextOne () {
        if (this.shippingIndex >= this.shippingList.length - 1) {
          this.shippingIndex = 0
        } else {
          this.shippingIndex++
        }
      },
      doReset () {
        if (this.shippingList <= 0) {
          Dialog({
            title: '提示',
            message: '请先添加收货地址',
            skin: 'ios'
          })
          return false
        }
        this.$http.post(path()['createOrder'], {
          'shippingId': this.shippingList[this.shippingIndex]['id']
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            this.$emit('success', res['data'])
            this.hide()
          } else {
            alert(res['msg'])
          }
        })
      },
      show (cartList) {
        this.getShippingList()
        let index = 0
        for (let i = 0; i < cartList.length; i++) {
          let item = cartList[i]
          if (item['checked'] === 1) {
            Vue.set(this.cartList, index++, item)
          }
        }
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
      getShippingList () {
        this.$http.get(path()['shippingList']).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = res['data']
            this.shippingList = data
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
  .create-order
    position fixed
    top 0
    left 0
    bottom 0
    z-index 998
    width 100%
    background #fff
    box-sizing border-box
    .rel
      position relative
      height 100%
    .sc-wrapper
      overflow hidden
      position absolute
      top 14.5em
      bottom 0
      width 100%
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
