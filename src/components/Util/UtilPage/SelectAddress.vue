<template>
  <transition name="user-info-move">
    <div class="select-address" v-show="isShow">
      <v-header titleText="选择收货地址" actionText="确定" @back="hide" @action="doReset"></v-header>
      <div class="si-content">
        <wv-group title="选择地址">
          <wv-cell title="请选择" is-link :value="address | pickerValueFilter" @click.native="addressPickerShow = true"/>
        </wv-group>
        <wv-picker
          :visible.sync="addressPickerShow"
          v-model="address"
          ref="addressPicker"
          :columns="addressColumns"
          :visible-item-count="5"
          @change="onAddressChange"
          @confirm="confirmAddress"
        />
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import chinaAreaData from 'china-area-data'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  const provinces = Object.values(chinaAreaData[86])
  // 获取某一省下的市
  const getCities = (province) => {
    let provinceCode
    for (let i in chinaAreaData[86]) {
      if (province === chinaAreaData[86][i]) {
        provinceCode = i
        break
      }
    }
    return typeof chinaAreaData[provinceCode] === 'object' ? Object.values(chinaAreaData[provinceCode]) : []
  }

  // 获取某一市下的区/县
  function getAreas(province, city) {
    let provinceCode, cityCode
    for (let i in chinaAreaData[86]) {
      if (province === chinaAreaData[86][i]) {
        provinceCode = i
        break
      }
    }
    for (let i in chinaAreaData[provinceCode]) {
      if (city === chinaAreaData[provinceCode][i]) {
        cityCode = i
        break
      }
    }
    if (chinaAreaData[cityCode]) {
      return typeof chinaAreaData[cityCode] === 'object' ? Object.values(chinaAreaData[cityCode]) : []
    } else {
      // 只有两级的情况
      return []
    }
  }

  export default {
    components: {
      Split,
      VHeader
    },
    data() {
      return {
        isShow: false,
        addressPickerShow: false,
        address: [],
        addressColumns: [
          {
            values: provinces
          },
          {
            values: getCities('湖北省')
          },
          {
            values: getAreas('湖北省', '宜昌市')
          }
        ]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.addressPicker.setValues(['湖北省', '宜昌市', '长阳土家族自治县'])
      })
    },
    filters: {
      pickerValueFilter(val) {
        if (Array.isArray(val)) {
          return val.toString()
        } else {
          return '请选择'
        }
      }
    },
    methods: {
      onAddressChange(picker, addressValues, slotIndex) {
        if (slotIndex === 0) {
          const cities = getCities(addressValues[0])
          picker.setColumnValues(1, cities)
          picker.setColumnValues(2, getAreas(addressValues[0], cities[0]))
        } else if (slotIndex === 1) {
          picker.setColumnValues(2, getAreas(addressValues[0], addressValues[1]))
        }
      },
      confirmAddress(picker) {
        this.address = picker.getValues()
        console.log(this.address)
      },
      doReset() {
        this.$emit('success', this.address)
        this.hide()
      },
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
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

  .select-address
    position fixed
    top 0
    left 0
    bottom 0
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
</style>
