<template>
  <transition name="production-move">
    <div class="production" v-show="productionShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <section class="production-detail scroll-wrapper" ref="scrollWrapperProduction">
        <div>
          <div class="production-info" v-if="productionDetail != null">
            <div class="production-nav">
              <div class="production-nav-item border-1px" @click="changeTab(0)" :class="[currentProductionNavIndex==0?'active':'']">商品</div>
              <div class="production-nav-item border-1px" @click="changeTab(1)" :class="[currentProductionNavIndex==1?'active':'']">详情</div>
              <div class="production-nav-item border-1px" @click="changeTab(2)" :class="[currentProductionNavIndex==2?'active':'']">评价</div>
            </div>
            <!--商品-->
            <section class="production-home" v-show="currentProductionNavIndex==0">
              <div class="ph-image-show">
                <!--废弃-->
                <!--<div class="ph-image-wrapper border-1px"-->
                     <!--@touchstart='touchStartImage' @touchmove='touchMoveImage' @touchend='touchEndImage'>-->
                  <!--<img class="ph-img" :src="item" alt="" v-for="item,index in productionDetail['production']['images']">-->
                <!--</div>-->
                <!--<div class="ph-image-index">{{currentImageIndex+1}}/{{productionDetail['production']['images'].length}}</div>-->
                <!-- 配置slider组件 -->
                <slider :pages="pages" :sliderinit="sliderinit" @slide='slide' @tap='onTap' @init='onInit'>
                  <!-- 设置loading,可自定义 -->
                  <div slot="loading">加载中...</div>
                </slider>
              </div>
              <div class="ph-name">
                {{productionDetail['production']['name']}}
              </div>
              <div class="ph-remark">
                {{productionDetail['production']['remark']}}
              </div>
              <div class="ph-price">
                ￥{{productionDetail['production']['price']}}
              </div>
              <split></split>
              <div class="ph-select" @click="showSelect">
                {{selection}}
              </div>
              <split></split>
            </section>
            <!--详情-->
            <section class="production-more" v-show="currentProductionNavIndex==1">
              <div class="pm-content" v-html="productionDetail['detail']['html']"></div>
            </section>
            <!--评价-->
            <section class="production-review" v-show="currentProductionNavIndex==2">
              <div class="pr-top">
                <div class="pr-top-percent border-1px">
                  好评率: {{productionDetail['review']['percent']}}
                </div>
                <div class="pr-top-star">
                  <div class="pr-top-star-item" @click="changeStar(1)" :class="[currentStar==1?'active-item':'']">
                    全部 {{productionDetail['review']['count']}}
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(2)" :class="[currentStar==2?'active-item':'']">
                    好评 {{productionDetail['review']['star5']}}
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(3)" :class="[currentStar==3?'active-item':'']">
                    中评 {{productionDetail['review']['star3']}}
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(4)" :class="[currentStar==4?'active-item':'']">
                    差评 {{productionDetail['review']['star1']}}
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(5)" :class="[currentStar==5?'active-item':'']">
                    有图 {{productionDetail['review']['img']}}
                  </div>
                </div>
              </div>
              <split></split>
              <div class="pr-list">
                <div>
                  <div class="pr-item" v-for="item in reviewList">
                    <div class="pr-item-top">
                      <div class="pr-item-top-author">
                        {{item['author']['name']}}
                      </div>
                      <div class="pr-item-top-date">
                        {{item['date']}}
                      </div>
                      <star class="star-comp" :size="36" :score="item['star']"></star>
                    </div>
                    <div class="pr-item-text clear-float">
                      {{item['content']['text']}}
                    </div>
                    <div class="pr-item-img" v-if="item['content']['hasImage']=='1'">
                      <div class="pr-item-img-item" v-for="link in item['content']['imgList']">
                        <img :src="link" alt="">
                      </div>
                    </div>
                    <div class="pr-item-type">
                      {{item['productionType']}}
                    </div>
                    <div class="pr-item-order">
                      购买日期: {{item['orderDate']}}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="production-info" v-if="productionDetail == null">
              加载失败
          </div>
        </div>
      </section>
      <div class="ph-buttons">
        <button class="ph-button ph-add-cart" @click="showSelect">加入购物车</button>
      </div>
      <selecttype ref="selecttype" @selected="selectType" @cart="addToCart"></selecttype>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import star from '@/components/Util/Star/Star'
  import split from '@/components/Util/Split/Split'
  import selecttype from '@/components/Util/SelectType/SelectType'
  import BetterScroll from 'better-scroll'
  import slider from 'vue-concise-slider'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      slider,
      split,
      star,
      selecttype
    },
    props: {
      productionSimple: {
        type: Object
      }
    },
    watch: {
      'productionSimple' () {
        this.getProduction()
        this.initScroll()
        // 更换商品时重置初始参数
        this.touchImage = {}
        this.currentImageIndex = 0
        this.currentProductionNavIndex = 0
        this.currentStar = 1
        this.selection = '请选择版本'
        this.selectedType = null
      }
    },
    updated () {
      // 废弃
      // // todo bug第二次打开图片纵向排列 解决: v-show + 重置初始参数
      // // 商品展示图定位
      // if (this.touchImage['width']) return
      // let el = document.getElementsByClassName('ph-image-wrapper')[0]
      // if (el) {
      //   if (this.productionDetail) {
      //     let width = el.offsetWidth
      //     let height = el.offsetHeight
      //     el.style.width = (width * this.productionDetail['production']['images'].length) + 'px'
      //     let imgs = document.getElementsByClassName('ph-img')
      //     let imgWidth = height
      //     let remain = width - imgWidth
      //     let margin = remain / 2
      //     for (let i = 0; i < imgs.length; i++) {
      //       imgs[i].style.width = imgWidth + 'px'
      //       imgs[i].style.marginLeft = margin + 'px'
      //       imgs[i].style.marginRight = margin + 'px'
      //     }
      //     this.touchImage['width'] = width
      //   }
      // }
    },
    data () {
      return {
        currentStar: 1, // 查看评论类型(有图/好评/中评/差评)
        selection: '请选择版本',
        touchImage: {},
        currentImageIndex: 0,
        currentProductionNavIndex: 0,
        scrollProduction: null,
        productionDetail: null,
        productionShow: false,
        selectedType: null, // 存储选择的商品参数
        // slider组件数据
        pages: [],
        // slider组件参数
        sliderinit: {
          currentPage: 0,
          thresholdDistance: 100,
          thresholdTime: 1000,
          loop: true,
          direction: 'horizontal',
          infinite: 1,
          slidesToScroll: 1
        }
      }
    },
    computed: {
      /**
       * 根据评星筛选评论
       */
      'reviewList' () {
        let list = []
        switch (this.currentStar) {
          case 1: // 全部
            list = this.productionDetail['review']['list']
            break
          case 2: // 好评
            for (let i = 0; i < this.productionDetail['review']['list'].length; i++) {
              let item = this.productionDetail['review']['list'][i]
              if (item['star'] >= 4) {
                list.push(item)
              }
            }
            break
          case 3: // 中评
            for (let i = 0; i < this.productionDetail['review']['list'].length; i++) {
              let item = this.productionDetail['review']['list'][i]
              if (item['star'] === 3) {
                list.push(item)
              }
            }
            break
          case 4: // 差评
            for (let i = 0; i < this.productionDetail['review']['list'].length; i++) {
              let item = this.productionDetail['review']['list'][i]
              if (item['star'] <= 2) {
                list.push(item)
              }
            }
            break
          case 5: // 有图
            for (let i = 0; i < this.productionDetail['review']['list'].length; i++) {
              let item = this.productionDetail['review']['list'][i]
              if (item['content']['hasImage'] === '1') {
                list.push(item)
              }
            }
            break
          default:
            break
        }
        return list
      }
    },
    methods: {
      /**
       * slider组件事件
       */
      slide (data) {
        console.log(data)
      },
      onTap (data) {
        console.log(data)
      },
      onInit (data) {
        console.log(data)
      },
      /**
       * 筛选评论
       */
      changeStar (id) {
        this.currentStar = id
        this.initScroll()
      },
      /**
       * 添加商品到购物车
       */
      addToCart (type) {
        let cartItem = this.productionDetail['production']
        cartItem['type'] = type
        this.$emit('tocart', cartItem)
      },
      selectType (type) {
        this.selectedType = type
        let text = ''
        for (let i = 0; i < type.length; i++) {
          let value = type[i]['item']['name']
          text += '[' + value + ']'
        }
        this.selection = text
      },
      /**
       * 选择商品参数
       */
      showSelect () {
        this.$refs.selecttype.show(this.productionDetail['production'], this.selectedType)
      },
      /**
       * 滑动图片切换到下一张 废弃
       * @param e
       */
      touchStartImage (e) {
        e = e || event
        // tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        if (e.touches.length === 1) {
          // 记录开始位置
          this.touchImage['startX'] = e.touches[0].clientX
          console.log(this.touchImage)
        }
      },
      /**
       * 滑动图片切换到下一张 废弃
       * @param e
       */
      touchMoveImage (e) {
        // todo 改善滑动效果
        e = e || event
        if (e.touches.length === 1) {
          let moveX = e.touches[0].clientX
          let el = document.getElementsByClassName('ph-image-wrapper')[0]
          let offsetX = moveX * 0.02
          if (moveX > this.touchImage['startX']) {
            console.log('r ->' + el.offsetLeft)
            if (el.offsetLeft >= 0) return
            // 右滑
            let left = el.offsetLeft + offsetX
            el.style.left = left + 'px'
          }
          if (moveX < this.touchImage['startX']) {
            console.log('l ->' + el.offsetLeft)
            console.log(-((this.productionDetail['production']['images'].length - 1) * this.touchImage['width']))
            if (el.offsetLeft <= -((this.productionDetail['production']['images'].length - 1) * this.touchImage['width'])) return
            // 左滑
            let left = el.offsetLeft - offsetX
            el.style.left = left + 'px'
          }
        }
      },
      /**
       * 滑动图片切换到下一张 废弃
       * @param e
       */
      touchEndImage (e) {
        e = e || event
        if (e.changedTouches.length === 1) {
          let endX = e.changedTouches[0].clientX
          let disX = this.touchImage['startX'] - endX
          console.log('滑动距离 ->' + disX)
          let el = document.getElementsByClassName('ph-image-wrapper')[0]
          if (disX > 100) {
            // 右滑
            if (this.currentImageIndex >= this.productionDetail['production']['images'].length - 1) {
              this.currentImageIndex = 0
              el.style.left = 0 + 'px'
              return
            }
            this.currentImageIndex++
            let left = -this.currentImageIndex * this.touchImage['width']
            el.style.left = left + 'px'
          }
          if (disX < -100) {
            // 左滑
            if (this.currentImageIndex <= 0) {
              this.currentImageIndex = this.productionDetail['production']['images'].length - 1
              el.style.left = -(this.currentImageIndex * this.touchImage['width']) + 'px'
              return
            }
            this.currentImageIndex--
            let left = -this.currentImageIndex * this.touchImage['width']
            el.style.left = left + 'px'
          }
        }
      },
      /**
       * 切换商品/详情/评论
       * @param index
       */
      changeTab (index) {
        this.currentProductionNavIndex = index
        this.initScroll()
      },
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
      /**
       * 获取商品信息
       */
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
            // slider组件数据
            for (let i = 0; i < this.productionDetail['production']['images'].length; i++) {
              let img = this.productionDetail['production']['images'][i]
              let item = {
                html: '<div class="ph-img-wp"><img class="ph-img" src="' + img + '"></div>',
                style: {
                  'background': '#fff',
                  'width': '100%'
                }
              }
              Vue.set(this.pages, i, item)
            }
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
    .ph-img-wp
      width 100%
      font-size 14px
      height 15em
    .ph-img
      height 100%
    .close
      margin-top 0.9em
      margin-left 0.5em
      float left
    .production-detail
      position fixed
      z-index -1
      top 0
      left 0
      bottom 4em
      right 0
      overflow hidden
      .production-info
        height 100%
        .production-nav
          width 100%
          height 3em
          display flex
          .production-nav-item
            box-sizing border-box
            border-1px(#ccc)
            flex 1
            float left
            line-height 3em
            text-align center
            &.active
              color #e31d1a
        .production-home
          height 100%
          .ph-image-show
            /*position relative*/
            width 100%
            overflow hidden
            height 15em
            .ph-image-wrapper
              position absolute
              left 0
              top 0
              height 100%
              text-align center
              box-sizing border-box
              border-1px(#ccc)
              img
                float left
                height 100%
            .ph-image-index
              position absolute
              right 1em
              bottom 1em
          .ph-name
            width 95%
            margin 0.5em auto
          .ph-remark
            width 95%
            color #e31d1a
            margin 0.5em auto
            font-size 0.9em
          .ph-price
            width 95%
            color #e31d1a
            margin 0.5em auto
            font-size 1.7em
            font-weight bold
          .ph-select
            width 97%
            height 2.5em
            line-height 2.5em
            padding-left 3%
        .production-more
          width 100%
        .production-review
          width 100%
          .pr-top
            width 100%
            .pr-top-percent
              color #e31d1a
              text-align right
              width 80%
              padding 0 10%
              border-1px(#ccc)
            .pr-top-star
              width 100%
              .pr-top-star-item
                display inline-block
                margin 0.3em
                height 1.5em
                padding 0 0.3em
                line-height 1.5em
                border-radius 0.5em
                background #c35d7a
                &.active-item
                  background #e31d1a
                  color #fff
          .pr-list
            width 100%
            .pr-item
              width 100%
              .pr-item-top
                width 95%
                padding-left 5%
                .pr-item-top-author
                  float left
                  margin 0.3em
                .star-comp
                  clear left
                .pr-item-top-date
                  color #ccc
                  float right
                  margin 0.3em
              .pr-item-text
                width 80%
                padding-left 20%
              .pr-item-img
                width 80%
                padding-left 20%
                .pr-item-img-item
                  height 5em
                  margin 0.3em
                  display inline-block
                  img
                    height 100%
              .pr-item-type
                width 80%
                padding-left 20%
                color #ccc
              .pr-item-order
                width 80%
                padding-left 20%
                color #ccc
    .ph-buttons
      position fixed
      bottom 0
      left 0
      width 100%
      height 4em
      .ph-button
        height 100%
        color #fff
        background #e31d1a
        outline none
        border 0
      .ph-add-cart
        width 100%
</style>
