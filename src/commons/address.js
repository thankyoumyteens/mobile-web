/**
 * Created by Admin on 2017/11/24.
 */
export function path () {
  let server = '/'
  return {
    'productionList': server + 'productions/simple',
    'categoryList': server + 'category/all',
    'homeImgList': server + 'home/images',
    'homePlaceholder': server + 'home/placeholder'
  }
}