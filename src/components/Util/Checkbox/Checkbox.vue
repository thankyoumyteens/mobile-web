<template>
  <div class='checkbox' @click="toggleCheck">
    <div class="checkbox-item" :class="[checked?'check':'']">
      <i class="iconfont icon-gouxuan"></i>
    </div>
    <!--<div class="checkbox-item checkbox-back"></div>-->
    <!--<div class="checkbox-item checkbox-front" v-show="checked"></div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      checked: {
        type: Boolean,
        defaultValue: false
      }
    },
    data() {
      return {
        isChecked: this.checked
      }
    },
    methods: {
      check() {
        this.isChecked = true
      },
      uncheck() {
        this.isChecked = false
      },
      toggleCheck() {
        this.isChecked = !this.isChecked
      },
      checkStatus() {
        return this.isChecked
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .checkbox
    width 1.5em
    height 1.5em
    display inline-block
    position relative
    .checkbox-item
      position absolute
      top -25%
      width 1.5em
      height 1.5em
      vertical-align top
      &.check
        color #e64340
      i
        vertical-align top
        font-size 1.5em
      &.checkbox-back
        width 100%
        height 100%
        z-index -2
        background #ccc
      &.checkbox-front
        z-index -1
        width 50%
        height 50%
        left 25%
        top 25%
        border-radius 50%
        background crimson
</style>
