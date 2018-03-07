/**
 * Created by Admin on 2017/11/24.
 */
export function path () {
  let server = '/'
  return {
    'sub': server + 'cart/sub', // 购物车中商品减一
    'add': server + 'cart/add', // 购物车中商品加一
    'check': server + 'cart/check', // 选中购物车中的商品
    'getCart': server + 'cart/list', // 获取购物车列表
    'addToCart': server + 'cart/add_to_cart', // 添加商品到购物车
    'userInfo': server + 'user/info', // 获取用户信息
    'register': server + 'user/register', // 注册
    'login': server + 'user/login', // 登陆
    'productionDetail': server + 'production/detail', // 获取商品详情
    'productionListByKeywords': server + 'productions/keywords', // 搜索商品
    'productionList': server + 'productions/simple', // 获取商品列表
    'categoryList': server + 'category/all', // 获取商品类别列表
    'homeImgList': server + 'home/images', // 获取首页轮播图片列表
    'homePlaceholder': server + 'home/placeholder' // 获取首页搜索框提示文字
  }
}
