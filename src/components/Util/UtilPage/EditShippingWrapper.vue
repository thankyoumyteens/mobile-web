<template>
  <transition name="user-info-move">
    <div class="edit-shipping-wrapper" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">编辑</span>
        <a class="login-link" @click="doUpdateShipping">完成</a>
      </header>
      <split></split>
      <div class="si-content">
        <div class="si-label">
          <div class="sil-title">收货人: </div>
          <input type="text" class="si-input" ref="shippingReceiverName" :value="(shipping?shipping['receiverName']:'')">
        </div>
        <div class="si-label">
          <div class="sil-title">电话: </div>
          <input type="text" class="si-input" ref="shippingReceiverMobile" :value="(shipping?shipping['receiverMobile']:'')">
        </div>
        <div class="si-label">
          <div class="sil-title">地址: </div>
          <div @click="showShippingSelectAddress">{{msg}}</div>
        </div>
        <div class="si-label">
          <div class="sil-title">详细地址: </div>
          <input type="text" class="si-input" ref="shippingReceiverAddress" :value="(shipping?shipping['receiverAddress']:'')">
        </div>
        <div class="si-label">
          <div class="sil-title">邮编: </div>
          <input type="text" class="si-input" ref="shippingReceiverZip" :value="(shipping?shipping['receiverZip']:'')">
        </div>
      </div>
      <sa ref="saWrapper" @success="fillAddress"></sa>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import sa from '@/components/Util/UtilPage/SelectAddress'
  import split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      sa
    },
    data () {
      return {
        isShow: false,
        shipping: null,
        regionList: [],
        address: null,
        msg: '选择地址'
      }
    },
    methods: {
      fillAddress (address) {
        this.address = address
        this.msg = address['p'] + ' ' + address['c'] + ' ' + address['d']
      },
      showShippingSelectAddress () {
        this.$refs.saWrapper.show()
      },
      doUpdateShipping () {
        console.log(this.shipping)
        let receiverName = this.$refs.shippingReceiverName.value
        let receiverMobile = this.$refs.shippingReceiverMobile.value
        let receiverAddress = this.$refs.shippingReceiverAddress.value
        let receiverZip = this.$refs.shippingReceiverZip.value

        let receiverProvince = this.address['p']
        let receiverCity = this.address['c']
        let receiverDistrict = this.address['d']
        // if (!(/^1[34578]\d{9}$/.test(phone))) {
        //   alert('手机号码有误，请重填')
        //   return false
        // }
        this.$http.post(path()[this.shipping ? 'updateShipping' : 'addShipping'], {
          'id': this.shipping ? this.shipping['id'] : '',
          'receiverName': receiverName,
          'receiverMobile': receiverMobile,
          'receiverProvince': receiverProvince,
          'receiverCity': receiverCity,
          'receiverDistrict': receiverDistrict,
          'receiverAddress': receiverAddress,
          'receiverZip': receiverZip
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            this.$emit('success', res['data'])
            this.hide()
          } else {
            console.log(res['msg'])
          }
        })
      },
      show (shipping) {
        this.isShow = true
        this.shipping = shipping
      },
      hide () {
        this.isShow = false
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
  .edit-shipping-wrapper
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
    .si-content
      .si-label
        display block
        width 95%
        height 3em
        line-height 3em
        margin 1em auto
        padding-left 0.9em
        box-sizing border-box
        .sil-title
          float left
          width 20%
          line-height 3em
        .sil-text
          float left
          margin-left 1em
          line-height 3em
        .si-input
          margin-left 1em
          width 50%
          height 3em
          line-height 3em
          border 0.1em solid #ccc
          border-radius 5px
          padding-left 1em
          box-sizing border-box
      .login-button
        color #fff
        background rgba(240, 20, 20, 0.9)
        &:active
          background rgba(240, 20, 20, 0.8)
        &.disable
          color #ccc
          background rgba(240, 20, 20, 0.7)
</style>
