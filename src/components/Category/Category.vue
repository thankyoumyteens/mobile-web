<template>
  <div class="category">
    <div class="category-item border-1px" @click="detail(item)" v-if="categoryList.length>0"
         v-for="item in categoryList">
      <div class="company-logo"><img :src="item['img']" alt=""></div>
      <split :size="0.1"></split>
    </div>
    <div class="loading" v-if="categoryList.length<=0">
      <wv-spinner type="dot-circle" :size="50"></wv-spinner>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {path} from '@/commons/address'
  import {ResponseCode} from '@/commons/config'
  import Split from '@/components/Util/Split/Split'

  export default {
    components: {
      Split
    },
    created() {
      this.$http.get(path()['categoryList']).then((response) => {
        let status = response.body['status']
        if (status === ResponseCode.SUCCESS) {
          this.categoryList = response.body['data']
        } else {
        }
      })
    },
    data() {
      return {
        categoryList: []
      }
    },
    methods: {
      detail(category) {
        this.$emit('category', category)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .category
    width 100%
    .category-item
      width 95%
      margin auto
      text-align center
      .company-logo
        padding 0.5em
        img
          width 70%
</style>
