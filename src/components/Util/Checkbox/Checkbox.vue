<template>
  <div class='checkbox' @click="toggleCheck">
    <div class="checkbox-item checkbox-back"></div>
    <div class="checkbox-item checkbox-front" v-show="checked"></div>
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
    data () {
      return {
        isChecked: this.checked
      }
    },
    methods: {
      check () {
        this.isChecked = true
      },
      uncheck () {
        this.isChecked = false
      },
      toggleCheck () {
        this.isChecked = !this.isChecked
      },
      checkStatus () {
        return this.isChecked
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .checkbox
    position relative
    width 1.5em
    height 1.5em
    border-radius 50%
    overflow hidden
    display inline-block
    .checkbox-item
      position absolute
      top 0
      left 0
      &.checkbox-back
        width 100%
        height 100%
        z-index 999
        background #ccc
      &.checkbox-front
        z-index 9999
        width 50%
        height 50%
        left 25%
        top 25%
        border-radius 50%
        background crimson
</style>
