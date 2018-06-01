// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import WeVue from 'we-vue'
import ElementUI from 'element-ui'
// 加载样式
import 'we-vue/lib/style.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/commons/index.styl'

Vue.use(VueResource)
Vue.use(WeVue)
Vue.use(ElementUI)

Vue.config.productionTip = false

// 设置请求参数传递方式
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}
Vue.http.options.emulateJSON = true

// 跨域携带cookie
Vue.http.interceptors.push(function (request, next) {
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
