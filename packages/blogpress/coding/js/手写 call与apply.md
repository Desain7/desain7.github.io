---
isTimeLine: true
title: 手写实现 call、apply 方法
date: 2023-8-25
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---

# 手写实现 call、apply 方法

## call 方法和 apply 方法的区别

1. 参数传递方式：

call 方法接受的参数是作为函数调用时的参数一一传递的，通过逗号分隔。

例如：`func.call(context, arg1, arg2, ...)`。

apply 方法接受的参数是一个数组或类数组对象，数组中的元素作为函数调用时的参数传递。

例如：`func.apply(context, [arg1, arg2, ...])`。

2. 参数数量：

call 方法的参数数量是固定的，需要按照实际参数的个数逐个传递。

apply 方法可以接受任意数量的参数，只需要将参数以数组的形式传递。

3. 使用方式：

call 方法在调用时，参数需要逐个列举出来，适合已知参数个数的情况。

apply 方法在调用时，参数以数组形式传递，适合参数数量不确定或已经存在数组的情况。

*用例：*

假设有一个函数 greet 和一个对象 person：

```js
function greet(message, punctuation) {
  console.log(`${message} ${this.name}${punctuation}`);
}

const person = {
  name: 'John',
};
```

分别使用 call 和 apply 方法来调用 greet 函数

```js
// 使用 call 方法调用 greet 函数
greet.call(person, 'Hello', '!');

// 使用 apply 方法调用 greet 函数
greet.apply(person, ['Hello', '!']);
```

:::tip
除了参数传递方式的不同，二者在其他方面的行为是类似的，得到的结果也是相同的
:::

## 实现 call 方法

1. 将 call 通过原型链的方式添加到 Function 的 Prototype 上，确保所有函数都能调用该方法
2. 将提供给 call 方法的对象作为函数的上下文，参数作为函数的参数
3. 在 call 方法内部通过 this 引用调用了 call 的函数
4. 将该引用赋值为对象的方法，调用方法得到结果
5. 从对象上删除该方法，返回结果

:::tip
由于 this 引用得到的函数不能直接调用，所以将它暂时作为对象上的方法，为了避免与原对象上的方法或属性名重复，故将 symbol 作为方法名
:::

```js
Function.prototype.myCall = function (ctx, ...args) {
  const fn = Symbol('fn')
  // 若传入的对象为空，则使用 window 对象
  ctx = ctx || window;
  ctx[fn] = this
  const res = ctx[fn](...args)
  delete ctx[fn]
  return res
}

```

## 实现 apply 方法

具体实现和 call 方法类似

```js
Function.prototype.myApply = function (ctx, args) {
  const fn = Symbol('fn');
  ctx = ctx || window;
  ctx[fn] = this;

  let result;
  if (Array.isArray(args)) {
    result = ctx[fn](...args);
  } else {
    // 如果传给 apply 方法的第二个参数不是数组或类数组对象，那么就直接执行函数
    result = ctx[fn]();
  }

  delete ctx[fn];

  return result;
};

```
