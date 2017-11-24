<template>
  <transition name="search-move">
    <div class="productions" v-show="productionsShow">
      <header>
        <div class="close" @click="hide"><i class="icon-cross"></i></div>
        <div @click="openSearchPage" class="search-bar">
          <i class="search-bar-icon icon-search"></i>
          <div>搜索商品</div>
        </div>
      </header>
      {{category['name']}}
      <search ref="search"></search>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import search from '@/components/Page/Search/Search'

  export default {
    props: {
      category: {
        type: Object
      }
    },
    components: {
      search
    },
    data () {
      return {
        productionsShow: false
      }
    },
    methods: {
      openSearchPage () {
        this.$refs.search.show()
      },
      show () {
        this.productionsShow = true
      },
      hide () {
        this.productionsShow = false
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
      padding 1em
      box-sizing border-box
      text-align center
      border-1px(#ccc)
      .close
        margin-top 0.3em
        margin-right 0.5em
        float left
      .search-bar
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
</style>
