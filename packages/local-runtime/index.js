let abort

function abortPromise(p) {
  // 通过 Promise.race 实现中断
  return Promise.race([p, new Promise((resolve, reject) => (abort = reject))])
}

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
})

const ap = abortPromise(p)
  .then((res) => {
    console.log('success')
  })
  .catch((err) => {
    console.log('abort')
  })

setTimeout(() => {
  abort()
}, 1000)
