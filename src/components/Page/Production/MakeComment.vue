<template>
  <transition name="make-comment-move">
    <div class="make-comment" v-show="isShow">
      <v-header titleText="写评论" actionText="发表" @back="hide" @action="addComment"></v-header>
      <div class="comment-wrapper" v-if="order" ref="makeCommentScrollWrapper">
        <div>
          <div class="order-item" v-for="(item,index) in order.orderItemList" :key="index">
            <div class="comment-row">
              <div class="goods-title">{{item.productName}}</div>
              <div class="goods-properties">{{item.detail}}</div>
            </div>
            <div class="comment-row comment-flex">
              <div class="title">评分</div>
              <div class="rate-wrapper">
                <el-rate v-model="starList[index]"></el-rate>
              </div>
            </div>
            <div class="comment-row">
              <!--:file-list="fileList2[index]"-->
              <el-upload
                :data="{index: index}"
                :action="uploadUrl"
                :file-list="fileList2[index]"
                list-type="picture-card"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <div class="comment-row">
              <wv-group>
                <wv-textarea placeholder="请输入评论" :rows="3" v-model="commentList[index]" :max-length="100"></wv-textarea>
              </wv-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import BetterScroll from 'better-scroll'
  import VHeader from '@/components/Util/Header/Header'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'

  export default {
    components: {
      VHeader
    },
    data() {
      return {
        orderIndex: 0,
        fileList2: [],
        uploadUrl: '',
        imgList: [],
        starList: [],
        commentList: [],
        isShow: false,
        order: null
      }
    },
    created() {
      this.uploadUrl = path()['uploadImg']
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      uploadSuccess(res, file, fileList) {
        console.log(res)
        // 上传图片时将商品索引(order.orderItemList[index])发送到服务器,
        // 上传成功后从服务器取回商品索引
        // 根据索引记录不同商品上传的图片
        if (!this.imgList[res.data.index]) {
          this.imgList[res.data.index] = []
        }
        this.imgList[res.data.index].push(res.data.uri)
        if (!this.fileList2[res.data.index]) {
          this.fileList2[res.data.index] = []
        }
        this.fileList2[res.data.index].push({
          url: res.data.url
        })
        this.initScroll()
      },
      beforeUpload() {
        if (this.imgList && this.imgList.length >= 5) {
          Dialog({
            title: '提示',
            message: '图片数量达到上限',
            skin: 'ios'
          })
          return false
        }
      },
      handlePictureCardPreview() {
      },
      addComment() {
        let params = []
        for (let index in this.order.orderItemList) {
          let orderItem = this.order.orderItemList[index]
          let commentItem = {
            goodsId: orderItem.goodsId,
            orderItemId: orderItem.orderItemId,
            star: this.starList[index] ? this.starList[index] : 5,
            text: this.commentList[index] ? this.commentList[index] : '',
            images: this.imgList[index] ? this.imgList[index].join(',') : ''
          }
          params.push(commentItem)
        }
        console.log('评论 -> ' + params)
        this.$http.post(path()['makeComment'], {
          str: JSON.stringify(params)
        }).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
            this.$emit('done', this.orderIndex)
            this.hide() // todo orderList更新status
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.makeCommentScroll) {
            this.makeCommentScroll = new BetterScroll(this.$refs.makeCommentScrollWrapper, {
              click: true
            })
          } else {
            this.makeCommentScroll.refresh()
          }
        })
      },
      show(index, order) {
        this.orderIndex = index
        this.order = order
        this.isShow = true
        this.initScroll()
      },
      hide() {
        this.isShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .make-comment-move-enter-active
    animation bounce-in .2s linear

  .make-comment-move-leave-active
    animation bounce-out .2s linear

  .make-comment
    position fixed
    top 0
    left 0
    bottom 0
    z-index 998
    width 100%
    background #fff
    box-sizing border-box
    .el-upload-list__item
      width 5em
      height 5em
    .el-upload--picture-card
      width 5em
      height 5em
      line-height 5em
    .comment-wrapper
      overflow hidden
      position absolute
      top 50px
      bottom 0
      width 100%
      .order-item
        width 90%
        margin 0 auto
        .comment-row
          &.comment-flex
            display flex
          .title
            width 3em
          .rate-wrapper
            flex 1
            align-self center
          .goods-title
            width 100%
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          .goods-properties
            color #ccc
</style>
