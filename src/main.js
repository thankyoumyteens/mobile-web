// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
// 加载样式
import '@/commons/index.styl'

Vue.use(VueResource)
Vue.use(WeVue)

Vue.config.productionTip = false

Vue.http.options.emulateJSON = true
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}
Vue.http.options.emulateJSON = true

// todo 删除跨域设置
Vue.http.interceptors.push(function (request, next) { // 拦截器
// 跨域携带cookie
  request.credentials = true
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})

// router.push('/home')
