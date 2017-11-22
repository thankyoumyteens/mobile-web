<template>
  <div class="home">
    <header>
      <div class="wall" @mouseover="stop" @mouseout="start">
        <transition-group class="img-wrapper" tag="div" name="image">
          <!--<div class="img-wrapper">-->
            <img :src="item['img']" v-show="index===currentImgIndex" class="img-item" v-for="(item,index) in imgList" :key="index">
          <!--</div>-->
        </transition-group>
        <div class="count-bar">
          <span @click="changeImg(index)" v-for="(item,index) in imgList" :class="{'count-active':index===currentImgIndex}" :key="index"></span>
        </div>
      </div>
      <div @click="openSearchPage" class="search-bar">
        <i class="search-bar-icon icon-search"></i>
        <div>{{placeholder}}</div>
      </div>
    </header>
    <search ref="search"></search>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import search from '@/components/Page/Search/Search'
  import testImg1 from './1.jpg'
  import testImg2 from './2.jpg'
  import testImg3 from './3.jpg'

  export default {
    components: {
      search
    },
    created () {
      // 获取图片
      let o = {
        img: testImg1,
        link: '0000000000'
      }
      Vue.set(this.imgList, 0, o)
      o = {
        img: testImg2,
        link: '11111111111'
      }
      Vue.set(this.imgList, 1, o)
      o = {
        img: testImg3,
        link: '222222222222'
      }
      Vue.set(this.imgList, 2, o)
      // 开启图片轮播
      this.autoChange()
      // 获取搜索框提示文字
      this.placeholder = 'iphone X'
    },
    data () {
      return {
        imgTimer: null, // 图片轮播计时器
        currentImgIndex: 0, // 当前显示的图片在imgList中的索引
        placeholder: '查找商品', // 搜索框提示文字
        imgList: [] // 顶部滚动图片列表
      }
    },
    methods: {
      openSearchPage () {
        this.$refs.search.show()
      },
      changeImg (index) {
        this.currentImgIndex = index
      },
      autoChange () {
        this.imgTimer = setInterval(() => {
          if (this.currentImgIndex === this.imgList.length - 1) {
            this.currentImgIndex = 0
          } else {
            this.currentImgIndex++
          }
        }, 2500)
      },
      // 仅对鼠标有效
      start () {
        this.autoChange()
      },
      // 仅对鼠标有效
      stop () {
        clearInterval(this.imgTimer)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .image-enter-active
    transform translateX(0)
    transition all 1s ease
  .image-leave-active
    transform translateX(-100%)
    transition all 1s ease
  .image-enter
    transform translateX(100%)
  .image-leave
    transform translateX(0)
  .home
    header
      position relative
      .wall
        width 100%
        position relative
        overflow hidden
        .img-wrapper
          height 12em
          overflow hidden
          .img-item
            position absolute
            width 100%
            min-height 12em
        .count-bar
          position absolute
          width 100%
          bottom 1em
          margin 0 auto
          z-index 10
          text-align center
          span
            width 1em
            height 0.2em
            background #fff
            display inline-block
            margin-right 0.5em
            &.count-active
              background #e31d1a !important
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
