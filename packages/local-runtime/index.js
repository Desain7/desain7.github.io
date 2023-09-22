const pro = Promise.all([1, Promise.resolve(3), 10]).then(
  (val) => {
    console.log(val)
  },
  (reason) => {
    console.log(reason)
  }
)

/**
 *
 * @param {any} obj 对象
 * @returns 该对象是否是 thenable 的， 从而判断是否是一个 promise 对象
 */
function isThenable(obj) {
  if ((typeof obj === 'object' && obj !== null) || typeof obj === 'function') {
    if (typeof obj.then === 'function') {
      return true
    }
  }
  return false
}

const myAll = (Promises) => {
  return new Promise((resolve, reject) => {
    let count = 0
    const arr = []
    Promises.forEach((item) => {
      if (isThenable(item)) {
        item.then((value) => {
          arr[count++] = value
          if (count === Promises.length - 1) {
            resolve(arr)
          }
        }, reject)
      } else {
        arr[count++] = item
        if (count === Promises.length - 1) {
          resolve(arr)
        }
      }
    })
  })
}

myAll([1, Promise.resolve(3), 10]).then(
  (val) => console.log(val),
  (res) => console.log(res)
)
