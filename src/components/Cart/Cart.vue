<template>
  <div class="cart">
    <div class="cart-list" v-if="cartList!=null">
      <div class="cart-item" v-for="item in cartList">
        <div class="cart-item-checkbox" @click="checkItem(item)">
          <checkbox :checked="item['check']=='1'"></checkbox>
          <div class="pay-bar-checkbox-text"></div>
        </div>
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
      <div class="pay-bar-checkbox" @click="checkAll">
        <checkbox ref="checkAll"></checkbox>
        <div class="pay-bar-checkbox-text">全选</div>
      </div>
      <div class="pay-total">合计:￥{{totalPrice}}</div>
      <div class="pay-button">结算</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import checkbox from '@/components/Util/Checkbox/Checkbox'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      checkbox
    },
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        checkedList: [],
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
      checkItem (item) {
        // todo 根据item['check']切换checkbox状态
        this.getCartList()
      },
      checkAll () {
        // todo
        console.log(this.$refs.checkAll.checkStatus())
        if (this.$refs.checkAll.checkStatus()) {
          // 全选
        } else {
          // 全部选
        }
      },
      getCartList () {
        if (this.user !== null && this.user !== undefined) {
          // todo 改成post
          this.$http.get(path()['getCart']).then(response => {
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
        .cart-item-checkbox
          height 1.5em
          margin-top 2.75em
          margin-left 1em
          float left
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
      .pay-bar-checkbox
        height 1.5em
        margin-top 0.75em
        margin-left 1em
        float left
        .pay-bar-checkbox-text
          display inline-block
          line-height 1.5em
          vertical-align top
      .pay-total
        line-height 3em
        float left
        margin-left 1em
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
