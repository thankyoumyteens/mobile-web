<template>
  <transition name="production-move">
    <div class="production" v-show="productionShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <div class="loading" v-if="currentProductionNavIndex===0&&!productionDetail">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <div class="loading" v-if="currentProductionNavIndex===2&&commentList.length<=0">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <section class="production-detail scroll-wrapper" ref="scrollWrapperProduction">
        <div>
          <div class="production-info">
            <div class="production-nav">
              <div class="production-nav-item border-1px" @click="changeTab(0)"
                   :class="[currentProductionNavIndex==0?'active':'']">商品
              </div>
              <div class="production-nav-item border-1px" @click="changeTab(1)"
                   :class="[currentProductionNavIndex==1?'active':'']">详情
              </div>
              <div class="production-nav-item border-1px" @click="changeTab(2)"
                   :class="[currentProductionNavIndex==2?'active':'']">评价
              </div>
            </div>
            <!--商品-->
            <section class="production-home" v-if="productionDetail" v-show="currentProductionNavIndex===0">
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
                {{productionDetail['name']}}
              </div>
              <div class="ph-remark">
                {{productionDetail['subtitle']}}
              </div>
              <div class="ph-price">
                ￥{{productionDetail['price']}}
              </div>
              <split></split>
              <div class="ph-select" @click="showSelect">
                {{selection}}
              </div>
              <split></split>
            </section>
            <!--详情-->
            <section class="production-more" v-if="false" v-show="currentProductionNavIndex===1">
              <div class="pm-content" v-html="productionDetail['detail']['html']"></div>
            </section>
            <!--评价-->
            <section class="production-review" v-if="commentList.length > 0" v-show="currentProductionNavIndex===2">
              <div class="pr-top">
                <!--<div class="pr-top-percent border-1px">-->
                <!--好评率:-->
                <!--</div>-->
                <div class="pr-top-star">
                  <div class="pr-top-star-item" @click="changeStar(1)" :class="[currentStar==1?'active-item':'']">
                    全部
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(2)" :class="[currentStar==2?'active-item':'']">
                    好评
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(3)" :class="[currentStar==3?'active-item':'']">
                    中评
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(4)" :class="[currentStar==4?'active-item':'']">
                    差评
                  </div>
                  <div class="pr-top-star-item" @click="changeStar(5)" :class="[currentStar==5?'active-item':'']">
                    有图
                  </div>
                </div>
              </div>
              <split></split>
              <div class="pr-list">
                <div>
                  <div class="pr-item" v-for="item in commentList">
                    <div class="pr-item-top">
                      <div class="pr-item-top-author">
                        {{item['author']['nickname']}}
                      </div>
                      <div class="pr-item-top-date">
                        {{item['createTime']}}
                      </div>
                      <star class="star-comp" :size="36" :score="item['star']"></star>
                    </div>
                    <div class="pr-item-text clear-float">
                      {{item['text']}}
                    </div>
                    <div class="pr-item-img" v-if="item['images'].length">
                      <div class="pr-item-img-item" v-for="link in item['images']">
                        <img :src="link" alt="">
                      </div>
                    </div>
                    <div class="pr-item-type">
                      版本: {{item['properties']}}
                    </div>
                    <div class="pr-item-order">
                      购买日期: {{item['orderCreateTime']}}
                    </div>
                    <splits></splits>
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
  import splits from '@/components/Util/Split/SplitSmall'
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
      splits,
      star,
      selecttype
    },
    props: {
      productionSimple: {
        type: Object
      }
    },
    watch: {
      'productionSimple'() {
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
    data() {
      return {
        currentStar: 1, // 查看评论类型(有图/好评/中评/差评)
        selection: '请选择版本',
        touchImage: {},
        currentImageIndex: 0,
        currentProductionNavIndex: 0,
        scrollProduction: null,
        productionDetail: null,
        commentList: [],
        pageNum: 1, // todo 评论分页
        pageSize: 10,
        pageCount: 1,
        hasNextPage: false,
        productionShow: false,
        selectedType: null, // 存储选择的商品参数
        selectedPropertiesId: -1,
        isVisited: false,
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
    methods: {
      /**
       * slider组件事件
       */
      slide(data) {
        // console.log(data)
      },
      onTap(data) {
        // console.log(data)
      },
      onInit(data) {
        // console.log(data)
      },
      /**
       * 筛选评论
       */
      changeStar(id) {
        this.currentStar = id
        let url = path()['commentListLevel']
        switch (id) {
          case 2:
            // 好评
            url += '?goodsId=' +
              this.productionDetail['goodsId'] +
              '&level=1' +
              '&pageNum=' + this.pageNum
            break
          case 3:
            // 中评
            url += '?goodsId=' +
              this.productionDetail['goodsId'] +
              '&level=2' +
              '&pageNum=' + this.pageNum
            break
          case 4:
            // 差评
            url += '?goodsId=' +
              this.productionDetail['goodsId'] +
              '&level=3' +
              '&pageNum=' + this.pageNum
            break
          case 5:
            // 有图
            url = path()['commentListImg'] + '?goodsId=' +
              this.productionDetail['goodsId'] +
              '&pageNum=' + this.pageNum
            break
          default:
            url = null
            break
        }
        this.getCommentList(url)
        this.initScroll()
      },
      /**
       * 添加商品到购物车
       */
      addToCart(product) {
        this.selectType(product)
        let cartInfo = {
          propertiesId: product['propertiesId'],
          goodsId: this.productionDetail['goodsId']
        }
        this.$emit('tocart', cartInfo)
      },
      /**
       * 记录选中的参数
       */
      selectType(product) {
        this.selectedPropertiesId = product['propertiesId']
        let text = ''
        for (let key in product['text']) {
          let val = product['text'][key]
          text += val + ' '
        }
        this.selection = (text === '' ? '请选择版本' : text)
        this.productionDetail['price'] = product['price']
      },
      /**
       * 显示商品参数选择对话框
       */
      showSelect() {
        this.$refs.selecttype.show(this.propertiesList, this.isVisited)
        this.isVisited = true
      },
      /**
       * 切换商品/详情/评论
       * @param index
       */
      changeTab(index) {
        this.currentProductionNavIndex = index
        if (index === 2) {
          // 获取评论
          this.getCommentList()
        }
        this.initScroll()
      },
      initScroll() {
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
      show() {
        this.productionShow = true
      },
      hide() {
        this.productionShow = false
      },
      /**
       * 获取商品信息
       */
      getProduction() {
        this.isVisited = false
        let productId = this.productionSimple['goodsId']
        let url = path()['productionDetail'] + '?goodsId=' + productId
        this.$http.get(url).then((response) => {
          let status = response.body['status']
          this.productionDetail = null
          if (status === 0) {
            let data = response.body['data']
            this.propertiesList = data['propertiesList']
            this.productionDetail = data
            this.initScroll()
            // slider组件数据
            let imgList = this.productionDetail['subImages'].split(',')
            for (let i = 0; i < imgList.length; i++) {
              let img = imgList[i]
              let item = {
                html: '<div class="ph-img-wp"><img class="ph-img" src="' + img + '"></div>',
                style: {
                  'background': '#fff',
                  'width': '100%'
                }
              }
              Vue.set(this.pages, i, item)
            }
            for (let i = 0; i < this.propertiesList.length; i++) {
              let properties = this.propertiesList[i]
              properties['text'] = JSON.parse(properties['text'])
            }
            this.productionDetail['price'] = this.propertiesList[0]['price']
            this.selectType(this.propertiesList[0])
          } else {
            let msg = response.body['msg']
            console.log(msg)
          }
        })
      },
      /**
       * 评论列表
       */
      getCommentList(url) {
        if (!url) {
          url = path()['commentList'] + '?goodsId=' +
            this.productionDetail['goodsId'] + '&pageNum=' + this.pageNum
        }
        // todo 分页
        this.$http.get(url).then((response) => {
          let status = response.body['status']
          if (status === 0) {
            let data = response.body['data']
            this.commentList = data['list']
            for (let index in this.commentList) {
              let comment = this.commentList[index]
              if (comment['images']) {
                comment['images'] = comment['images'].split(',')
              } else {
                comment['images'] = []
              }
            }
            this.initScroll()
          } else {
            let msg = response.body['msg']
            console.log(msg)
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
    z-index 998
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
                width 90%
                padding 0 5%
              .pr-item-img
                width 90%
                padding 0 5%
                .pr-item-img-item
                  height 5em
                  margin 0.3em
                  display inline-block
                  img
                    height 100%
              .pr-item-type
                padding 0 5%
                color #ccc
                font-size 0.8em
                display inline-block
              .pr-item-order
                padding 0 5%
                color #ccc
                font-size 0.8em
                display inline-block
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
