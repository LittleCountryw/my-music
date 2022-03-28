export default function debounce(fn, delay, immediate = false) {
  // 方式二:返回一个Promise
  let timer = null
  let isInvoke = false
  const _debounce = function (...args) {
    return new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer)
      if (immediate && !isInvoke) {
        const result = fn.apply(this, args)
        resolve(result)
        isInvoke = true
      } else {
        timer = setTimeout(() => {
          const result = fn.apply(this, args)
          resolve(result)
          isInvoke = false
        }, delay)
      }
    })
    // return result
    // 不能直接return result,原因是setTimeout是异步执行的，
    // 在其中执行result = fn.apply(this,args)时，result的赋值会在几秒之后
    // 而main script已经执行结束，result依然为null
  }

  _debounce.cancel = function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = null
    isInvoke = false
  }

  return _debounce
}
