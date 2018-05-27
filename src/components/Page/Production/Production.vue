<template>
  <transition name="production-move">
    <div class="production" v-show="productionShow">
      <div class="close" @click="hide"><i class="icon-cross"></i></div>
      <div class="loading" v-if="currentNavIndex===0&&!productionItem">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <div class="loading" v-if="isLoadingComment&&currentNavIndex===2&&commentList.length<=0">
        <wv-spinner type="dot-circle" :size="50"></wv-spinner>
      </div>
      <section class="production-detail">
        <div class="production-info">
          <div class="production-nav">
            <div class="production-nav-item border-1px" @click="changeTab(0)"
                 :class="[currentNavIndex==0?'active':'']">商品
            </div>
            <div class="production-nav-item border-1px" @click="changeTab(1)"
                 :class="[currentNavIndex==1?'active':'']">详情
            </div>
            <div class="production-nav-item border-1px" @click="changeTab(2)"
                 :class="[currentNavIndex==2?'active':'']">评价
            </div>
          </div>
          <div class="production-content scroll-wrapper" ref="scrollWrapperProduction">
            <div>
              <!--商品-->
              <section class="production-home" v-if="productionItem" v-show="currentNavIndex===0">
                <div class="ph-image-show">
                  <!-- 配置slider组件 -->
                  <slider :pages="pages" :sliderinit="sliderinit">
                    <!-- 设置loading,可自定义 -->
                    <div slot="loading">加载中...</div>
                  </slider>
                </div>
                <div class="ph-name">
                  {{productionItem['name']}}
                </div>
                <div class="ph-remark">
                  {{productionItem['subtitle']}}
                </div>
                <div class="ph-price">
                  ￥{{productionItem['price']}}
                </div>
                <split></split>
                <div class="ph-select" @click="showSelect">
                  {{selection}}
                </div>
                <split></split>
              </section>
              <!--详情-->
              <section class="production-more" v-if="goodsDesc" v-show="currentNavIndex===1">
                <div class="pm-content" v-html="goodsDesc.text"></div>
              </section>
              <!--评价-->
              <section class="production-review" v-show="currentNavIndex===2">
                <div class="pr-top">
                  <div class="pr-top-star">
                    <div class="pr-top-star-item" @click="changeStar(1)"
                         :class="[currentCommentType==1?'active-item':'']">
                      全部
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(2)"
                         :class="[currentCommentType==2?'active-item':'']">
                      好评
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(3)"
                         :class="[currentCommentType==3?'active-item':'']">
                      中评
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(4)"
                         :class="[currentCommentType==4?'active-item':'']">
                      差评
                    </div>
                    <div class="pr-top-star-item" @click="changeStar(5)"
                         :class="[currentCommentType==5?'active-item':'']">
                      有图
                    </div>
                  </div>
                </div>
                <split></split>
                <div class="pr-list" v-if="commentList.length > 0">
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
                      <split :size="0.5"></split>
                    </div>
                  </div>
                </div>
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
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Star from '@/components/Util/Star/Star'
  import Split from '@/components/Util/Split/Split'
  import SelectType from '@/components/Util/SelectType/SelectType'
  import BetterScroll from 'better-scroll'
  import slider from 'vue-concise-slider'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'

  export default {
    components: {
      slider,
      Split,
      Star,
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
        currentCommentType: 1, // 查看评论类型(有图/好评/中评/差评)
        selection: '请选择版本',
        currentNavIndex: 0, // 商品/详情/评论
        scrollProduction: null,
        productionItem: null,
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
    methods: {
      /**
       * 筛选评论
       */
      changeStar(commentType) {
        this.isChanged = true
        this.pageNum = 1
        this.currentCommentType = commentType
        this.commentUrl = path()['commentListLevel']
        switch (commentType) {
          case 2: // 好评
            this.commentUrl += '?goodsId=' + this.goodsId + '&level=1'
            break
          case 3: // 中评
            this.commentUrl += '?goodsId=' + this.goodsId + '&level=2'
            break
          case 4: // 差评
            this.commentUrl += '?goodsId=' + this.goodsId + '&level=3'
            break
          case 5: // 有图
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
        for (let key in product['text']) {
          let val = product['text'][key]
          text += val + ' '
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
        if (index === 1) {
          // 获取详情
          this.getDetail()
        } else if (index === 2) {
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
  @import "../../../commons/mixin.styl"

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
