import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Category from '@/components/Category/Category'
import Recommend from '@/components/Recommend/Recommend'
import Cart from '@/components/Cart/Cart'
import User from '@/components/User/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {allowBack: false}
    },
    {
      path: '/category',
      name: 'Category',
      component: Category,
      meta: {allowBack: false}
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      meta: {allowBack: false}
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
      meta: {allowBack: false}
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {allowBack: false}
    }
  ]
})
