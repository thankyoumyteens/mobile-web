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
    'resetPassword': server + 'user/reset_password.do', // 修改密码
    'getQuestion': server + 'user/get_question.do', // 获取找回密码问题
    'checkAnswer': server + 'user/check_answer.do', // 验证答案
    'questionResetPassword': server + 'user/question_reset_password.do', // 通过问题修改密码
    /**
     * 分类
     */
    'categoryList': server + 'category/list.do', // 获取商品类别列表
    /**
     * 商品
     */
    'productionList': server + 'product/list.do', // 获取商品列表
    'productionDetail': server + 'product/detail.do', // 获取商品详情
    'productionListByKeywords': server + 'product/search.do', // 搜索商品
    /**
     * 购物车
     */
    'sub': server + 'cart/sub.do', // 购物车中商品减一
    'add': server + 'cart/add.do', // 购物车中商品加一
    'check': server + 'cart/check.do', // 选中购物车中的商品
    'checkAll': server + 'cart/check_all.do', // 全选购物车中的商品
    'getCart': server + 'cart/list.do', // 获取购物车列表
    'addToCart': server + 'cart/create.do', // 添加商品到购物车
    'homeImgList': local + 'home/images', // 获取首页轮播图片列表
    'homePlaceholder': local + 'home/placeholder' // 获取首页搜索框提示文字
  }
}
