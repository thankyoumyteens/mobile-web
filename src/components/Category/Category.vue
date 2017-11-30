<template>
  <div class="category">
    <div class="category-item" @click="detail(item)" v-for="item in categoryList">
      <div class="company-logo"><img :src="item['logo']" alt=""></div>
    </div>
    <productions ref="productions" :category="currentCategory"></productions>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import productions from '@/components/Page/Productions/Productions'
  import {
    path
  } from '@/commons/address.js'

  export default {
    components: {
      productions
    },
    created () {
      this.$http.get(path()['categoryList']).then((response) => {
        let status = response.body['status']
        let message = response.body['message']
        let data = response.body['data']
        if (status === 200) {
          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            Vue.set(this.categoryList, i, item)
          }
        } else {
          console.log(message)
        }
      })
    },
    data () {
      return {
        categoryList: [],
        currentCategory: {}
      }
    },
    methods: {
      detail (category) {
        this.currentCategory = category
        this.$refs.productions.show()
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
