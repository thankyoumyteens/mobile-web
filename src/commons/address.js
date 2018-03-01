/**
 * Created by Admin on 2017/11/24.
 */
export function path () {
  let server = '/'
  return {
    'check': server + 'user/check',
    'getCart': server + 'user/cart',
    'addToCart': server + 'user/add_to_cart',
    'userInfo': server + 'user/info',
    'register': server + 'user/register',
    'login': server + 'user/login',
    'productionDetail': server + 'production/detail',
    'productionListByKeywords': server + 'productions/keywords',
    'productionList': server + 'productions/simple',
    'categoryList': server + 'category/all',
    'homeImgList': server + 'home/images',
    'homePlaceholder': server + 'home/placeholder'
  }
}
