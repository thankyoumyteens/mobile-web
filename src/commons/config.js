/**
 * 服务器返回的状态码
 */
export const ResponseCode = {
  // 成功
  SUCCESS: 0,
  // 失败
  ERROR: 1,
  // 参数错误
  ILLEGAL_ARGUMENT: 2,
  // 无权限
  NO_PRIVILEGE: 3,
  // 请登陆
  NEED_LOGIN: 10
}

/**
 * 订单状态
 */
export const OrderStatus = {
  // 全部
  ALL: -1,
  // 已取消
  CANCELED: 0,
  // 未付款
  NOT_PAY: 10,
  // 已付款
  PAYED: 20,
  // 已发货
  SENT: 40,
  // 交易成功
  SUCCESS: 50,
  // 交易关闭(评论后)
  CLOSED: 60
}

/**
 * 收藏类型
 */
export const FavoriteType = {
  // 商品
  GOODS: 0,
  // 店铺
  SHOP: 1
}

export const ComponentsConfigProduction = {
  NAV_INDEX_GOODS: 0,
  NAV_INDEX_DETAIL: 1,
  NAV_INDEX_COMMENT: 2,
  COMMENT_TYPE_ALL: 3,
  COMMENT_TYPE_GOOD: 4,
  COMMENT_TYPE_NORMAL: 5,
  COMMENT_TYPE_BAD: 6,
  COMMENT_TYPE_IMAGE: 7
}
