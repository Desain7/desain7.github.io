---
isTimeLine: true
title: $nextTick 的实现原理
date: 2024-2-15
tags:
 - Vue
 - 开发经验
categories:
 - Vue
---

# $nextTick 的实现原理

## nextTick 的使用

在 Vue 3 中，`nextTick` 是一个全局方法，用于在下一次 DOM 更新循环结束之后执行延迟回调函数。

它的作用是在当前代码块的同步代码执行完毕后，进行一些异步操作，以确保在更新DOM后执行某些操作。

**nextTick 的应用场景包括：**

- 异步更新 DOM 后执行操作：当需要在 Vue 实例更新了 DOM 后执行一些操作时，可以使用 nextTick。这能确保在下一次 DOM 更新循环结束后执行回调，以便操作可以正确地应用于更新后的DOM。
- 异步更新后的数据获取： 某些数据需要等待页面 DOM 更新后才能够获取到，如果直接获取会得到错误的结果。此时就可以使用 nextTick ，在页面 DOM 更新后再获取数据。

**代码示例:**

```js
// 在Vue组件中的方法中使用nextTick
methods: {
  exampleMethod() {
    // 修改数据
    this.message = 'Updated Message'

    // 在下一次DOM更新后执行回调
    this.$nextTick(() => {
      // 更新后的DOM操作
      const updatedElement = document.getElementById('my-element')
      // 执行其他操作
    })
  }
}
```

在上面的例子中，当 exampleMethod 被调用时，它会先更新 message 的值，然后在下一次 DOM 更新后执行 nextTick 的回调函数。

在回调函数中，就可以获得最新的数据并执行相关的 DOM 操作或其他操作。

## nextTick 原理及作用

Vue 中的 nextTick 本质是对 JavaScript 执行原理 EventLoop 的一种应用。

nextTick 的核心是利用如 Promise 、MutationObserver、setImmediate、setTimeout 的原生 JavaScript 方法来模拟对应的微/宏任务的实现，本质是为了利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列。

nextTick 不仅是 Vue 内部的异步队列的调用方法，同时也允许开发者在实际项目中使用这个方法来满足实际应用中对 DOM 更新数据时机的后续逻辑处理。

**为什么要引入异步更新队列机制？**

- 当需要多次对一个或多个元素赋值时，如果是同步更新，会频繁触发 UI/DOM 的渲染，影响性能。而异步更新可以收集所有的变动，最后再更新页面，能减少一些无用渲染。

- 对于 Vue 内部来说，由于 VirtualDOM 的引入，每一次状态发生变化后，状态变化的信号会发送给组件，组件内部使用 VirtualDOM 进行计算得出需要更新的具体的 DOM 节点，然后对 DOM 进行更新操作。同步更新会使每次更新状态后的渲染过程需要更多的计算，导致性能浪费。