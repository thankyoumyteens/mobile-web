<template>
  <transition name="select-move">
    <div class="select-type border-1px" v-if="production!=null" v-show="selectShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <div class="st-main">
        <header class="border-1px">
          <div class="st-img">
            <img :src="production['images'][0]" alt="">
          </div>
          <div class="st-price">
            ￥{{totalMoney}}
          </div>
        </header>
        <div class="st-select">
          <div class="st-select-box border-1px" v-for="typeItem,index in production['type']">
            <div class="st-select-title">{{typeItem['display']}}</div>
            <div class="st-select-item"
                 :class="[selectedData[index]['item']==value?'selected':'']"
                 @click="doSelect(typeItem, index, value)"
                 v-for="value in typeItem['selection']">
              {{value['name']}}
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
        selectedData: [],
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
          for (let i = 0; i < this.selectedData.length; i++) {
            let item = this.selectedData[i]
            let add = parseFloat(item['item']['add'])
            total += add
          }
        }
        return total
      }
    },
    methods: {
      addToCart () {
        this.$emit('cart', this.selectedData)
        this.selectShow = false
      },
      /**
       * 选择商品参数
       * @param typeItem 当前商品的某个参数
       * 例子:
       *  {
       *   'name': 'color',
       *   'display': '颜色',
       *   'selection': [
       *     { 'name': '极夜黑', 'add': '0'},
       *     { 'name': '深海蓝', 'add': '0'}
       *   ]
       *  }
       * @param index 这个参数在type中的索引
       * 例子: 0 (表示type[0])
       * @param value 选中的值
       * 例子:
       * { 'name': '极夜黑', 'add': '0'}
       */
      doSelect (typeItem, index, value) {
        let o = {
          'type': typeItem,
          'item': value
        }
        Vue.set(this.selectedData, index, o)
      },
      show (production) {
        this.production = production
        // todo 记住同一件商品的选择
        for (let i = 0; i < production['type'].length; i++) {
          let type = production['type'][i]
          let o = {
            'type': type,
            'item': type['selection'][0]
          }
          Vue.set(this.selectedData, i, o)
        }
        this.selectShow = true
      },
      hide () {
        this.$emit('selected', this.selectedData)
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
