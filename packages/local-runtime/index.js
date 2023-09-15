const red = () => {
  console.log('red')
}
const yellow = () => {
  console.log('yellow')
}

const green = () => {
  console.log('green')
}

/**
 * 回调函数+定时器实现
 * @param {string} color 颜色
 * @param {number} timer 时间
 * @param {function} callback 回调函数
 */
const taskLoop = (color, timer, callback) => {
  // 调用定时器
  setTimeout(() => {
    if (color === 'red') {
      red()
    }
    if (color === 'yellow') {
      yellow()
    }
    if (color === 'green') {
      green()
    }
    callback()
  }, timer)

  // 定时器结束后触发回调
}

const loop1 = () => {
  taskLoop('red', 3000, () => {
    taskLoop('green', 1000, () => {
      taskLoop('yellow', 2000, loop)
    })
  })
}
// loop1()

const promiseLoop = (color, timer) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (color === 'red') {
        red()
      }
      if (color === 'yellow') {
        yellow()
      }
      if (color === 'green') {
        green()
      }
      resolve()
    }, timer)
  })
}

const loop2 = () => {
  promiseLoop('red', 3000).then(() =>
    promiseLoop('green', 1000).then(() =>
      promiseLoop('yellow', 2000).then(() => loop2())
    )
  )
}

// loop2()

/**
 * async/await 实现
 */
const asyncLoop = async () => {
  await promiseLoop('red', 3000)
  await promiseLoop('grreen', 1000)
  await promiseLoop('yellow', 2000)
  asyncLoop()
}

asyncLoop()
