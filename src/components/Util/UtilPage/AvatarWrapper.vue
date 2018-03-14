<template>
  <transition name="user-info-move">
    <div class="avatar-wrapper" v-if="user!==null" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">更换头像</span>
      </header>
      <split></split>
      <input type="file" name="upload_file" ref="upload_file">
      <button @click="uploadAvatar">上传</button>
      <img class="avatar-placeholder" :src="avatarUrl===''?user['avatar']:avatarUrl" alt="">
      <button @click="upldateAvatar">确定</button>
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
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        isShow: false,
        avatarUrl: '',
        avatarUri: ''
      }
    },
    methods: {
      upldateAvatar () {
        this.$http.post(path()['updateAvatar'], {
          'avatar': this.avatarUri
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            alert(res['msg'])
            this.$emit('avatar', this.avatarUri)
          }
        })
      },
      uploadAvatar () {
        let formData = new FormData()
        formData.append('upload_file', this.$refs.upload_file.files[0])
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.$http.post(path()['uploadAvatar'], formData, config).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            let uri = res['data']['uri']
            let url = res['data']['url']
            this.avatarUrl = url
            this.avatarUri = uri
          }
        })
      },
      show () {
        this.isShow = true
      },
      hide () {
        this.isShow = false
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
  .avatar-wrapper
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
    .avatar-placeholder
      display block
      width 50%
      margin auto
</style>
