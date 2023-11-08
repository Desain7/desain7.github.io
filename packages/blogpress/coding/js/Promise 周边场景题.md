---
isTimeLine: true
title: Promise 周边场景题
date: 2023-10-28
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---

# Promise 周边场景题

## 使用 setInterval 实现 setTimeout

```js
const timer = setInterval(() => {
  console.log('settimeout')
  clearInterval(timer)
}, 3000)
```

## repeat(console.log, 5, 1000);

```js
const repeat = (callback, timer, times) => {
  const inter = setInterval(() => {
    callback()
    times--
    if (times <= 0) {
      clearInterval(inter)
    }
  }, timer)
}
```

## 封装一个工具函数输入一个promiseA返回一个promiseB如果超过1s没返回则抛出异常如果正常则输出正确的值。

利用 Promise.race()

```js
function promiseUtils(promise) {
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 1000)
    })
  ])
}
```

## 实现一个 sleep 函数

```js
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve(123), time)
  })
}
```

## 实现图片异步加载

```js
function asyncLoadImg(url) {
  return new Promise((resolve, reject) => {
    // 图片实例对象
    const img = new Image()
    // 监听加载事件
    img.onload(() => {
      resolve(img)
    })
    // 监听失败事件
    img.onerror(() => {
      reject(new Error('图片加载失败'))
    })
    // 加载图片
    img.src = url
  })
}
```

## 使用 Promise 封装 ajax 请求

```js
function ajaxPro(method, url) {
  return new Promise((resolve, reject) => {
    // 新建 xhr 实例
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.send(null)
    xhr.onreadystatechange(() => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        }
      } else {
        reject(new Error('请求失败'))
      }
    })
  })
}
```

## 依次发送三个网络请求，拿到服务器数据

```js
function data1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('result1')
    }, 1000)
  })
}
function data2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('result2')
    }, 1000)
  })
}
function data3() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('result3')
    }, 1000)
  })
}

async function sendRequest() {
  const r1 = await data1()
  const r2 = await data2()
  const r3 = await data3()
  console.log(r1, r2, r3)
}
```

## Promise 中断请求

promise 本身并没有提供中断请求的方法，可以通过一个标识变量来借助实现。

```js
let abort = false

function sendRequest() {
  return new Promise((resolve, reject) => {
    if (abort) {
      reject()
    }
    // 发送异步请求
    setTimeout(() => {
      resolve('result')
    }, 2000)
  })
}

setTimeout(() => {
  // 中断请求
  abort = true
}, 1000)
```

## 给定一系列的api，测量上传速度（实现的时候用的GET请求）并选择一个加载时间最短的api

```js
const sendRequest = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url).then((res) => {
      resolve(url)
    })
  })
}

const getFastApi = async (apis) => {
  const res = await Promise.race(apis.map((url) => sendRequest(url)))
  return res
}
```

## setTimeout 系统补偿时间（概念模糊）

## setTimeout 准时（同上）

## Promise 串行执行

让多个 Promise 依据给定的顺序执行，只有前一个 Promise 执行完毕（settle），后一个才会执行。

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const promiseArr = [
  () =>
    delay(2000).then(() => {
      console.log('res1')
    }),
  () =>
    delay(1000).then(() => {
      console.log('res2')
    }),
  () =>
    delay(3000).then(() => {
      console.log('res3')
    })
]
/**
 * 串行执行，等待当前 promise 执行完毕后，再执行下一个
 */
const serialPromise = async () => {
  for (const promise of promiseArr) {
    await promise()
  }
}
```

## 设计一个简单的任务队列，要求分别在 1,3,4 秒后打印出 "1", "2", "3"

```js
function Queue() {
  this.queue = []
  this.add = function (timer, callback) {
    const p = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(callback())
        }, timer)
      })
    }
    this.queue.push(p)
    return this
  }
  this.start = async function () {
    while (this.queue.length) {
      await this.queue
        .shift()()
        .then((res) => {})
    }
  }
}

new Queue()
  .add(1000, () => {
    console.log(1)
  })
  .add(2000, () => {
    console.log(2)
  })
  .add(1000, () => {
    console.log(3)
  })
  .start()
```

## 每隔三秒输出时间

```js
const time = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(new Date())
      resolve('time')
    }, 3000)
  })
}

const outputTime = async () => {
  await time()
  outputTime()
}

outputTime()
```

## Promise.retry()

Promise.retry 超时重新请求，并在重试一定次数依然失败时输出缓存内容。

```js
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

```