<template>
  <div id="app">
    <header></header>
    <section id="viewer">
      <router-view></router-view>
    </section>
    <section id="navBar">
      <div @click="goto('home')" :class="[currentComponent=='home'?'nav-active':'']" class="nav-item"><i class="nav-item-icon icon-home"></i><span class="nav-item-text">首页</span></div>
      <div @click="goto('category')" :class="[currentComponent=='category'?'nav-active':'']" class="nav-item"><i class="nav-item-icon icon-list"></i><span class="nav-item-text">分类</span></div>
      <div @click="goto('recommend')" :class="[currentComponent=='recommend'?'nav-active':'']" class="nav-item"><i class="nav-item-icon icon-eye"></i><span class="nav-item-text">发现</span></div>
      <div @click="goto('cart')" :class="[currentComponent=='cart'?'nav-active':'']" class="nav-item"><i class="nav-item-icon icon-cart"></i><span class="nav-item-text">购物车</span></div>
      <div @click="goto('user')" :class="[currentComponent=='user'?'nav-active':'']" class="nav-item"><i class="nav-item-icon icon-user"></i><span class="nav-item-text">我的</span></div>
    </section>
  </div>
</template>

<script>
  import router from './router'

  export default {
    name: 'app',
    created () {
      // 刷新页面后保持底部导航栏选中样式
      let address = this.$route.path
      if (address === '/') {
        address = 'home'
      } else {
        address = address.substring(1, address.length)
      }
      this.currentComponent = address
    },
    data () {
      return {
        currentComponent: 'home'
      }
    },
    methods: {
      // 切换component
      goto (address) {
        this.currentComponent = address
        if (address === 'home') {
          router.push('/')
        } else {
          router.push('/' + address)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
    border 0
    padding 0
    #viewer
      margin-bottom 4em
    #navBar
      display flex
      overflow hidden
      width 100%
      height 4em
      position fixed
      bottom 0
      left 0
      box-shadow 0 0 1em #ccc
      .nav-item
        display inline-block
        flex 1
        text-align center
        color #555
        &.nav-active
          color #e31d1a
        .nav-item-icon
          display block
          font-size 2em
</style>
