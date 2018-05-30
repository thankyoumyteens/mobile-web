<template>
  <transition name="user-info-move">
    <div class="edit-shipping-wrapper" v-show="isShow">
      <v-header titleText="收货信息" actionText="完成" @back="hide" @action="doUpdateShipping"></v-header>
      <div class="si-content">
        <wv-group title="收货信息">
          <wv-input label="收货人" placeholder="请输入内容" v-model="receiverName"></wv-input>
          <wv-input label="电话" placeholder="请输入电话" v-model="receiverMobile" type="number"></wv-input>
          <wv-input label="收货地址" v-model="msg" :readonly="true">
            <button class="weui-vcode-btn" @click="showShippingSelectAddress" slot="ft">选择收货地址</button>
          </wv-input>
          <wv-input label="详细地址" placeholder="请输入详细地址" v-model="receiverAddress"></wv-input>
          <wv-input label="邮编" placeholder="请输入邮编" v-model="receiverZip" type="number"></wv-input>
        </wv-group>
      </div>
      <select-address ref="saWrapper" @success="fillAddress"></select-address>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import SelectAddress from '@/components/Util/UtilPage/SelectAddress'
  import Split from '@/components/Util/Split/Split'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'

  export default {
    components: {
      Split,
      SelectAddress,
      VHeader
    },
    data() {
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
      fillAddress(address) {
        this.address = address
        this.msg = address[0] + ' ' + address[1] + ' ' + address[2]
      },
      showShippingSelectAddress() {
        this.$refs.saWrapper.show()
      },
      doUpdateShipping() {
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
          if (res['status'] === ResponseCode.SUCCESS) {
            this.$emit('success', res['data'])
            this.hide()
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      show(shipping) {
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
      hide() {
        this.isShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
</style>
