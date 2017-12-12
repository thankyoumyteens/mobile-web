<template>
  <transition name="search-move">
    <div class="search" v-show="searchShow">
      <header>
        <div class="close" @click="hide"><i class="icon-cross"></i></div>
        <div class="search-bar-page">
          <i class="search-bar-icon icon-search"></i>
          <input type="text" id="searchContent" name="searchContent">
        </div>
        <div class="search-button" @click="search">搜索</div>
      </header>
      <!--<split></split>-->
      <section class="history-wrapper">
        <h3 class="history-title">历史搜索</h3>
        <div class="history-item" @click="addToBar(item)" v-for="item in historyList">{{item}}</div>
        <div class="history-item" v-if="historyList.length <= 0">暂无记录</div>
      </section>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import split from '@/components/Util/Split/Split'

  export default {
    components: {
      split
    },
    data () {
      return {
        searchShow: false,
        historyList: []
      }
    },
    methods: {
      addToBar (item) {
        document.getElementById('searchContent').value = item
      },
      show () {
        document.getElementById('searchContent').value = ''
        let history = localStorage.getItem('history')
        if (history !== null) {
          let arr = history.split(';')
          for (let i = 0; i < arr.length; i++) {
            Vue.set(this.historyList, i, arr[i])
          }
        } else {
          // 暂无记录
        }
        this.searchShow = true
      },
      hide () {
        this.searchShow = false
      },
      search () {
        let searchContent = document.getElementById('searchContent').value
        this.$emit('find', searchContent)
        let history = localStorage.getItem('history')
        if (history !== null) {
          localStorage.setItem('history', searchContent + ';' + history)
        } else {
          localStorage.setItem('history', searchContent)
        }
        this.hide()
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
  .search
    position fixed
    top 0
    left 0
    bottom 0
    z-index 1000
    width 100%
    background #fff
    box-sizing border-box
    header
      padding 1em
      text-align center
      border-1px(#ccc)
      .close
        margin-top 0.3em
        margin-right 0.5em
        float left
      .search-bar-page
        position relative
        display inline-block
        .search-bar-icon
          position absolute
          left 1em
          top 0.5em
          color #777
        input
          border 0
          outline none
          background #ccc
          color #777
          height 2.5em
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
    .history-wrapper
      width 90%
      margin auto
      .history-title
        padding 1em
        padding-left 0.5em
        border-1px(#ccc)
      .history-item
        padding 1em
        border-1px(#ccc)
        color #ccc
</style>
