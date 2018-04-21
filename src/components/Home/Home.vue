<template>
  <div class="home">
    <header>
      <div class="wall">
        <transition-group class="img-wrapper" tag="div" name="image">
          <!--<div class="img-wrapper">-->
          <img @click="openDetail(item)" :src="item" v-show="index===currentImgIndex" class="img-item"
               v-for="(item,index) in imgList" :key="index">
          <!--</div>-->
        </transition-group>
        <div class="count-bar">
          <span @click="changeImg(index)" v-for="(item,index) in imgList"
                :class="{'count-active':index===currentImgIndex}" :key="index"></span>
        </div>
      </div>
      <div @click="openSearchPage" class="search-bar">
        <i class="search-bar-icon icon-search"></i>
        <div>{{placeholder}}</div>
      </div>
    </header>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {
    path
  } from '@/commons/address.js'

  export default {
    created() {
      // 获取图片
      this.$http.get(path()['homeImgList']).then((response) => {
        let status = response.body['status']
        let data = response.body['data']
        if (status === 0) {
          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            Vue.set(this.imgList, i, item)
          }
          console.log(this.imgList)
          // 开启图片轮播
          this.autoChange()
        } else {
          let msg = response.body['msg']
          console.log(msg)
        }
      })
      // 获取搜索框提示文字
      this.$http.get(path()['homePlaceholder']).then((response) => {
        let status = response.body['status']
        let msg = response.body['msg']
        let data = response.body['data']
        if (status === 0) {
          this.placeholder = data
        } else {
          console.log(msg)
        }
      })
    },
    data() {
      return {
        imgTimer: null, // 图片轮播计时器
        currentImgIndex: 0, // 当前显示的图片在imgList中的索引
        placeholder: '', // 搜索框提示文字
        imgList: [] // 顶部滚动图片列表
      }
    },
    methods: {
      openDetail(item) {
        console.log(item['img'])
      },
      openSearchPage() {
        this.$emit('search', 'Home')
      },
      changeImg(index) {
        this.currentImgIndex = index
      },
      autoChange() {
        this.imgTimer = setInterval(() => {
          if (this.currentImgIndex === this.imgList.length - 1) {
            this.currentImgIndex = 0
          } else {
            this.currentImgIndex++
          }
        }, 2500)
      },
      // 仅对鼠标有效
      start() {
        this.autoChange()
      },
      // 仅对鼠标有效
      stop() {
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
            height 0.1em
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
