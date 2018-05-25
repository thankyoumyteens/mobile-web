<template>
  <div class="header-use-we-vue">
    <wv-header :title="titleText" :fixed="isFixed" :background-color="backgroundColor">
      <div class="btn-back" slot="left" @click="back">
        <
        <!--<i class="iconfont icon-back" @click="$router.push('/')"></i>-->
      </div>
      <div class="btn-menu" slot="right" @click="action">
        {{actionText}}
        <!--<i class="iconfont icon-menu" @click="$router.push('/')"></i>-->
      </div>
    </wv-header>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      actionText: {
        type: String,
        default: ''
      },
      titleText: {
        type: String,
        default: ''
      },
      isFixed: {
        type: Boolean,
        default: false
      },
      backgroundColor: {
        type: String,
        default: '#e64340'
      }
    },
    methods: {
      back() {
        this.$emit('back')
      },
      action() {
        this.$emit('action')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
