---
isTimeLine: true
title: 手写实现 Promise
date: 2023-8-25
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 手写实现 Promise

[Promise 简述](/interview/js/Promise简述.md)

---

## 定义三种状态

* Promise 的三种状态
  * pending（等待）: 初始状态，没有完成，也没有被拒绝
  * resolved（完成）: 表示操作成功完成
  * rejected（拒绝）: 表示操作失败

```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败
```

## 定义 Promise 类及构造器，初始化 Promise 内部属性、方法

```js
class Promise {
  // 构造器
  constructor(exextor) {
    // Promise 初始状态为 Pending
    this.status = PENDING
    // 将成功与失败的结果存到 this 上，便于 then 与 catch 的访问
    this.value = undefined
    this.reason = undefined
    // 成功后的回调函数队列
    this.onFulfilledCallbacks = []
    // 失败后的回调函数队列
    this.onRejectedCallbacks = []

    // 定义 resolve 方法
    const resolve = (value) => {
      // 只有当状态为 Pending 时，才可以更改状态
      if(this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onFulfilledCallbacks.forEach(fn => fn(this.value))
      }
    }

    // 定义 reject 方法
    const reject = (reason) => {
      // 只有当状态为 Pending 时，才可以更改状态
      if(this.status = PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn(this.reason))
      }
    }

    // 初始化成功后立即执行 Promise 内部的语句
    try {
      // 立即执行 executor
      // 把内部的 resolve 和 reject 传入 executor，用户可调用 resolve 和 reject 来变更 Promise 的状态
      exector(resolve, reject);
    } catch (e) {
      // executor 执行出错，将错误内容 reject 抛出去
      reject(e);
    }
  }
}
```

:::tip
以下方法均定义在 Promise 类内部
:::

## 实现 Promise.then() 方法

`Promise.then()` 方法接收两个参数，对应 Promise 成功和失败的两种状态，它会返回一个等效的 Promise 对象。

:::tip
当传入的参数不为函数时，则直接返回值或抛出错误
:::

```js
  /**
   * promise.then 的实现
   * @param {*} onFulfilled
   * @param {*} onRejected
   * @returns
   * 
   */
  then(onFulfilled, onRejected) {

    // onFulfilled 函数会在 Promise 对象完成时异步执行
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw new Error(reason instanceof Error ? reason.message : reason);
          };
    // 保存this
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.status === PENDING) {
        self.onFulfilledCallbacks.push(() => {
          // try捕获错误
          try {
            // 模拟微任务
            setTimeout(() => {
              const result = onFulfilled(self.value);
              // 分两种情况：
              // 1. 回调函数返回值是Promise，执行then操作
              // 2. 如果不是Promise，调用新Promise的resolve函数
              result instanceof Promise
                ? result.then(resolve, reject)
                : resolve(result);
            });
          } catch (e) {
            reject(e);
          }
        });
        self.onRejectedCallbacks.push(() => {
          // 以下同理
          try {
            setTimeout(() => {
              const result = onRejected(self.reason);
              // 不同点：此时是reject
              result instanceof Promise
                ? result.then(resolve, reject)
                : reject(result);
            });
          } catch (e) {
            reject(e);
          }
        });
      } else if (self.status === FULFILLED) {
        try {
          setTimeout(() => {
            const result = onFulfilled(self.value);
            result instanceof Promise
              ? result.then(resolve, reject)
              : resolve(result);
          });
        } catch (e) {
          reject(e);
        }
      } else if (self.status === REJECTED) {
        try {
          setTimeout(() => {
            const result = onRejected(self.reason);
            result instanceof Promise
              ? result.then(resolve, reject)
              : resolve(result);
          });
        } catch (e) {
          reject(e);
        }
      }
    });
  }
  ```

## Promise 实例上的方法

```js
class Promise {
 
 
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  static resolve(value) {
    if (value instanceof Promise) {
      // 如果是Promise实例，直接返回
      return value;
    } else {
      // 如果不是Promise实例，返回一个新的Promise对象，状态为FULFILLED
      return new Promise((resolve, reject) => resolve(value));
    }
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static all(promiseArr) {
    const len = promiseArr.length;
    const values = new Array(len);
    // 记录已经成功执行的promise个数
    let count = 0;
    return new Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        // Promise.resolve()处理，确保每一个都是promise实例
        Promise.resolve(promiseArr[i]).then(
          (val) => {
            values[i] = val;
            count++;
            // 如果全部执行完，返回promise的状态就可以改变了
            if (count === len) resolve(values);
          },
          (err) => reject(err)
        );
      }
    });
  }
  static race(promiseArr) {
    return new Promise((resolve, reject) => {
      promiseArr.forEach((p) => {
        Promise.resolve(p).then(
          (val) => resolve(val),
          (err) => reject(err)
        );
      });
    });
  }
}
```
