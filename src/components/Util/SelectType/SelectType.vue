<template>
  <transition name="select-move">
    <div class="select-type border-1px" v-if="production!=null" v-show="selectShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <div class="st-main">
        <header class="border-1px">
          <div class="st-img">
            <img :src="production['mainImage']" alt="">
          </div>
          <div class="st-price">
            ￥{{totalMoney}}
          </div>
        </header>
        <div class="st-select">
          <div class="st-select-box border-1px" v-for="typeItem,index in production['detail']">
            <div class="st-select-title">{{typeItem['key']}}</div>
            <div class="st-select-item"
                 :class="[i==typeItem['selected']?'selected':'']"
                 @click="doSelect(index, i, value)"
                 v-for="value,i in typeItem['value']">
              {{value['val']}}
            </div>
            <div class="clear-float"></div>
          </div>
        </div>
      </div>
      <div class="st-buttons">
        <button class="st-button st-add-cart" @click="addToCart">加入购物车</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    data () {
      return {
        selectShow: false,
        production: null
      }
    },
    computed: {
      totalMoney () {
        let total = 0
        if (this.production) {
          let old = parseFloat(this.production['price'])
          total = old
          for (let i = 0; i < this.production['detail'].length; i++) {
            let item = this.production['detail'][i]
            let add = parseFloat(item['value'][item['selected']]['money'])
            total += add
          }
        }
        return total
      }
    },
    methods: {
      addToCart () {
        this.$emit('cart', this.production)
        this.selectShow = false
      },
      /**
       * 选择商品参数
       */
      doSelect (index, i, value) {
        this.production['detail'][index]['selected'] = i
      },
      show (production) {
        console.log(production)
        this.production = production
        this.selectShow = true
      },
      hide () {
        this.$emit('selected', this.production)
        this.selectShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

  @keyframes bounce-in-vertical
    0%
      transform translate3d(0, 100%, 0)
    100%
      transform translate3d(0, 0, 0)
  @keyframes bounce-out-vertical
    0%
      transform translate3d(0, 0, 0)
    100%
      transform translate3d(0, 100%, 0)
  .select-move-enter-active
    animation bounce-in-vertical .2s linear
  .select-move-leave-active
    animation bounce-out-vertical .2s linear
  .select-type
    border-top-1px(#ccc)
    position fixed
    z-index 100000
    bottom 0
    left 0
    right 0
    background #fff
    .close
      position absolute
      z-index 100001
      top 0
      right 0
      margin-right 0.5em
      font-weight normal
    .st-main
      margin-bottom 4em
      header
        border-1px(#ccc)
        height 3.5em
        line-height 3.5em
        .st-img
          height 2.5em
          width 2.5em
          margin 0.5em
          float left
          img
            width 100%
            height 100%
        .st-price
          color #e31d1a
      .st-select
        width 100%
        .st-select-box
          width 100%
          border-1px(#ccc)
          clear both
          .st-select-title
            margin 0.5em
          .st-select-item
            float left
            padding 0.3em
            background #eee
            color #000
            margin 0.5em
            &.selected
              background #e31d1a
              color #fff
    .st-buttons
      position fixed
      bottom 0
      left 0
      width 100%
      height 4em
      .st-button
        height 100%
        color #fff
        background #e31d1a
        outline none
        border 0
      .st-add-cart
        width 100%
</style>
