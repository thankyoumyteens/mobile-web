<template>
  <transition name="user-info-move">
    <div class="reset-password-wrapper" v-show="isShow">
      <v-header titleText="忘记密码" :actionText="label" @back="hide" @action="doNext"></v-header>
      <div class="si-content" v-show="!isShowQuestion">
        <div class="si-label">
          <div class="sil-title">用户名: </div>
          <input type="text" class="si-input" ref="questionUsername" value="">
        </div>
      </div>
      <div class="si-content" v-show="isShowQuestion&&!isResetPassword">
        <div class="si-label">
          <div class="sil-title">密保问题: </div>
          <div class="sil-text">{{question}}</div>
        </div>
        <div class="si-label">
          <div class="sil-title">答案: </div>
          <input type="text" class="si-input" ref="questionAnswer" value="">
        </div>
      </div>
      <div class="si-content" v-show="isResetPassword">
        <div class="si-label">
          <div class="sil-title">新密码: </div>
          <input type="password" class="si-input" ref="questionPassword" value="">
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split,
      VHeader
    },
    data () {
      return {
        isShow: false,
        label: '',
        isShowQuestion: false,
        isResetPassword: false,
        step: 1,
        question: '',
        token: ''
      }
    },
    methods: {
      doNext () {
        switch (this.step) {
          case 1:
            // 获取问题
            this.getQuestion()
            break
          case 2:
            // 验证答案
            this.checkAnswer()
            break
          case 3:
            // 重置密码
            this.doReset()
            break
        }
      },
      getQuestion () {
        if (!this.$refs.questionUsername.value) {
          return
        }
        this.$http.post(path()['getQuestion'], {
          'username': this.$refs.questionUsername.value
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            this.question = res['data']
            this.isShowQuestion = true
            this.step = 2
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      checkAnswer () {
        if (!this.$refs.questionAnswer.value) {
          return
        }
        this.$http.post(path()['checkAnswer'], {
          'username': this.$refs.questionUsername.value,
          'question': this.question,
          'answer': this.$refs.questionAnswer.value
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            this.token = res['data']
            this.isResetPassword = true
            this.step = 3
            this.label = '修改'
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      doReset () {
        this.$http.post(path()['questionResetPassword'], {
          'username': this.$refs.questionUsername.value,
          'password': this.$refs.questionPassword.value,
          'token': this.token
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
            this.hide()
          } else {
            Dialog({
              title: '提示',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      show () {
        this.isShow = true
        this.label = '继续'
        this.step = 1
        this.isShowQuestion = false
        this.isResetPassword = false
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
  .reset-password-wrapper
    position fixed
    top 0
    left 0
    bottom 0
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
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
