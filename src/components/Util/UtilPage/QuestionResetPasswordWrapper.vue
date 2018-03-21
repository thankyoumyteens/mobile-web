<template>
  <transition name="user-info-move">
    <div class="reset-password-wrapper" v-show="isShow">
      <header>
        <div class="close" @click="hide"><</div>
        <span class="title">忘记密码</span>
        <a class="login-link" @click="doNext">{{label}}</a>
      </header>
      <split></split>
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
  import split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      split
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
            alert(res['msg'])
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
            console.log(this.token)
          } else {
            alert(res['msg'])
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
            alert(res['msg'])
            this.hide()
          } else {
            alert(res['msg'])
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
