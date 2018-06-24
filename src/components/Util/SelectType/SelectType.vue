<template>
  <transition name="select-move">
    <div class="select-type border-1px" v-if="propertiesList" v-show="selectShow">
      <div class="close" @click="hide">x</div>
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
  import {Dialog} from 'we-vue'
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
        selectedKeys: {},
        isOk: false,
        indexObj: {} // 选择的版本
      }
    },
    methods: {
      addToCart() {
        if (!this.isOk) {
          Dialog({
            title: '提示',
            message: '请选择',
            skin: 'ios'
          })
          return false
        }
        let index = this.currentIndex
        this.currentIndex = 0
        this.$emit('cart', this.propertiesList[index])
        this.selectShow = false
      },
      /**
       * 选择商品参数
       */
      doSelect(key, index) {
        this.indexObj[key] = index
        let tmp = this.totalMoney
        this.totalMoney = 0
        // 记录选择的规格数量
        if (!this.selectedKeys[key]) {
          this.selectedKeys[key] = true
        }
        let count1 = 0
        let count2 = 0
        for (let k in this.selectedKeys) {
          this.totalMoney = count1
          if (this.selectedKeys[k]) {
            count1++
          }
        }
        for (let k in this.typeList) {
          this.totalMoney = count1
          count2++
        }
        this.totalMoney = tmp
        // 选择全部规格后计算总价
        if (count1 === count2) {
          this.isOk = false
          for (let i in this.propertiesList) {
            let text = this.propertiesList[i]['text']
            let ocCount = 0
            for (let k in text) {
              let v = text[k]
              let selectedV = this.typeList[k][this.indexObj[k]]
              if (v == selectedV) {
                ocCount++
              }
            }
            if (ocCount === count2) {
              this.isOk = true
              this.totalMoney = this.propertiesList[i]['price']
              this.currentIndex = i
            }
          }
          if (!this.isOk) {
            Dialog({
              title: '提示',
              message: '无货',
              skin: 'ios'
            })
            this.indexObj[key] = -1
            this.selectedKeys[key] = false
          }
        }
        // 选择全部规格后计算总价
      },
      formatMap(list) {
        let map = {}
        for (let i = 0; i < list.length; i++) {
          let text = list[i]
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
                this.indexObj[key] = -1
                this.typeListLength++
              }
            }
          }
          this.typeList = map
        }
        // 输出
        // console.log('规格 start')
        // for (let k in this.typeList) {
        //   let v = this.typeList[k]
        //   let s = ''
        //   for (let i in v) {
        //     s += v[i] + ' '
        //   }
        //   console.log(k + '->' + s)
        // }
        // console.log('规格 end')
        // 输出
      },
      show(propertiesList, isVisited) {
        if (!isVisited) {
          this.propertiesList = propertiesList
          console.log(this.propertiesList.length)
          let list = []
          for (let index in this.propertiesList) {
            if (this.propertiesList.hasOwnProperty(index)) {
              list.push(this.propertiesList[index]['text'])
            }
          }
          this.formatMap(list)
          this.totalMoney = 0
          this.selectedKeys = {}
        }
        this.selectShow = true
      },
      hide() {
        let index = this.currentIndex
        this.currentIndex = 0
        if (!this.isOk) {
          this.$emit('selected', null)
        } else {
          this.$emit('selected', this.propertiesList[index])
        }
        this.selectShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/styles/color.styl"
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
          color main-red
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
              background main-red
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
        background main-red
        outline none
        border 0
      .st-add-cart
        width 100%
</style>
