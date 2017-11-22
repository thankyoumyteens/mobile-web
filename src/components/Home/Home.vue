<template>
  <div class="home">
    <header>
      <div class="wall">
        <div class="img-wrapper">
          <img :src="item['img']" alt="" class="img-item" v-for="item in imgList">
        </div>
        <div class="count-bar"></div>
      </div>
      <div @click="openSearchPage" class="search-bar">
        <i class="search-bar-icon icon-search"></i>
        <div>查找商品</div>
      </div>
    </header>
    <search ref="search"></search>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import search from '@/components/Page/Search/Search'
  import testImg from './3.jpg'

  export default {
    components: {
      search
    },
    created () {
      // 获取图片
      for (let i = 1; i <= 3; i++) {
        let o = {
          img: testImg,
          link: i
        }
        Vue.set(this.imgList, i - 1, o)
      }
    },
    data () {
      return {
        imgList: [] // 顶部滚动图片列表
      }
    },
    methods: {
      openSearchPage () {
        this.$refs.search.show()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    header
      position relative
      .wall
        width 100%
        .img-wrapper
          height 12em
          overflow hidden
          .img-item
            float left
            width 100%
            min-height 12em
      .search-bar
        background #fff
        position absolute
        top 1em
        left 1em
        right 1em
        border-top-left-radius 2em
        border-bottom-left-radius 2em
        border-top-right-radius 2em
        border-bottom-right-radius 2em
        .search-bar-icon
          position absolute
          left 1em
          top 0.5em
          color #777
        div
          color #777
          height 2em
          line-height 2em
          padding 0
          padding-left 3em
</style>
