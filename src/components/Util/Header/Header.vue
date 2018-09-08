<template>
  <header class="custom-header">
    <wv-header :title="titleText" :fixed="isFixed" :background-color="backgroundColor">
      <div class="btn-back" slot="left" @click="back"><i class="el-icon-back"></i></div>
      <div class="btn-menu" slot="right" @click="action">{{actionText}}</div>
    </wv-header>
  </header>
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
  .custom-header
    box-shadow 0 0.1em 0.2em 0.05em #ccc
</style>
