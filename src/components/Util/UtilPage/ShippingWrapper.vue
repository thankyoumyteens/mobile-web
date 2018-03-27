<template>
  <transition name="user-info-move">
    <div class="shipping-wrapper" v-if="user!==null" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">收货地址</span>
        <a class="login-link" @click="showEditor(null)">新增</a>
      </header>
      <split></split>
      <div class="shipping-list-wrapper" ref="shippingListWrapper">
        <div>
          <div class="shipping-list-item" v-for="item in shippingList">
            <div class="sli-line sli-top">
              <div class="sli-item">{{item['receiverName']}}</div>
              <div class="sli-item">{{item['receiverMobile']}}</div>
            </div>
            <div class="sli-line">
              <div class="sli-item">
                {{item['receiverProvince']}}
                {{item['receiverCity']}}
                {{item['receiverDistrict']}}
                {{item['receiverAddress']}}
                {{item['receiverZip']}}
              </div>
            </div>
            <div class="sli-line flex-line">
              <!--<div class="sli-item flex-item">默认地址</div>-->
              <div class="sli-item flex-item" @click="showEditor(item)">编辑</div>
              <div @click="deleteShipping(item['id'])" class="sli-item flex-item">删除</div>
            </div>
            <split></split>
          </div>
        </div>
      </div>
      <edit ref="shippingEditor" @success="getShippingList"></edit>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/Util/Split/Split'
  import edit from '@/components/Util/UtilPage/EditShippingWrapper'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      edit
    },
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        scrollShippingList: null,
        isShow: false,
        shippingList: []
      }
    },
    watch: {
      'user' () {
        this.getShippingList()
        this.initScroll()
      }
    },
    methods: {
      showEditor (shipping) {
        this.$refs.shippingEditor.show(shipping)
      },
      deleteShipping (shippingId) {
        this.$http.get(path()['deleteShipping'] + '?shippingId=' + shippingId).then(response => {
          let res = response.body
          console.log(res)
          if (res['status'] === 0) {
            console.log(res['msg'])
            this.getShippingList()
          } else {
            console.log(res['msg'])
          }
        })
      },
      initScroll () {
        this.$nextTick(() => {
          if (!this.scrollShippingList) {
            this.scrollShippingList = new BetterScroll(this.$refs.shippingListWrapper, {
              click: true
            })
          } else {
            this.scrollShippingList.refresh()
          }
        })
      },
      show () {
        this.isShow = true
        this.getShippingList()
        this.initScroll()
      },
      hide () {
        this.isShow = false
      },
      getShippingList () {
        if (this.user !== null && this.user !== undefined) {
          this.$http.get(path()['shippingList']).then(response => {
            let res = response.body
            console.log(res)
            if (res['status'] === 0) {
              let data = res['data']
              this.shippingList = data
              this.initScroll()
              console.log(this.shippingList)
            } else {
              console.log(res['msg'])
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
  .user-info-move-enter-active
    animation bounce-in .2s linear
  .user-info-move-leave-active
    animation bounce-out .2s linear
  .shipping-wrapper
    position fixed
    top 0
    left 0
    bottom 0
    z-index 999999
    width 100%
    background #fff
    box-sizing border-box
    header
      width 100%
      height 3em
      line-height 3em
      background #fff
      position relative
      text-align center
      color #000
      .close
        position absolute
        left 10px
        top 0
        height 3em
        line-height 3em
        width 3em
      .title
        display inline-block
        height 3em
        line-height 3em
      .login-link
        float right
        margin-right 1em
    .shipping-list-wrapper
      width 100%
      position absolute
      top 4.1em
      bottom 0
      overflow hidden
      .shipping-list-item
        height 10em
        .sli-line
          width 100%
          margin-top 1em
          margin-bottom 1em
          &.sli-top
            font-weight bold
          &.flex-line
            display flex
            margin 0
            height 2em
            line-height 2em
          .sli-item
            display inline
            &.flex-item
              border-top 0.1em solid #ccc
              flex 1
              height 2em
              line-height 2em
              text-align center
</style>
