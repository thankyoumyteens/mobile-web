/**
 * Created by Admin on 2017/11/24.
 */
export function path() {
  let local = ''
  let server = 'http://localhost:8088/mobile/'
  // server = local
  // todo 商品详情
  // todo 写评论
  // todo 各种分页
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
    'productionList': server + 'goods/list.do', // 获取商品列表
    'productionDetail': server + 'goods/detail.do', // 获取商品详情
    'productionListByKeywords': server + 'goods/search.do', // 搜索商品
    'commentList': server + 'comment/list.do', // 评论列表
    'commentListLevel': server + 'comment/list_level.do', // 筛选评论
    'commentListImg': server + 'comment/list_img.do', // 筛选有图评论
    /**
     * 购物车
     */
    'deleteCartItem': server + 'cart/delete.do', // 删除购物车中商品
    'sub': server + 'cart/sub.do', // 购物车中商品减一
    'add': server + 'cart/add.do', // 购物车中商品加一
    'check': server + 'cart/check.do', // 选中购物车中的商品
    'checkAll': server + 'cart/check_all.do', // 全选购物车中的商品
    'getCart': server + 'cart/list.do', // 获取购物车列表
    'addToCart': server + 'cart/create_goods.do', // 添加商品到购物车
    /**
     * 收货地址
     */
    'shippingList': server + 'shipping/list.do', // 获取用户的收货地址
    'deleteShipping': server + 'shipping/delete.do', // 删除收货地址
    'addShipping': server + 'shipping/add.do', // 删除收货地址
    'updateShipping': server + 'shipping/update.do', // 删除收货地址
    'region': server + 'shipping/region.do', // a
    /**
     * 订单
     */
    'sendDeliveryMessage': server + 'message/send_delivery_msg.do', // 提醒发货
    'alipayQuery': server + 'pay/query.do', // 创建订单
    'payLink': server + 'pay/alipay.do', // 创建订单
    'createOrder': server + 'order/create.do', // 创建订单
    'orderCancel': server + 'order/cancel.do', // 创建订单
    'orderConfirm': server + 'order/confirm.do', // 创建订单
    'orderList': server + 'order/list.do', // 订单列表
    'orderListNotPay': server + 'order/list_not_pay.do', // 订单列表
    'orderListPayed': server + 'order/list_payed.do', // 订单列表
    'orderDetail': server + 'order/detail.do', // 订单详情
    'orderDetailByNo': server + 'order/detail_by_no.do', // 订单详情
    /**
     * 首页
     */
    'homeImgList': server + 'home/images.do', // 获取首页轮播图片列表
    'homePlaceholder': server + 'home/placeholder.do' // 获取首页搜索框提示文字
  }
}
