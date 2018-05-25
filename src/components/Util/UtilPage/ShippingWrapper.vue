<template>
  <transition name="user-info-move">
    <div class="shipping-wrapper" v-if="user!==null" v-show="isShow">
      <v-header titleText="收货地址" actionText="新建" @back="hide" @action="showEditor"></v-header>
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
      <edit-shipping-wrapper ref="shippingEditor" @success="getShippingList"></edit-shipping-wrapper>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import EditShippingWrapper from '@/components/Util/UtilPage/EditShippingWrapper'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      Split,
      EditShippingWrapper,
      VHeader
    },
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        scrollShippingList: null,
        isShow: false,
        shippingList: []
      }
    },
    watch: {
      'user'() {
        this.getShippingList()
        this.initScroll()
      }
    },
    methods: {
      showEditor(shipping) {
        this.$refs.shippingEditor.show(shipping)
      },
      deleteShipping(shippingId) {
        this.$http.get(path()['deleteShipping'] + '?shippingId=' + shippingId).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
            this.getShippingList()
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      initScroll() {
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
      show() {
        this.isShow = true
        this.getShippingList()
        this.initScroll()
      },
      hide() {
        this.isShow = false
      },
      getShippingList() {
        if (this.user !== null && this.user !== undefined) {
          this.$http.get(path()['shippingList']).then(response => {
            let res = response.body
            if (res['status'] === 0) {
              let data = res['data']
              this.shippingList = data
              this.initScroll()
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
  @import "../../../commons/mixin.styl"

  .user-info-move-enter-active
    animation bounce-in .2s linear

  .user-info-move-leave-active
    animation bounce-out .2s linear

  .shipping-wrapper
    position fixed
    top 0
    left 0
    bottom 0
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
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
