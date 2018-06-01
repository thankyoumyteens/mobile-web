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
