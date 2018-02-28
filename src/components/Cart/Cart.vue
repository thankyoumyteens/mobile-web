<template>
  <div class="cart">
    <div class="cart-list" v-if="cartList!=null">
      <div class="cart-item" v-for="item in cartList">
        <div class="cart-item-img"><img :src="item['img']" alt=""></div>
        <div class="cart-item-detail">
          <p class="cart-item-title">{{item['name']}}</p>
          <p class="cart-item-type">￥{{item['typeStr']}}</p>
          <p class="cart-item-price">￥{{item['priceStr']}}</p>
        </div>
        <div class="cart-item-count">
          <div class="cart-item-count-item cart-item-count-op cart-item-count-minus">-</div>
          <div class="cart-item-count-item cart-item-count-text">{{item['count']}}</div>
          <div class="cart-item-count-item cart-item-count-op cart-item-count-add">+</div>
        </div>
      </div>
    </div>
    <div class="pay-bar">
      <div class="pay-total">合计:￥{{totalPrice}}</div>
      <div class="pay-button">结算</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    path
  } from '@/commons/address.js'

  export default {
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        cartList: null,
        totalPrice: 0.0
      }
    },
    watch: {
      'user' () {
        this.getCartList()
      }
    },
    created () {
      this.getCartList()
    },
    methods: {
      getCartList () {
        if (this.user !== null && this.user !== undefined) {
          // todo 改成post
          this.$http.get(path()['getCart'], {
            params: {
              'userId': this.user['userId']
            }
          }).then(response => {
            let res = response.body
            if (res['status'] === 200) {
              let data = res['data']
              this.cartList = data
              for (let i = 0; i < this.cartList.length; i++) {
                let item = this.cartList[i]
                let totalPrice = parseFloat(item['price'])
                for (let j = 0; j < item['type'].length; j++) {
                  let type = item['type'][j]
                  console.log(type)
                  totalPrice += parseFloat(type['price'])
                  if (this.cartList[i]['typeStr'] === undefined) {
                    this.cartList[i]['typeStr'] = ''
                  }
                  this.cartList[i]['typeStr'] += type['key'] + ':' + type['value'] + ' '
                }
                this.cartList[i]['priceStr'] = totalPrice
              }
              console.log(this.cartList)
            } else {
              console.log(res['message'])
            }
          })
        } else {
          // todo 读取本地购物车列表
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cart
    width 100%
    .cart-list
      width 100%
      .cart-item
        width 100%
        margin 0.5em 0
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
    .pay-bar
      position fixed
      bottom 4em
      left 0
      width 100%
      height 3em
      box-shadow 0 0 1em #ccc
      .pay-total
        line-height 3em
        display inline-block
      .pay-button
        position absolute
        right 0
        top 0
        background-color crimson
        color #fff
        width 5em
        line-height 3em
        text-align center
</style>
