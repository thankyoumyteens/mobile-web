<template>
  <div class="category">
    <div class="category-item border-1px" @click="detail(item)" v-for="item in categoryList">
      <div class="company-logo"><img :src="item['img']" alt=""></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {
    path
  } from '@/commons/address.js'

  export default {
    created () {
      this.$http.get(path()['categoryList']).then((response) => {
        let status = response.body['status']
        if (status === 0) {
          this.categoryList = response.body['data']
        } else {
        }
      })
    },
    data () {
      return {
        categoryList: []
      }
    },
    methods: {
      detail (category) {
        this.$emit('category', category)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../commons/mixin.styl"

  .category
    width 100%
    .category-item
      width 95%
      margin auto
      text-align center
      border-1px(#000)
      &:last-child
        border-none()
      .company-logo
        padding 0.5em
</style>
