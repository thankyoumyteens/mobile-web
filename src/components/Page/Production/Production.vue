<template>
  <transition name="production-move">
    <div class="production" v-show="productionShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <section class="production-detail scroll-wrapper" ref="scrollWrapperProduction">
        <div>
          <div class="production" @click="showDetail(production)" v-if="productionDetail != null">
            加载成功
          </div>
          <div class="production" v-if="productionDetail == null">
              加载失败
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
//  import Vue from 'vue'
  import BetterScroll from 'better-scroll'
  import {
    path
  } from '@/commons/address.js'

  export default {
    props: {
      productionSimple: {
        type: Object
      }
    },
    watch: {
      'productionSimple' () {
        this.getProduction()
        this.initScroll()
      }
    },
    data () {
      return {
        scrollProduction: null,
        productionDetail: null,
        productionShow: false
      }
    },
    methods: {
      initScroll () {
        this.$nextTick(() => {
          if (!this.scrollProduction) {
            this.scrollProduction = new BetterScroll(this.$refs.scrollWrapperProduction, {
              click: true
            })
          } else {
            this.scrollProduction.refresh()
          }
        })
      },
      show () {
        this.productionShow = true
      },
      hide () {
        this.productionShow = false
      },
      getProduction () {
        let productionId = this.productionSimple['id']
        let url = path()['productionDetail'] + '?id=' + productionId
        this.$http.get(url).then((response) => {
          let status = response.body['status']
          let message = response.body['message']
          let data = response.body['data']
          this.productionDetail = null
          if (status === 200) {
            this.productionDetail = data
            this.initScroll()
          } else {
            console.log(message)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

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
  .production-move-enter-active
    animation bounce-in .2s linear
  .production-move-leave-active
    animation bounce-out .2s linear
  .production
    position fixed
    top 0
    left 0
    bottom 0
    z-index 99999
    width 100%
    background #fff
    box-sizing border-box
    .close
      margin-top 0.3em
      margin-right 0.5em
      float left
    .production-detail
      position fixed
      z-index -1
      top 5em
      left 0
      bottom 0
      right 0
</style>
