<template>
  <div class="cart">
    <div class="cart-list" v-if="cartList.length>0">
      <div class="cart-item" v-for="(item,index) in cartList">
        <div class="cart-item-checkbox" @click="checkItem(item, index)">
          <checkbox :checked="item['checked']==1"></checkbox>
          <div class="pay-bar-checkbox-text"></div>
        </div>
        <div class="cart-item-img" @click="showDetailFromCart(item)"><img :src="item['mainImage']" alt=""></div>
        <div class="cart-item-detail">
          <p class="cart-item-title">{{item['productName']}}</p>
          <p class="cart-item-type">{{item['detail']}}</p>
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
    <div class="loading" v-if="user&&cartList.length<=0">
      <wv-spinner type="dot-circle" :size="50"></wv-spinner>
    </div>
    <div class="loading" v-if="!user">请登陆</div>
    <div class="pay-bar">
      <div class="pay-bar-checkbox" @click="checkAll">
        <checkbox ref="checkAll" :checked="isAllChecked"></checkbox>
        <div class="pay-bar-checkbox-text">全选</div>
      </div>
      <div class="pay-total">合计:￥{{totalPrice}}</div>
      <div class="pay-button" @click="createOrderBefore">结算</div>
    </div>
    <co ref="coComp" @success="createOrderSuccess"></co>
    <waitp ref="waitpWaitPay"></waitp>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import co from '@/components/Page/Order/CreateOrder'
  import checkbox from '@/components/Util/Checkbox/Checkbox'
  import waitp from '@/components/Util/UtilPage/WaitPay'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      checkbox,
      co,
      waitp
    },
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        checkedList: [],
        cartList: [],
        totalPrice: 0.0,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        hasNextPage: false
      }
    },
    computed: {
      isAllChecked() {
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
      'user'() {
        this.productionList = []
        this.pageNum = 1
        this.getCartList()
      }
    },
    created() {
      this.cartList = []
      this.pageNum = 1
      this.getCartList()
    },
    methods: {
      createOrderSuccess(order) {
        this.getCartListReset()
        console.log(order)
        // todo (可选)打开订单详情页/支付页面
        this.$refs.waitpWaitPay.show(order['orderNo'])
      },
      createOrderBefore() {
        if (!this.checkCart()) {
          alert('请选择商品')
          return false
        }
        // todo bug下一页中的选中商品不包含
        this.$refs.coComp.show(this.cartList)
      },
      /**
       * 点击商品图片进入商品详情页面
       * @param cart
       */
      showDetailFromCart(cart) {
        let productId = cart['productId']
        let o = {
          'goodsId': productId
        }
        this.$emit('detail', o)
      },
      getMore() {
        this.pageNum++
        this.getCartList()
      },
      /**
       * 检查购物车中是否有选中的商品
       */
      checkCart() {
        for (let i = 0; i < this.cartList.length; i++) {
          let item = this.cartList[i]
          if (item['checked'] === 1) {
            return true
          }
        }
        return false
      },
      cartItemSub(index) {
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
      cartItemAdd(index) {
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
      checkItem(item, index) {
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
      checkAll() {
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
      computeTotalPrice() {
        let totalPrice = 0.0
        for (let i = 0; i < this.cartList.length; i++) {
          let item = this.cartList[i]
          if (item['checked'] === 1) {
            totalPrice += (parseFloat(item['unitPrice']) * item['quantity'])
          }
        }
        this.totalPrice = totalPrice
      },
      getCartListReset() {
        if (this.user !== null && this.user !== undefined) {
          this.$http.get(path()['getCart'] + '?pageNum=' + this.pageNum).then(response => {
            let res = response.body
            console.log(res)
            if (res['status'] === 0) {
              let data = res['data']
              this.cartList = data['list']
              this.computeTotalPrice()
            } else {
              console.log(res['msg'])
            }
          })
        }
      },
      getCartList() {
        if (this.user !== null && this.user !== undefined) {
          this.$http.get(path()['getCart'] + '?pageNum=' + this.pageNum).then(response => {
            let res = response.body
            console.log(res)
            if (res['status'] === 0) {
              let data = res['data']
              for (let i = 0; i < data['list'].length; i++) {
                let item = data['list'][i]
                // 下一页数据追加到数组末尾
                let index = this.cartList.length
                Vue.set(this.cartList, index, item)
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
