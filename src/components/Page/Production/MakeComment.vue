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
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :file-list="fileList2"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <!--<el-dialog :visible.sync="dialogVisible">-->
              <!--<img width="100%" :src="dialogImageUrl" alt="">-->
              <!--</el-dialog>-->
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
        fileList2: [],
        dialogImageUrl: '',
        dialogVisible: false,
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
      uploadSuccess(res, file) {
        this.imgList.push(res.data.uri)
        this.fileList2.push({
          url: res.data.url
        })
        this.initScroll() // todo 无效
        console.log(this.imgList)
        console.log(this.dialogImageUrl)
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
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      addComment() {
        let params = []
        for (let index in this.order.orderItemList) {
          let orderItem = this.order.orderItemList[index]
          let commentItem = {
            goodsId: orderItem.goodsId,
            orderItemId: orderItem.orderItemId,
            star: this.starList[index],
            text: this.commentList[index],
            images: this.imgList.join(',')
          }
          params.push(commentItem)
        }
        console.log(params)
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
      show(order) {
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
  @import "../../../commons/mixin.styl"

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
