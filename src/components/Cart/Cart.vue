<template>
  <div class="cart">
    <div class="cart-list" v-if="cartList!=null">
      <div class="cart-item" v-for="(item,index) in cartList">
        <div class="cart-item-checkbox" @click="checkItem(item, index)">
          <checkbox :checked="item['checked']==1"></checkbox>
          <div class="pay-bar-checkbox-text"></div>
        </div>
        <div class="cart-item-img" @click="showDetailFromCart(item)"><img :src="item['mainImage']" alt=""></div>
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
      <div class="next-page" @click="getMore" v-show="hasNextPage">
        点击加载更多
      </div>
    </div>
    <div class="pay-bar">
      <div class="pay-bar-checkbox" @click="checkAll">
        <checkbox ref="checkAll" :checked="isAllChecked"></checkbox>
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
        totalPrice: 0.0,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        hasNextPage: false
      }
    },
    computed: {
      isAllChecked () {
        if (this.cartList !== null) {
          for (let i = 0; i < this.cartList.length; i++) {
            let item = this.cartList[i]
            if (item['checked'] !== 1) {
              return false
            }
          }
        }
        return true
      }
    },
    watch: {
      'user' () {
        this.productionList = []
        this.pageNum = 1
        this.getCartList()
      }
    },
    created () {
      this.productionList = []
      this.pageNum = 1
      this.getCartList()
      // todo 删除购物车中的商品
    },
    methods: {
      /**
       * 点击商品图片进入商品详情页面
       * @param cart
       */
      showDetailFromCart (cart) {
        let productId = cart['productId']
        let o = {
          'id': productId
        }
        this.$emit('detail', o)
      },
      getMore () {
        this.pageNum++
        this.getCartList()
      },
      cartItemSub (index) {
        let item = this.cartList[index]
        this.$http.get(path()['sub'] + '?cartId=' + item['id']).then(response => {
          let res = response.body
          console.log(res)
          if (res['status'] === 0) {
            let quantity = this.cartList[index]['quantity']
            this.cartList[index]['quantity'] = (quantity - 1)
            this.computeTotalPrice()
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
            this.computeTotalPrice()
          } else {
            console.log(res['msg'])
          }
        })
      },
      /**
       * 选中或取消选中商品
       */
      checkItem (item, index) {
        this.$http.get(path()['check'] + '?cartId=' + item['id']).then(response => {
          let res = response.body
          console.log(res)
          if (res['status'] === 0) {
            let checked = this.cartList[index]['checked']
            this.cartList[index]['checked'] = (checked === 1 ? 0 : 1)
            this.computeTotalPrice()
          } else {
            console.log(res['msg'])
          }
        })
      },
      /**
       * 选中全部商品
       */
      checkAll () {
        this.$http.get(path()['checkAll']).then(response => {
          let res = response.body
          console.log(res)
          if (res['status'] === 0) {
            for (let i = 0; i < this.cartList.length; i++) {
              this.cartList[i]['checked'] = 1
            }
            this.computeTotalPrice()
          } else {
            console.log(res['msg'])
          }
        })
      },
      /**
       * 计算总价
       */
      computeTotalPrice () {
        let totalPrice = 0.0
        for (let i = 0; i < this.cartList.length; i++) {
          let item = this.cartList[i]
          if (item['checked'] === 1) {
            totalPrice += (parseFloat(item['unitPrice']) * item['quantity'])
          }
        }
        this.totalPrice = totalPrice
      },
      getCartList () {
        if (this.user !== null && this.user !== undefined) {
          this.$http.get(path()['getCart'] + '?pageNum=' + this.pageNum).then(response => {
            let res = response.body
            console.log(res)
            if (res['status'] === 0) {
              let data = res['data']
              this.cartList = data['list']
              for (let i = 0; i < this.cartList.length; i++) {
                this.cartList[i]['detail'] = JSON.parse(this.cartList[i]['detail'])
                let item = this.cartList[i]
                let text = ''
                for (let j = 0; j < item['detail'].length; j++) {
                  let detail = item['detail'][j]
                  text += '[' + detail['value'][detail['selected']]['val'] + ']'
                }
                this.cartList[i]['typeStr'] = text
              }
              this.computeTotalPrice()
            } else {
              console.log(res['msg'])
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
      margin-bottom 3.5em
      .next-page
        height 5em
        line-height 5em
        width 100%
        text-align center
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
    .pay-bar
      position fixed
      bottom 4em
      left 0
      width 100%
      height 3em
      background #fff
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
