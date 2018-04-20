export function contains(list, item) {
  for (let i = 0; i < list.length; i++) {
    let el = list[i]
    if (el === item) {
      return i
    }
  }
  return -1
}

export function stringContains(list, item) {
  for (let i = 0; i < list.length; i++) {
    let el = list[i]
    if (el == item) {
      return true
    }
  }
  return false
}

export function formatTimestamp(string) {
  let date = new Date(string)
  let r = ''
  r += date.getFullYear() + '-'
  r += (date.getMonth() + 1) + '-'
  r += date.getDate() + '- '
  r += date.getHours() + ':'
  r += date.getMinutes() + ':'
  r += date.getSeconds()

  return r
}
