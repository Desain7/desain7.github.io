---
isTimeLine: true
title: Promise的特点是什么，分别有什么优缺点？什么是Promise链？Promise构造函数执行和then函数执行有什么区别？
date: 2023-8-24
tags:
 - 面试
 - javascript
categories:
 - 面试
---
# Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？

## 特点

* Promise 有三种状态
  * pending（等待）: 初始状态，没有完成，也没有被拒绝
  * resolved（完成）: 表示操作成功完成
  * rejectde（拒绝）: 表示操作失败
* 如果一个 Promise 从等待状态变为其他状态就永远不能更改状态，此时的状态可称为 settled（已敲定）

## 优点

* 很好的解决了回调地狱的问题
* Promise 利用三大手段解决回调地狱：
   1. 回调函数延迟绑定
   通过将回调函数封装在一个函数中，并在异步操作完成后调用该函数并传递结果实现

   ```js
    // 异步操作返回一个 Promise 对象
    function asyncOperation() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = 'Operation result';
          resolve(result);
        }, 1000);
      });
    }

    function nextOperation(result) {
      console.log(result);
      // 执行下一个操作
    }
    // 通过 .then() 方法，在异步操作完成后执行下一个操作，若出现错误，则用 .catch() 捕获并处理
    asyncOperation()
      .then(nextOperation)
      .catch((error) => {
        console.error(error);
      });
   ```
   2. 返回值穿透
   通过一个函数返回 Promise，以链式的方式连接多个异步操作，避免嵌套回调函数

   ```js

  function asyncOperation() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = 'Operation result';
        resolve(result);
      }, 1000);
    });
  }
  // 每个 .then() 方法都返回一个新的 Promise 对象，从而将多个操作连接在一起，并在过程中完成值的传递
  asyncOperation()
    .then((result) => {
      console.log(result);
      // 执行下一个操作
      return 'Next operation result';
    })
    .then((nextResult) => {
      console.log(nextResult);
      // 执行下一个操作
    })
    .catch((error) => {
      console.error(error);
    });
   ```
   3. 错误冒泡
   通过在 Promise 链中使用 .catch() 方法来捕获和处理错误，避免它们在链中传播并导致回调地狱
   ```js
  function asyncOperation() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 若异步操作失败，就抛出错误，并将 Promise 的状态变为 rejected
        const error = new Error('Operation failed');
        reject(error);
      }, 1000);
    });
  }

  asyncOperation()
    .then((result) => {
      console.log(result);
      // 执行下一个操作
    })
    .catch((error) => {
      console.error(error);
      // 错误处理逻辑
    });
   ```

## 缺点

* 无法取消
Promise 一旦创建并开始执行后，就无法取消了
* 异常处理比较复杂
Promise 的异常处理需要通过 .catch() 方法，或在每个 .then() 方法中处处理错误来实现

## Promise链

* 每次调用 .then() 之后返回的都是一个全新的 Promise，此时又可以接着使用 .then() 方法,由此便形成了一条 Promise 链
* 在 .then() 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装

## Promise 构造函数执行和 then 函数执行有什么区别

* 构造 Promise 时，构造函数内部的代码是立即执行的（同步）
* .then() 在  Promise 对象的状态变为 resolved 时执行（异步）

:::tip
.then() 中的回调函数会被放入微任务队列中，等待 JavaScript 引擎空闲时执行
:::
