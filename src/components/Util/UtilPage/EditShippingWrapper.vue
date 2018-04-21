<template>
  <transition name="user-info-move">
    <div class="edit-shipping-wrapper" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title"></span>
        <a class="login-link" @click="doUpdateShipping">完成</a>
      </header>
      <split></split>
      <div class="si-content">
        <wv-group title="收货信息">
          <wv-input label="收货人" placeholder="请输入内容" v-model="receiverName"></wv-input>
          <wv-input label="电话" placeholder="请输入电话" v-model="receiverMobile" type="number"></wv-input>
          <wv-input label="收货地址" v-model="msg" :readonly="true">
            <button class="weui-vcode-btn" @click="showShippingSelectAddress" slot="ft">选择收货地址</button >
          </wv-input>
          <wv-input label="详细地址" placeholder="请输入详细地址" v-model="receiverAddress"></wv-input>
          <wv-input label="邮编" placeholder="请输入邮编" v-model="receiverZip" type="number"></wv-input>
        </wv-group>
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
        msg: '',
        receiverName: '',
        receiverMobile: '',
        receiverAddress: '',
        receiverZip: ''
      }
    },
    methods: {
      fillAddress (address) {
        this.address = address
        this.msg = address[0] + ' ' + address[1] + ' ' + address[2]
      },
      showShippingSelectAddress () {
        this.$refs.saWrapper.show()
      },
      doUpdateShipping () {
        let receiverProvince = this.address[0]
        let receiverCity = this.address[1]
        let receiverDistrict = this.address[2]
        this.$http.post(path()[this.shipping ? 'updateShipping' : 'addShipping'], {
          'id': this.shipping ? this.shipping['id'] : '',
          'receiverName': this.receiverName,
          'receiverMobile': this.receiverMobile,
          'receiverProvince': receiverProvince,
          'receiverCity': receiverCity,
          'receiverDistrict': receiverDistrict,
          'receiverAddress': this.receiverAddress,
          'receiverZip': this.receiverZip
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
        if (shipping) {
          let address = [shipping['receiverProvince'], shipping['receiverCity'], shipping['receiverDistrict']]
          this.fillAddress(address)
          this.shipping = shipping
          this.receiverName = shipping['receiverName']
          this.receiverMobile = shipping['receiverMobile']
          this.receiverAddress = shipping['receiverAddress']
          this.receiverZip = shipping['receiverZip']
        } else {
          let address = ['', '', '']
          this.fillAddress(address)
          this.shipping = shipping
          this.receiverName = ''
          this.receiverMobile = ''
          this.receiverAddress = ''
          this.receiverZip = ''
        }
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
    z-index 999
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
        width 95%
        height 3em
        line-height 3em
        margin 1em auto
        padding-left 0.9em
        box-sizing border-box
        display flex
        .sil-title
          width 5em
          margin-right 1em
          line-height 3em
        .si-item
          flex 1
        .si-input
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
