<template>
  <transition name="search-move">
    <div class="productions" v-show="productionsShow">
      <v-header titleText="商品" @back="hide"></v-header>
      <div class="loading" v-if="isLoading">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <div class="loading" v-if="!isLoading&&productionList.length<=0">
        暂无商品
      </div>
      <section class="production-list scroll-wrapper" ref="scrollWrapperProductionList">
        <div>
          <div class="production-item border-1px" @click="showDetail(production)" v-for="production in productionList">
            <div class="production-img"><img :src="production['mainImage']" alt=""></div>
            <div class="production-detail">
              <p class="production-title">{{production['name']}}</p>
              <p class="production-price">￥{{production['price']}}</p>
              <p class="production-review">{{production['subtitle']}}</p>
            </div>
            <split :size="0.05" class="clear-float"></split>
          </div>

          <div class="next-page" @click="getMore" v-show="hasNextPage">点击加载更多</div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BetterScroll from 'better-scroll'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'
  import Split from '@/components/Util/Split/Split'
  import VHeader from '@/components/Util/Header/Header'

  export default {
    components: {
      Split,
      VHeader
    },
    props: {
      productionInfo: {
        type: Object
      }
    },
    watch: {
      'productionInfo'() {
        this.getProductionList()
        this.initScroll()
      }
    },
    data() {
      return {
        scrollProductionList1: null,
        productionsShow: false,
        productionList: [],
        isLoading: true,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        hasNextPage: false
      }
    },
    methods: {
      getMore() {
        this.pageNum++
        this.getProductionList()
      },
      showDetail(item) {
        this.$emit('detail', item)
      },
      /**
       * 打开搜索页面
       */
      openSearchPage() {
        this.$emit('search', 'Productions')
        this.hide()
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.$refs.scrollWrapperProductionList) return
          if (!this.scrollProductionList1) {
            this.scrollProductionList1 = new BetterScroll(this.$refs.scrollWrapperProductionList, {
              click: true
            })
          } else {
            this.scrollProductionList1.refresh()
          }
        })
      },
      show() {
        this.productionsShow = true
        this.productionList = []
        this.pageNum = 1
        this.initScroll()
      },
      hide() {
        this.productionsShow = false
        this.scrollProductionList1 = null
      },
      getProductionList() {
        this.isLoading = true
        let type = this.productionInfo['type']
        let data = this.productionInfo['data']
        let url = ''
        switch (type) {
          case 'c': // 根据分类查找商品
            url = path()['productionList'] + '?categoryId=' + data['id'] + '&pageNum=' + this.pageNum
            break
          case 's': // 根据关键字查找商品
            url = path()['productionListByKeywords'] + '?keyword=' + data + '&pageNum=' + this.pageNum
        }
        this.$http.get(url).then((response) => {
          let status = response.body['status']
          this.isLoading = false
          if (status === ResponseCode.SUCCESS) {
            let data = response.body['data']['list']
            this.pages = response.body['data']['pages']
            this.hasNextPage = response.body['data']['hasNextPage']
            for (let i = 0; i < data.length; i++) {
              let item = data[i]
              // 下一页数据追加到数组末尾
              let index = this.productionList.length
              Vue.set(this.productionList, index, item)
            }
            console.log(this.hasNextPage)
            this.initScroll()
          } else {
            let msg = response.body['msg']
            console.log(msg)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/styles/color.styl"
  .search-move-enter-active
    animation bounce-in .2s linear

  .search-move-leave-active
    animation bounce-out .2s linear

  .productions
    position fixed
    top 0
    left 0
    bottom 0
    z-index 990
    width 100%
    background #fff
    box-sizing border-box
    .production-list
      position fixed
      z-index -1
      top 50px
      left 0
      bottom 0
      right 0
      .next-page
        height 5em
        line-height 5em
        width 100%
        text-align center
      .production-item
        width 100%
        height 12em
        border-1px(#ccc)
        margin 0.5em 0
        box-sizing border-box
        .production-img
          float left
          height 11em
          img
            max-width 176px
            height 100%
        .production-detail
          .production-title
            font-weight bold
          .production-price
            color price-red
          .production-review
            color #777
</style>
