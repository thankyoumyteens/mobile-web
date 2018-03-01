export function contains (list, item) {
  for (let i = 0; i < list.length; i++) {
    let el = list[i]
    if (el === item) {
      return i
    }
  }
  return -1
}
