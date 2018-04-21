<template>
  <transition name="select-move">
    <div class="select-type border-1px" v-if="propertiesList" v-show="selectShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <div class="st-main">
        <header class="border-1px">
          <div class="st-img">
            <img :src="propertiesList[currentIndex]['mainImage']" alt="">
          </div>
          <div class="st-price">
            ￥{{totalMoney}}
          </div>
        </header>
        <div class="st-select">
          <div class="st-select-box border-1px" v-for="(val, key, index) in typeList">
            <div class="st-select-title">{{key}}</div>
            <div class="st-select-item"
                 :class="[i===indexObj[key]?'selected':'']"
                 @click="doSelect(key, i)"
                 v-for="(typeText,i) in val">
              {{typeText}}
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
  import {stringContains} from '@/commons/util'

  export default {
    data() {
      return {
        selectShow: false,
        propertiesList: null,
        totalMoney: 0,
        currentIndex: 0,
        typeList: {},
        typeListLength: 0,
        indexObj: {} // 选择的版本
      }
    },
    methods: {
      addToCart() {
        this.$emit('cart', this.propertiesList[this.currentIndex])
        this.selectShow = false
      },
      /**
       * 选择商品参数
       */
      doSelect(key, index) {
        // Vue.set(this.indexObj, key, index)
        this.indexObj[key] = index
        for (let index in this.propertiesList) {
          let properties = this.propertiesList[index]
          let text = properties['text']
          let count = 0
          for (let key in text) {
            if (text.hasOwnProperty(key)) {
              let value = text[key]
              if (value == this.typeList[key][this.indexObj[key]]) {
                count++
              }
            }
          }
          if (count === this.typeListLength) {
            console.log(text)
            this.totalMoney = properties['price']
            this.currentIndex = index
          }
        }
      },
      show(propertiesList, isVisited) {
        if (!isVisited) {
          this.propertiesList = propertiesList
          let map = {}
          for (let i = 0; i < this.propertiesList.length; i++) {
            let properties = this.propertiesList[i]
            let text = properties['text']
            // properties['text'] = text
            for (let key in text) {
              if (text.hasOwnProperty(key)) {
                let value = text[key]
                if (map[key]) {
                  if (!stringContains(map[key], value)) {
                    map[key].push(value)
                  }
                } else {
                  map[key] = []
                  map[key].push(value)
                  this.indexObj[key] = 0
                  this.typeListLength++
                }
              }
            }
            this.typeList = map
          }
          this.totalMoney = this.propertiesList[0]['price']
        }
        this.selectShow = true
      },
      hide() {
        this.$emit('selected', this.propertiesList[this.currentIndex])
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
    z-index 999
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
