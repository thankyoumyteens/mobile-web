/**
 * Created by Admin on 2017/11/24.
 */
export function path () {
  let local = '/'
  let server = 'http://localhost:8088/mobile/'
  return {
    /**
     * 用户
     */
    'userInfo': server + 'user/get_user_info.do', // 获取用户信息
    'register': server + 'user/register.do', // 注册
    'login': server + 'user/login.do', // 登陆
    'logout': server + 'user/logout.do', // 退出登陆
    'uploadAvatar': server + 'user/upload.do', // 上传头像
    'updateAvatar': server + 'user/update_avatar.do', // 上传头像
    'updateUserInfo': server + 'user/update_user_info.do', // 修改个人信息
    /**
     * 其他
     */
    'sub': local + 'cart/sub', // 购物车中商品减一
    'add': local + 'cart/add', // 购物车中商品加一
    'check': local + 'cart/check', // 选中购物车中的商品
    'getCart': local + 'cart/list', // 获取购物车列表
    'addToCart': local + 'cart/add_to_cart', // 添加商品到购物车
    'productionDetail': local + 'production/detail', // 获取商品详情
    'productionListByKeywords': local + 'productions/keywords', // 搜索商品
    'productionList': local + 'productions/simple', // 获取商品列表
    'categoryList': local + 'category/all', // 获取商品类别列表
    'homeImgList': local + 'home/images', // 获取首页轮播图片列表
    'homePlaceholder': local + 'home/placeholder' // 获取首页搜索框提示文字
  }
}
