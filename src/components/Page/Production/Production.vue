<template>
  <transition name="production-move">
    <section class="production" v-show="productionShow">
      <div class="close" @click="hide"><i class="el-icon-back"></i></div>
      <section class="production-detail">
        <div class="production-info">
          <!--顶部导航, 切换商品/详情/评论-->
          <div class="production-nav">
            <div class="production-nav-item border-1px"
                 @click="changeTab(Code.NAV_INDEX_GOODS)"
                 :class="[currentNavIndex===Code.NAV_INDEX_GOODS ? 'active' : '']">
              商品
            </div>
            <div class="production-nav-item border-1px"
                 @click="changeTab(Code.NAV_INDEX_DETAIL)"
                 :class="[currentNavIndex===Code.NAV_INDEX_DETAIL ? 'active' : '']">
              详情
            </div>
            <div class="production-nav-item border-1px"
                 @click="changeTab(Code.NAV_INDEX_COMMENT)"
                 :class="[currentNavIndex===Code.NAV_INDEX_COMMENT ? 'active' : '']">
              评价
            </div>
          </div>
          <div class="production-content scroll-wrapper"
               v-loading="(currentNavIndex === Code.NAV_INDEX_GOODS && !productionItem) ||
               (currentNavIndex === Code.NAV_INDEX_DETAIL && !goodsDesc) ||
               (currentNavIndex === Code.NAV_INDEX_COMMENT && isLoadingComment)"
               ref="scrollWrapperProduction">
            <div>
              <!--商品-->
              <section class="production-home"
                       v-if="productionItem"
                       v-show="currentNavIndex === Code.NAV_INDEX_GOODS">
                <div class="ph-image-show">
                  <!--商品图片-->
                  <slider :pages="pages" :sliderinit="sliderinit">
                    <!--设置loading,可自定义-->
                    <div slot="loading">加载中...</div>
                  </slider>
                  <!--添加收藏按钮-->
                  <div class="favorite-container" @click="addToFavorite">
                    <img class="favorite-button" src="./star.png" alt="收藏">
                    <span class="favorite-text">收藏</span>
                  </div>
                </div>
                <div class="ph-name">{{productionItem['name']}}</div>
                <div class="ph-remark">{{productionItem['subtitle']}}</div>
                <div class="ph-price">￥{{productionItem['price']}}</div>
                <split></split>
                <!--选择商品参数-->
                <div class="ph-select" @click="showSelect">{{selection}}</div>
                <split></split>
              </section>
              <!--详情-->
              <section class="production-more"
                       v-show="currentNavIndex === Code.NAV_INDEX_DETAIL">
                <div class="pm-content" v-if="goodsDesc" v-html="goodsDesc.text"></div>
              </section>
              <!--评价-->
              <section class="production-review"
                       v-show="currentNavIndex === Code.NAV_INDEX_COMMENT">
                <div class="pr-top">
                  <!--筛选评论-->
                  <div class="pr-top-star">
                    <div class="pr-top-star-item" @click="changeStar(Code.COMMENT_TYPE_ALL)"
                         :class="[currentCommentType === Code.COMMENT_TYPE_ALL ? 'active-item' : '']">
                      全部
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(Code.COMMENT_TYPE_GOOD)"
                         :class="[currentCommentType === Code.COMMENT_TYPE_GOOD ? 'active-item' : '']">
                      好评
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(Code.COMMENT_TYPE_NORMAL)"
                         :class="[currentCommentType === Code.COMMENT_TYPE_NORMAL ? 'active-item' : '']">
                      中评
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(Code.COMMENT_TYPE_BAD)"
                         :class="[currentCommentType === Code.COMMENT_TYPE_BAD ? 'active-item' : '']">
                      差评
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(Code.COMMENT_TYPE_IMAGE)"
                         :class="[currentCommentType === Code.COMMENT_TYPE_IMAGE ? 'active-item' : '']">
                      有图
                    </div>
                  </div>
                </div>
                <split></split>
                <!--评论列表-->
                <div class="pr-list" v-if="commentList.length > 0">
                  <div>
                    <div class="pr-item" v-for="item in commentList">
                      <div class="pr-item-top">
                        <div class="pr-item-top-author">{{item['author']['nickname']}}</div>
                        <div class="pr-item-top-date">{{item['createTime']}}</div>
                        <el-rate class="star-comp" disabled show-text text-color="#ff9900"
                                 v-model="item['star']" score-template="{value}">
                        </el-rate>
                      </div>
                      <!--评论文本-->
                      <div class="pr-item-text clear-float">{{item['text']}}</div>
                      <!--评论图片-->
                      <div class="pr-item-img" v-if="item['images'].length">
                        <div class="pr-item-img-item" v-for="link in item['images']">
                          <img :src="link" alt="">
                        </div>
                      </div>
                      <div class="pr-item-type">版本: {{item['properties']}}</div>
                      <div class="pr-item-order">购买日期: {{item['orderCreateTime']}}</div>
                      <split :size="0.5"></split>
                    </div>
                  </div>
                </div>
                <div class="next-page" @click="getMore" v-show="!isLoadingComment && commentList.length <= 0">暂无评论</div>
                <div class="next-page" @click="getMore" v-show="hasNextPage">点击加载更多</div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <div class="ph-buttons">
        <button class="ph-button ph-add-cart" @click="showSelect">加入购物车</button>
      </div>
      <select-type ref="selecttype" @selected="selectType" @cart="addToCart"></select-type>
    </section>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Split from '@/components/Util/Split/Split'
  import SelectType from '@/components/Util/SelectType/SelectType'
  import BetterScroll from 'better-scroll'
  import slider from 'vue-concise-slider'
  import {Dialog} from 'we-vue'
  import {path} from '@/commons/address'
  import {
    ResponseCode,
    FavoriteType,
    ComponentsConfigProduction
  } from '@/commons/config'

  export default {
    components: {
      slider,
      Split,
      SelectType
    },
    props: {
      goodsId: {
        type: Number
      }
    },
    watch: {
      'goodsId'() {
        this.getProduction()
        this.initScroll()
        // 更换商品时重置初始参数
        this.currentNavIndex = 0
        this.currentCommentType = 1
        this.selection = '请选择版本'
        this.selectedType = null
        this.commentUrl = null
      }
    },
    data() {
      return {
        Code: {},
        currentCommentType: 1, // 查看评论类型(有图/好评/中评/差评)
        selection: '请选择版本',
        currentNavIndex: 0, // 商品/详情/评论
        scrollProduction: null,
        productionItem: null, // 当前商品
        isLoadingComment: false, // 控制显示加载中的效果
        commentList: [], // 评论列表
        commentUrl: '', // 评论列表的请求地址
        isChanged: false, // 是否删选评论
        isNewPage: false, // 是不是新打开的商品页面
        pageNum: 1,
        pageSize: 10,
        hasNextPage: false,
        productionShow: false,
        selectedType: null, // 存储选择的商品参数
        goodsDesc: null,
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
    created() {
      this.Code = ComponentsConfigProduction
    },
    methods: {
      /**
       * 筛选评论
       */
      changeStar(commentType) {
        this.isChanged = true
        this.pageNum = 1
        this.currentCommentType = commentType
        this.commentUrl = path()['commentListLevel']
        switch (this.currentCommentType) {
          case this.Code.COMMENT_TYPE_ALL:
            this.commentUrl = null
            break
          case this.Code.COMMENT_TYPE_GOOD: // 好评
            this.commentUrl += '?goodsId=' + this.goodsId + '&level=1'
            break
          case this.Code.COMMENT_TYPE_NORMAL: // 中评
            this.commentUrl += '?goodsId=' + this.goodsId + '&level=2'
            break
          case this.Code.COMMENT_TYPE_BAD: // 差评
            this.commentUrl += '?goodsId=' + this.goodsId + '&level=3'
            break
          case this.Code.COMMENT_TYPE_IMAGE: // 有图
            this.commentUrl = path()['commentListImg'] + '?goodsId=' + this.goodsId
            break
          default:
            this.commentUrl = null
            break
        }
        this.getCommentList()
        this.initScroll()
      },
      /**
       * 添加商品到购物车
       */
      addToCart(product) {
        this.selectType(product)
        let cartInfo = {
          propertiesId: product['propertiesId'],
          goodsId: this.productionItem['goodsId']
        }
        this.$emit('tocart', cartInfo)
      },
      addToFavorite() {
        let goodsId = this.productionItem.goodsId
        this.$http.post(path()['addToFavorite'], {
          goodsId: goodsId,
          type: FavoriteType.GOODS
        }).then((response) => {
          let res = response.body
          if (res.status === ResponseCode.SUCCESS) {
            Dialog({
              title: '提示',
              message: '添加收藏成功',
              skin: 'ios'
            })
          } else {
            Dialog({
              title: '提示',
              message: res.msg,
              skin: 'ios'
            })
          }
        })
      },
      /**
       * 记录选中的参数
       */
      selectType(product) {
        if (!product) {
          this.selection = '请选择版本'
          this.productionItem['price'] = 0
          return false
        }
        // 显示选择的参数
        let text = ''
        let productText = product['text']
        if (productText) {
          for (let key in productText) {
            if (productText.hasOwnProperty(key)) {
              let val = productText[key]
              text += val + ' '
            }
          }
        }
        this.selection = (text === '' ? '请选择版本' : text)
        this.productionItem['price'] = product['price']
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
        this.currentNavIndex = index
        switch (this.currentNavIndex) {
          case this.Code.NAV_INDEX_GOODS:
            // 商品数据没有改变, 无需重新加载
            break
          case this.Code.NAV_INDEX_DETAIL:
            this.getDetail()
            break
          case this.Code.NAV_INDEX_COMMENT:
            if (this.isNewPage) {
              this.currentCommentType = this.Code.COMMENT_TYPE_ALL
            }
            this.getCommentList()
            break
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
        this.isNewPage = true
      },
      hide() {
        this.productionShow = false
      },
      /**
       * 获取商品信息
       */
      getProduction() {
        this.isVisited = false
        let productId = this.goodsId
        let url = path()['productionDetail'] + '?goodsId=' + productId
        this.$http.get(url).then((response) => {
          let status = response.body['status']
          this.productionItem = null
          if (status === ResponseCode.SUCCESS) {
            let data = response.body['data']
            this.propertiesList = data['propertiesList']
            this.productionItem = data
            this.initScroll()
            // slider组件数据
            let imgList = this.productionItem['subImages'].split(',')
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
            this.productionItem['price'] = 0
          } else {
            let msg = response.body['msg']
            console.log(msg)
          }
        })
      },
      /**
       * 获取商品介绍
       */
      getDetail() {
        this.$http.get(path()['productionDesc'] +
          '?goodsId=' + this.productionItem['goodsId']).then((response) => {
          let status = response.body['status']
          if (status === ResponseCode.SUCCESS) {
            this.goodsDesc = response.body['data']
            if (!this.goodsDesc) {
              this.goodsDesc = ' '
            }
            this.initScroll()
          } else {
            let msg = response.body['msg']
            console.log(msg)
          }
        })
      },
      getMore() {
        this.pageNum++
        this.isChanged = false
        this.getCommentList()
      },
      /**
       * 评论列表
       */
      getCommentList() {
        this.isLoadingComment = true
        if (!this.commentUrl) {
          this.commentUrl = path()['commentList'] + '?goodsId=' +
            this.goodsId
        }
        this.$http.get(this.commentUrl + '&pageNum=' + this.pageNum).then((response) => {
          this.isLoadingComment = false
          let status = response.body['status']
          if (status === ResponseCode.SUCCESS) {
            let data = response.body['data']
            this.hasNextPage = data.hasNextPage
            if (this.isNewPage || this.isChanged) {
              // 切换商品或筛选评论后重置评论列表
              this.commentList = data['list']
              for (let i = 0; i < this.commentList.length; i++) {
                let item = this.commentList[i]
                // 将图片json字符串转换为到数组
                if (item['images']) {
                  if (typeof item['images'] === 'string') {
                    item['images'] = item['images'].split(',')
                  }
                } else {
                  item['images'] = []
                }
              }
              this.isNewPage = false
            } else {
              // 点击加载更多, 追加数据到评论列表
              for (let i = 0; i < data['list'].length; i++) {
                let item = data['list'][i]
                // 将图片json字符串转换为到数组
                if (item['images']) {
                  if (typeof item['images'] === 'string') {
                    item['images'] = item['images'].split(',')
                  }
                } else {
                  item['images'] = []
                }
                // 下一页数据追加到数组末尾
                let index = this.commentList.length
                Vue.set(this.commentList, index, item)
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
  @import "../../../commons/styles/color.styl"
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
    .comment-loading
      height 100%
      line-height 100%
      display flex
      justify-content center
      align-items center
      background rgba(0, 0, 0, 0.5)
    .ph-img-wp
      width 100%
      font-size 14px
      height 15em
    .ph-img
      height 100%
    .close
      font-size 1.5em
      margin-top 0.15em
      margin-left 0.3em
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
        display flex
        flex-direction column
        .production-content
          flex 1
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
              color main-red
        .production-home
          height 100%
          .ph-image-show
            position relative
            width 100%
            overflow hidden
            height 15em
            .favorite-container
              position absolute
              right 1em
              bottom 1em
              z-index 2
              width 1.7em
              .favorite-button
                width 1.7em
                height 1.7em
              .favorite-text
                font-size 0.8em
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
            color main-red
            margin 0.5em auto
            font-size 0.9em
          .ph-price
            width 95%
            color price-red
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
          .pm-content
            width 100%
            p
              width 100%
            img
              width 100%
        .production-review
          width 100%
          .next-page
            height 5em
            line-height 5em
            width 100%
            text-align center
          .pr-top
            width 100%
            .pr-top-percent
              color main-red
              text-align right
              width 80%
              padding 0 10%
              border-1px(#ccc)
            .pr-top-star
              width 100%
              display flex
              flex-wrap wrap
              .pr-top-star-item
                flex-grow 1
                display inline-block
                margin 0.3em
                height 1.5em
                padding 0 0.3em
                line-height 1.5em
                border-radius 0.1em
                background #ddd
                text-align center
                &.active-item
                  background main-red
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
        background main-red
        outline none
        border 0
      .ph-add-cart
        width 100%
</style>
