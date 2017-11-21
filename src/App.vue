<template>
  <div id="app">
    <header></header>
    <section id="viewer">
      <router-view></router-view>
    </section>
    <section id="navBar">
      <div class="nav-item nav-active"><i class="nav-item-icon icon-home"></i><span class="nav-item-text">首页</span></div>
      <div class="nav-item"><i class="nav-item-icon icon-list"></i><span class="nav-item-text">分类</span></div>
      <div class="nav-item"><i class="nav-item-icon icon-eye"></i><span class="nav-item-text">发现</span></div>
      <div class="nav-item"><i class="nav-item-icon icon-cart"></i><span class="nav-item-text">购物车</span></div>
      <div class="nav-item"><i class="nav-item-icon icon-user"></i><span class="nav-item-text">我的</span></div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
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
        color #777
        &.nav-active
          color #000
        .nav-item-icon
          display block
          font-size 2em
</style>
