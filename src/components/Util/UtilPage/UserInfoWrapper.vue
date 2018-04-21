<template>
  <transition name="user-info-move">
    <div class="user-info-wrapper" v-if="user!==null" v-show="isShow">
      <v-header titleText="个人信息" actionText="完成" @back="hide" @action="doUpdate"></v-header>
      <div class="si-content">
        <wv-group title="个人资料">
          <wv-input label="用户名" placeholder="" :readonly="true" v-model="username"></wv-input>
          <wv-input label="昵称" placeholder="" v-model="nickname"></wv-input>
          <wv-input label="邮箱" placeholder="" v-model="email"></wv-input>
          <wv-input label="电话" placeholder="" v-model="phone"></wv-input>
          <wv-input label="问题" placeholder="未设置" v-model="question"></wv-input>
          <wv-input label="答案" placeholder="未设置" v-model="answer"></wv-input>
        </wv-group>
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
    props: {
      user: {
        type: Object
      }
    },
    data () {
      return {
        isShow: false,
        username: '',
        nickname: '',
        email: '',
        phone: '',
        question: '',
        answer: ''
      }
    },
    methods: {
      doUpdate () {
        if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.email))) {
          Dialog({
            title: '提示',
            message: '邮箱格式有误，请重填',
            skin: 'ios'
          })
          return false
        }
        if (!(/^1[34578]\d{9}$/.test(this.phone))) {
          Dialog({
            title: '提示',
            message: '请输入有效的手机号码',
            skin: 'ios'
          })
          return false
        }
        this.$http.post(path()['updateUserInfo'], {
          'question': this.question,
          'answer': this.answer,
          'nickname': this.nickname,
          'email': this.email,
          'phone': this.phone
        }).then(response => {
          let res = response.body
          if (res['status'] === 0) {
            Dialog({
              title: '成功',
              message: res['msg'],
              skin: 'ios'
            })
            this.$emit('success', res['data'])
          } else {
            Dialog({
              title: '失败',
              message: res['msg'],
              skin: 'ios'
            })
          }
        })
      },
      show () {
        this.isShow = true
        if (this.user) {
          this.username = this.user['username']
          this.nickname = this.user['nickname']
          this.email = this.user['email']
          this.phone = this.user['phone']
          this.question = this.user['question']
          this.answer = this.user['answer']
        }
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
    z-index 999
    width 100%
    background #fff
    box-sizing border-box
</style>
