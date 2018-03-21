<template>
  <transition name="search-move">
    <div class="productions" v-show="productionsShow">
      <header class="border-1px">
        <div class="close" @click="hide"><i class="icon-cross"></i></div>
        <div @click="openSearchPage" class="productions-search-bar">
          <i class="search-bar-icon icon-search"></i>
          <div>搜索商品</div>
        </div>
      </header>
      <section class="production-list scroll-wrapper" ref="scrollWrapperProductionList">
        <div>
          <div class="production-item border-1px" @click="showDetail(production)" v-for="production in productionList">
            <div class="production-img"><img :src="production['img']" alt=""></div>
            <div class="production-detail">
              <p class="production-title">{{production['name']}}</p>
              <p class="production-price">{{production['price']}}</p>
              <p class="production-review">{{production['review']}}</p>
            </div>
          </div>

          <div class="production-item border-1px" v-if="productionList.length <= 0">
            <div class="production-img"></div>
            <div class="production-detail">
              <p class="production-title">暂无商品</p>
              <p class="production-price"></p>
              <p class="production-review"></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    props: {
      productionInfo: {
        type: Object
      }
    },
    watch: {
      'productionInfo' () {
        this.getProductionList()
        this.initScroll()
      }
    },
    data () {
      return {
        scrollProductionList: null,
        productionsShow: false,
        productionList: []
      }
    },
    methods: {
      showDetail (item) {
        this.$emit('detail', item)
      },
      openSearchPage () {
        this.$emit('search', 'Productions')
      },
      initScroll () {
        this.$nextTick(() => {
          if (!this.scrollProductionList) {
            this.scrollProductionList = new BetterScroll(this.$refs.scrollWrapperProductionList, {
              click: true
            })
          } else {
            this.scrollProductionList.refresh()
          }
        })
      },
      show () {
        this.productionsShow = true
      },
      hide () {
        this.productionsShow = false
      },
      getProductionList () {
        let type = this.productionInfo['type']
        let data = this.productionInfo['data']
        let url = ''
        switch (type) {
          case 'c':
            url = path()['productionList'] + '?category=' + data['name'] // todo name改成id
            break
          case 's':
            url = path()['productionListByKeywords'] + '?key=' + data
        }
        this.$http.get(url).then((response) => {
          let status = response.body['status']
          let msg = response.body['msg']
          let data = response.body['data']
          this.productionList = []
          if (status === 200) {
            for (let i = 0; i < data.length; i++) {
              let item = data[i]
              Vue.set(this.productionList, i, item)
            }
            this.initScroll()
          } else {
            console.log(msg)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

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
  .search-move-enter-active
    animation bounce-in .2s linear
  .search-move-leave-active
    animation bounce-out .2s linear
  .productions
    position fixed
    top 0
    left 0
    bottom 0
    z-index 1000
    width 100%
    background #fff
    box-sizing border-box
    header
      width 100%
      height 4em
      padding 1em
      box-sizing border-box
      text-align center
      background #fff
      border-1px(#ccc)
      .close
        margin-top 0.3em
        margin-right 0.5em
        float left
      .productions-search-bar
        width 70%
        position relative
        display inline-block
        .search-bar-icon
          position absolute
          left 1em
          top 0.5em
          color #777
        div
          text-align left
          border 0
          outline none
          background #ccc
          color #777
          line-height 2em
          padding 0
          padding-left 3em
          border-top-left-radius 2em
          border-bottom-left-radius 2em
          border-top-right-radius 2em
          border-bottom-right-radius 2em
      .search-button
        margin-left 0.5em
        font-size 1.3em
        float right
        margin-top 0.1em
    .production-list
      position fixed
      z-index -1
      top 5em
      left 0
      bottom 0
      right 0
      .production-item
        width 100%
        height 12em
        border-1px(#ccc)
        margin 0.5em
        box-sizing border-box
        .production-img
          float left
          height 11em
          img
            height 100%
        .production-detail
          .production-title
            font-weight bold
          .production-price
            color #e31d1a
          .production-review
            color #777
</style>
