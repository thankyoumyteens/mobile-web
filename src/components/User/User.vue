<template>
  <div class="user">
    <div class="user-detail">
      <!--未登录-->
      <div class="ui-login" @click="showLogin" v-show="!isUser">
        <div class="ui-avatar"><img src="./avatar.jpg"></div>
        <div class="ui-text">登陆/注册</div>
      </div>
      <!--已登陆-->
      <div class="ui-user" @click="showUserInfo" v-if="isUser&&user!=null">
        <div class="ui-avatar"><img :src="user['avatar']" alt=""></div>
        <div class="ui-username">{{user['nickname']}}</div>
      </div>
    </div>
    <section class="order-info">
      <div @click="openOrderAll" class="order-info-item"><i class="iconfont icon-quanbudingdan"></i><span
        class="order-info-title">全部订单</span></div>
      <div @click="openOrderNotPay" class="order-info-item"><i class="iconfont icon-daifukuan"></i><span
        class="order-info-title">待付款</span></div>
      <div @click="openOrderPayed" class="order-info-item"><i class="iconfont icon-icon3"></i><span
        class="order-info-title">待发货</span></div>
    </section>
    <split :size="0.5"></split>
    <section class="favorite-container" v-if="isUser">
      <div class="favorite-item">
        <span class="favorite-count">{{favoriteGoodsCount}}</span><span class="favorite-text">收藏的商品</span>
      </div>
      <div class="favorite-item">
        <span class="favorite-count">{{favoriteShopCount}}</span><span class="favorite-text">收藏的店铺</span>
      </div>
    </section>
    <split></split>
    <login ref="login" @success="loginSuccess"></login>
    <user-info ref="userInfo"
               :user="user"
               @logout="logoutSuccess"
               @avatar="changeAvatarSuccess"
               @update="updateSuccess"></user-info>
    <order-list ref="orlist"></order-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import Split from '@/components/Util/Split/Split'
  import Login from '@/components/Page/Login/Login'
  import UserInfo from '@/components/Page/UserInfo/UserInfo'
  import OrderList from '@/components/Page/Order/OrderList'
  import {path} from '@/commons/address'
  import {ResponseCode, FavoriteType} from '@/commons/config'

  export default {
    components: {
      Split,
      Login,
      UserInfo,
      OrderList
    },
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        isUser: false,
        favoriteGoodsCount: 0,
        favoriteShopCount: 0
      }
    },
    watch: {
      'user'() {
        this.isUser = this.user !== null && this.user !== undefined
        if (this.isUser) {
          this.getFavoriteList(FavoriteType.GOODS)
          this.getFavoriteList(FavoriteType.SHOP)
        }
      }
    },
    created() {
      if (this.user !== null && this.user !== undefined) {
        this.isUser = true
      }
      if (this.isUser) {
        this.getFavoriteList(FavoriteType.GOODS)
        this.getFavoriteList(FavoriteType.SHOP)
      }
    },
    methods: {
      getFavoriteList(type) {
        this.$http.get(path()['getFavoriteCount'] + '?type=' + type).then((response) => {
          let res = response.body
          if (res.status === ResponseCode.SUCCESS) {
            switch (type) {
              case FavoriteType.GOODS:
                this.favoriteGoodsCount = res.data
                break
              case FavoriteType.SHOP:
                this.favoriteShopCount = res.data
                break
            }
          } else {
            Dialog({
              title: '提示',
              message: res.msg,
              skin: 'ios'
            })
          }
        })
      },
      openOrderAll() {
        if (this.user !== null && this.user !== undefined) {
          this.$refs.orlist.show('all')
        }
      },
      openOrderNotPay() {
        if (this.user !== null && this.user !== undefined) {
          this.$refs.orlist.show('notPay')
        }
      },
      openOrderPayed() {
        if (this.user !== null && this.user !== undefined) {
          this.$refs.orlist.show('payed')
        }
      },
      openOrderSent() {
        if (this.user !== null && this.user !== undefined) {
          this.$refs.orlist.show('sent')
        }
      },
      changeAvatarSuccess(uri) {
        this.$emit('avatar', uri)
      },
      updateSuccess(user) {
        this.$emit('update', user)
      },
      showUserInfo() {
        this.$refs.userInfo.show()
      },
      loginSuccess(user) {
        this.$emit('success', user)
      },
      logoutSuccess() {
        this.$emit('logout')
      },
      showLogin() {
        this.$refs.login.show()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user
    width 100%
    background #fff
    .user-detail
      width 100%
      background url("./bg.jpg") top left no-repeat
      background-size 100%
      margin auto
      border-bottom-left-radius 5%
      border-bottom-right-radius 5%
      .ui-login
        padding 2.5em 0
        width 100%
        text-align center
        .ui-avatar
          display inline-block
          width 3em
          height 3em
          overflow hidden
          border-radius 50%
          img
            width 100%
            height 100%
        .ui-text
          display inline-block
          height 3em
          line-height 3em
          vertical-align top
          margin-left 1em
          color #fff
          &:active
            text-decoration underline
      .ui-user
        padding 2.5em 0
        width 100%
        text-align center
        .ui-avatar
          display inline-block
          width 3em
          height 3em
          overflow hidden
          border-radius 50%
          img
            width 100%
            height 100%
        .ui-username
          display inline-block
          height 3em
          line-height 3em
          vertical-align top
          margin-left 1em
          color #fff
    .order-info
      margin 1em 0
      width 100%
      display flex
      .order-info-item
        flex 1
        text-align center
        i
          font-size 1.5em
        .order-info-item-img
          width 50%
          display inline-block
        .order-info-title
          width 100%
          display inline-block
          color #000
    .favorite-container
      display flex
      .favorite-item
        flex 1
        text-align center
        .favorite-count
          display block
          font-weight bold
          height 3em
          line-height 3em
        .favorite-text
          display block
          height 2em
          line-height 2em
</style>
