<template>
  <transition name="user-info-move">
    <div class="reset-password-wrapper" v-show="isShow">
      <v-header titleText="忘记密码" :actionText="label" @back="hide" @action="doNext"></v-header>
      <div class="si-iii-content" v-show="!isShowQuestion">
        <wv-group title="忘记密码">
          <wv-input label="用户名" placeholder="" v-model="username"></wv-input>
        </wv-group>
      </div>
      <div class="si-iii-content" v-show="isShowQuestion&&!isResetPassword">
        <wv-group title="忘记密码">
          <wv-input label="密保问题" placeholder="" v-model="question"></wv-input>
          <wv-input label="答案" placeholder="" v-model="answer"></wv-input>
        </wv-group>
      </div>
      <div class="si-iii-content" v-show="isResetPassword">
        <wv-group title="忘记密码">
          <wv-input label="新密码" placeholder="" type="password" v-model="pwdNew"></wv-input>
        </wv-group>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'we-vue'
  import VHeader from '@/components/Util/Header/Header'
  import Split from '@/components/Util/Split/Split'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      Split,
      VHeader
    },
    data() {
      return {
        isShow: false,
        label: '',
        isShowQuestion: false,
        isResetPassword: false,
        step: 1,
        question: '',
        token: '',
        username: '',
        answer: '',
        pwdNew: ''
      }
    },
    methods: {
      doNext() {
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
      getQuestion() {
        if (!this.username) {
          return
        }
        this.$http.post(path()['getQuestion'], {
          'username': this.username
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
      checkAnswer() {
        if (!this.answer) {
          return
        }
        this.$http.post(path()['checkAnswer'], {
          'username': this.username,
          'question': this.question,
          'answer': this.answer
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
      doReset() {
        this.$http.post(path()['questionResetPassword'], {
          'username': this.username,
          'password': this.pwdNew,
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
      show() {
        this.isShow = true
        this.label = '继续'
        this.step = 1
        this.question = ''
        this.answer = ''
        this.token = ''
        this.username = ''
        this.pwdNew = ''
        this.isShowQuestion = false
        this.isResetPassword = false
      },
      hide() {
        this.isShow = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../commons/mixin.styl"

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
</style>
