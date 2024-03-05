const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {
  // 构造器
  constructor(exextor) {
    // exextor 为用户传入的操作，其中包含了对 resolve 和 reject 方法的调用

    /**
     * 1. 定义初始状态
     * Promise 初始化时有 5 个状态 status value reason onFulfilledCallbacks onRejectedCallbacks
     */

    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    /**
     * 2. 定义 resolve 和 reject 方法
     * resolve 和 reject 用于改变状态，只有当前状态为 PENDING 时，才可以更改
     */

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onFulfilledCallbacks.forEach((fn) => fn(this.value))
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn(this.reason))
      }
    }

    /**
     * 3. 结束初始化后，开始执行 Promise 内部的语句
     */

    try {
      exextor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw new Error(reason instanceof Error ? reason.message : reason)
          }
    const self = this
    /**
     * then 方法返回一个 Promise 实例
     * 当状态为 PENDING 时，将 onFulfilled 和 onRejected 保存起来
     */
    return new Promise((resolve, reject) => {
      if (self.status === PENDING) {
        self.onFulfilledCallbacks.push(() => {
          try {
            // 模拟微任务（仅限模拟）

            // ------------------------------------------
            setTimeout(() => {
              const result = onFulfilled(self.value)
              result instanceof Promise
                ? result.then(resolve, reject)
                : resolve(result)
            })
            // ------------------------------------------
          } catch (e) {
            reject(e)
          }
        })
        self.onRejectedCallbacks.push(() => {
          try {
            setTimeout(() => {
              const result = onRejected(self.reason)
              result instanceof Promise
                ? result.then(resolve, reject)
                : resolve(result)
            })
          } catch (e) {
            reject(e)
          }
        })
      } else if (self.status === FULFILLED) {
        try {
          setTimeout(() => {
            const result = onFulfilled(self.value)
            result instanceof Promise
              ? result.then(resolve, reject)
              : resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      } else if (self.status === REJECTED) {
        try {
          setTimeout(() => {
            const result = onRejected(self.reason)
            result instanceof Promise
              ? result.then(resolve, reject)
              : resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      }
    })
  }
}

const test = new Promise((resolve, reject) => {
  resolve('success')
})

console.log(test)
