/**
 *
 * @param {*} fn 回调函数
 * @param {*} times 重试次数
 * @param {*} timeout 超时时间
 * @param {*} cache 缓存内容
 */
Promise.retry = function (fn, times, timeout, cache = null) {
  return new Promise((resolve, reject) => {
    const retry = () => {
      fn.then((res) => {
        resolve(res)
      }).catch((reason) => {
        if (times > 0) {
          times--
          setTimeout(retry, timeout)
        } else {
          resolve(cache)
        }
      })
    }
  })
}
