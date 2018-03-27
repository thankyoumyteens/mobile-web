<template>
  <transition name="user-info-move">
    <div class="select-address" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">选择地址</span>
        <a class="login-link" @click="doReset">确定</a>
      </header>
      <split></split>
      <div class="si-content">
        <div class="si-label">
          <div class="sil-title">省: </div>
          <select @change="selectP" ref="shippingRegionP" class="si-input">
            <option selected>请选择</option>
            <option v-for="item,index in regionListP" :value="index">{{item['regionName']}}</option>
          </select>
        </div>
        <div class="si-label">
          <div class="sil-title">市: </div>
          <select @change="selectC" ref="shippingRegionC" class="si-input">
            <option selected>请选择</option>
            <option v-for="item,index in regionListC" :value="index">{{item['regionName']}}</option>
          </select>
        </div>
        <div class="si-label">
          <div class="sil-title">区: </div>
          <select @change="selectD" ref="shippingRegionD" class="si-input">
            <option selected>请选择</option>
            <option v-for="item,index in regionListD" :value="index">{{item['regionName']}}</option>
          </select>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split
    },
    data () {
      return {
        isShow: false,
        regionListP: [],
        regionListC: [],
        regionListD: [],
        regionType: 'province'
      }
    },
    methods: {
      doReset () {
        let province = this.regionListP[this.$refs.shippingRegionP.value]
        let city = this.regionListC[this.$refs.shippingRegionC.value]
        let district = this.regionListD[this.$refs.shippingRegionD.value]
        let address = {
          'p': province['regionName'],
          'c': city['regionName'],
          'd': district['regionName']
        }
        this.$emit('success', address)
        this.hide()
      },
      selectP () {
        console.log(this.$refs.shippingRegionP.value)
        let province = this.regionListP[this.$refs.shippingRegionP.value]
        this.regionType = 'city'
        this.getRegionList(province['regionId'])
      },
      selectC () {
        console.log(this.$refs.shippingRegionC.value)
        let city = this.regionListC[this.$refs.shippingRegionC.value]
        console.log(city)
        this.regionType = 'district'
        this.getRegionList(city['regionId'])
      },
      selectD () {
        console.log(this.$refs.shippingRegionD.value)
        let district = this.regionListD[this.$refs.shippingRegionD.value]
      },
      show () {
        this.isShow = true
        this.getRegionList(1)
      },
      hide () {
        this.isShow = false
      },
      getRegionList (parentId) {
        this.$http.get(path()['region'] + '?parentId=' + parentId).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let data = res['data']
            console.log(data)
            if (data.length === 2) {
              if (data[0]['regionName'] === '市辖区') {
                this.getRegionList(data[0]['regionId'])
                return false
              }
            }
            switch (this.regionType) {
              case 'province':
                this.regionListP = data
                break
              case 'city':
                this.regionListC = data
                break
              case 'district':
                this.regionListD = data
                break
            }
          } else {
            console.log(res['msg'])
          }
        })
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
  .select-address
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
