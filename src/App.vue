<template>
  <div id="app">
    <header></header>
    <section id="viewer">
      <!--<keep-alive>-->
      <router-view :user="user" @success="loginSuccess" @detail="detail" @logout="logoutSuccess"
                   @avatar="changeAvatarSuccess" @update="updateSuccess" @search="openSearch"
                   @category="openProductions"></router-view>
      <!--</keep-alive>-->
    </section>
    <section id="navBar">
      <div @click="goTo('home')" :class="[currentComponent=='home'?'nav-active':'']" class="nav-item"><i
        class="nav-item-icon icon-home"></i><span class="nav-item-text">首页</span></div>
      <div @click="goTo('category')" :class="[currentComponent=='category'?'nav-active':'']" class="nav-item"><i
        class="nav-item-icon icon-list"></i><span class="nav-item-text">分类</span></div>
      <!--<div @click="goTo('recommend')" :class="[currentComponent=='recommend'?'nav-active':'']" class="nav-item"><i class="nav-item-icon icon-eye"></i><span class="nav-item-text">发现</span></div>-->
      <div @click="goTo('cart')" :class="[currentComponent=='cart'?'nav-active':'']" class="nav-item"><i
        class="nav-item-icon icon-cart"></i><span class="nav-item-text">购物车</span></div>
      <div @click="goTo('user')" :class="[currentComponent=='user'?'nav-active':'']" class="nav-item"><i
        class="nav-item-icon icon-user"></i><span class="nav-item-text">我的</span></div>
    </section>
    <search @find="find" ref="search"></search>
    <productions @search="openSearch" @detail="detail" ref="productions" :productionInfo="productionInfo"></productions>
    <production ref="production" :goodsId="goodsId" @tocart="toCart"></production>
  </div>
</template>

<script>
  import router from './router'
  import {Dialog} from 'we-vue'
  import Search from '@/components/Page/Search/Search'
  import Productions from '@/components/Page/Productions/Productions'
  import Production from '@/components/Page/Production/Production'
  import {
    path
  } from '@/commons/address.js'

  export default {
    name: 'app',
    components: {
      Search,
      Productions,
      Production
    },
    created() {
      this.getUserInfo()
      // 刷新页面后保持底部导航栏选中样式
      let address = this.$route.path
      if (address === '/') {
        address = 'home'
      } else {
        address = address.substring(1, address.length)
      }
      this.currentComponent = address
    },
    mounted() {
    },
    data() {
      return {
        goodsId: null,
        productionInfo: null,
        currentComponent: 'home',
        user: null
      }
    },
    methods: {
      changeAvatarSuccess(uri) {
        this.getUserInfo()
      },
      updateSuccess(user) {
        this.user = user
      },
      loginSuccess(user) {
        if (user !== null && user !== undefined) {
          this.user = user
          // 将本地购物车商品保存到用户购物车中
        }
      },
      logoutSuccess() {
        this.user = null
      },
      getUserInfo() {
        this.$http.post(path()['userInfo']).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = res['data']
            this.user = data
          } else {
            console.log('登陆状态: ' + res['msg'])
          }
        })
      },
      toCart(cartInfo) {
        // 将商品添加到购物车 如果没登陆(this.user===null)就保存到本地或者转到登陆
        if (this.user === null) {
          Dialog({
            title: '提示',
            message: '请登陆',
            skin: 'ios'
          })
        } else {
          this.$http.post(path()['addToCart'], {
            'propertiesId': cartInfo['propertiesId'],
            'quantity': 1,
            'goodsId': cartInfo['goodsId']
          }).then(response => {
            let res = response.body
            if (res['status'] === 0) {
              Dialog({
                title: '提示',
                message: '添加到购物车成功',
                skin: 'ios'
              })
            } else {
              Dialog({
                title: '提示',
                message: res['msg'],
                skin: 'ios'
              })
            }
          })
        }
      },
      detail(item) {
        this.goodsId = item['goodsId']
        this.$refs.production.show()
      },
      openProductions(category) {
        let o = {
          'type': 'c',
          'data': category
        }
        this.productionInfo = o
        this.$refs.productions.show()
      },
      openSearch(who) {
        switch (who) {
          case 'Home':
            break
          case 'Productions':
            break
        }
        this.$refs.search.show()
      },
      /**
       * 搜索商品
       * @param text
       */
      find(text) {
        let o = {
          'type': 's',
          'data': text
        }
        this.productionInfo = o
        this.$refs.productions.show()
      },
      // 切换component
      goTo(address) {
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
      overflow-x hidden
    #navBar
      background #fff
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
          color #e64340
        .nav-item-icon
          display block
          font-size 2em
</style>
