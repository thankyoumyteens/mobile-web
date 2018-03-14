<template>
  <transition name="user-info-move">
    <div class="user-info-wrapper" v-if="user!==null" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">个人信息</span>
        <a class="login-link" @click="doUpdate">更新</a>
      </header>
      <split></split>
      <div class="si-content">
        <div class="si-label">
          <div class="sil-title">用户名: </div>
          <div class="sil-text">{{user['username']}}</div>
        </div>
        <div class="si-label">
          <div class="sil-title">昵称: </div>
          <input type="text" class="si-input" ref="nicknameUpdate" :value="user['nickname']">
        </div>
        <div class="si-label">
          <div class="sil-title">邮箱: </div>
          <input type="text" class="si-input" ref="emailUpdate" :value="user['email']">
        </div>
        <div class="si-label">
          <div class="sil-title">电话: </div>
          <input type="text" class="si-input" ref="phoneUpdate" :value="user['phone']">
        </div>
        <div class="si-label">
          <div class="sil-title">问题: </div>
          <input type="text" class="si-input" ref="questionUpdate" placeholder="未设置" :value="user['question']">
        </div>
        <div class="si-label">
          <div class="sil-title">答案: </div>
          <input type="text" class="si-input" ref="answerUpdate" placeholder="未设置" :value="user['answer']">
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
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      doUpdate () {
        let nickname = this.$refs.nicknameUpdate.value
        let email = this.$refs.emailUpdate.value
        let phone = this.$refs.phoneUpdate.value
        let question = this.$refs.questionUpdate.value
        let answer = this.$refs.answerUpdate.value

        if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
          alert('邮箱有误，请重填')
          return false
        }
        if (!(/^1[34578]\d{9}$/.test(phone))) {
          alert('手机号码有误，请重填')
          return false
        }
        this.$http.post(path()['updateUserInfo'], {
          'question': question,
          'answer': answer,
          'nickname': nickname,
          'email': email,
          'phone': phone
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            alert(res['msg'])
            this.$emit('success', res['data'])
          } else {
            console.log(res['msg'])
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
  .user-info-wrapper
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
