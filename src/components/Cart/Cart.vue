<template>
  <div class="cart">
    cart
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      user: {
        type: Object
      }
    },
    watch: {
      'user' () {
        console.log(this.user)
      }
    },
    created () {
      if (this.user !== null && this.user !== undefined) {
        console.log(this.user)
      }
      // this.getUserInfo()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
