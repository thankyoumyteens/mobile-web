<template>
  <transition name="user-info-move">
    <div class="avatar-wrapper" v-if="user!==null" v-show="isShow">
      <v-header titleText="更换头像" @back="hide"></v-header>
      <div class="login-button upl-wrapper">
        <div class="upl-text">{{msgSelect}}</div>
        <input class="hide" @change="selectFile" type="file" name="upload_file" ref="upload_file">
      </div>
      <button class="login-button" :class="[isEnable?'':'disable']" @click="uploadAvatar">{{msg}}</button>
      <img class="avatar-placeholder" :src="avatarUrl===''?user['avatar']:avatarUrl" alt="">
      <button class="login-button" :class="[isEnableUpdate?'':'disable']" @click="updateAvatar">确定</button>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'

  export default {
    components: {
      Split,
      VHeader
    },
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        isShow: false,
        avatarUrl: '',
        avatarUri: '',
        isEnable: false, // 上传按钮是否可用
        msgSelect: '选择图片', // input控件提示文字
        msg: '请选择文件', // 上传按钮提示文字
        isEnableUpdate: false // 确定按钮是否可用
      }
    },
    methods: {
      selectFile() {
        if (!this.$refs.upload_file.files[0]) {
          return
        }
        this.isEnable = true
        this.msg = '上传'
        this.msgSelect = this.$refs.upload_file.files[0].name
      },
      updateAvatar() {
        if (!this.isEnableUpdate) {
          return
        }
        this.isEnableUpdate = false
        this.$http.post(path()['updateAvatar'], {
          'avatar': this.avatarUri
        }).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
            this.$emit('avatar', this.avatarUri)
          }
        })
      },
      uploadAvatar() {
        if (!this.$refs.upload_file.files[0]) {
          return
        }
        if (!this.isEnable) {
          return
        }
        this.isEnable = false
        this.msg = '上传中, 请稍等...'
        let formData = new FormData()
        formData.append('upload_file', this.$refs.upload_file.files[0])
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.$http.post(path()['uploadAvatar'], formData, config).then(response => {
          let res = response.body
          if (res['status'] === ResponseCode.SUCCESS) {
            this.isEnable = false
            this.isEnableUpdate = true
            this.msg = '上传完成'
            this.avatarUri = res['data']['uri']
            this.avatarUrl = res['data']['url']
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
            this.isEnable = false
            this.msg = '请选择文件'
          }
        })
      },
      show() {
        this.isShow = true
        this.isEnable = false
        this.msgSelect = '选择图片'
        this.msg = '请选择文件'
        this.isEnableUpdate = false
      },
      hide() {
        this.isShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-info-move-enter-active
    animation bounce-in .2s linear

  .user-info-move-leave-active
    animation bounce-out .2s linear

  .avatar-wrapper
    position fixed
    top 0
    left 0
    bottom 0
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
    .login-button
      display block
      width 95%
      height 3em
      line-height 3em
      border 0.1em solid #ccc
      margin 1em auto
      border-radius 5px
      padding-left 1em
      box-sizing border-box
      background rgba(240, 20, 20, 0.9)
      color #fff
      &.disable
        background #ccc
        color #000
      .hide
        opacity 0
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        z-index 1
    .upl-wrapper
      position relative
      z-index -2
      .upl-text
        position relative
        z-index -1
        float left
        margin auto
    .avatar-placeholder
      display block
      max-width 50%
      max-height 15em
      margin auto
</style>
