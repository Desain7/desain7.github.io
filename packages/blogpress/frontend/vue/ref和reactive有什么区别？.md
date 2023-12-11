---
isTimeLine: true
title: ref 和 reactive 有什么区别？
date: 2023-12-11
tags:
 - Vue
 - 开发经验
categories:
 - Vue
---

# ref 和 reactive 有什么区别？

**语法上：**

- ref 接受一个初始值作为参数，并返回一个包装了响应式数据的引用对象。
- reactive 接受一个普通对象作为参数，并返回一个响应式代理对象。

- ref 主要用于包装基本类型数据，而 reactive 用于包装对象类型数据。

```js
// ref
const count = ref(0)
console.log(count.value) // 0
​
count.value++
console.log(count.value) // 1

// reactive
const obj = reactive({ count: 0 })
obj.count++
```

**实现上：**

- ref

1. ref 使用了一个名为 RefImpl 的类来表示响应式数据。这个类内部有一个 _value 属性，用于保存具体的值。

```js
class RefImpl {
  constructor(value) {
    this._value = value;
  }

  get value() {
    // 在读取值时，触发依赖收集，追踪该响应式数据的依赖关系
    track(this, TrackOpTypes.GET, 'value');
    return this._value;
  }

  set value(newValue) {
    // 在修改值时，更新内部的值，并触发依赖更新
    this._value = newValue;
    trigger(this, TriggerOpTypes.SET, 'value', newValue);
  }
}
```

2. 通过调用 ref 函数创建的响应式引用对象实际上是 RefImpl 类的实例，其 _value 属性保存传入的初始值。
3. 当访问响应式引用对象的值时，实际上是访问了 _value 属性。而当修改值时，会更新 _value 属性，并触发依赖更新。


- reactive

- reactive 使用了 Vue 3 的 Proxy 和 Reflect 特性来创建响应式代理对象。
- 当调用 reactive 函数时，会将传入的普通对象转换为响应式代理对象。这个代理对象会拦截对对象属性的访问和修改操作，并触发依赖更新。
- 在代理对象的内部，Proxy 通过 get 拦截器来监听对属性的访问操作，set 拦截器来监听对属性的修改操作，并通过 Reflect 来实际读取和写入属性值。

**使用上：**

- ref 返回的响应式数据在 JS 中使用需要加上 .value 才能访问其值，在视图中使用会自动脱 ref，不需要 .value。

- ref 同样可以接收对象或数组等非原始值，但内部依然是使用 reactive 实现响应式。

- reactive 内部如果接收的是一个 Ref 对象会自动脱 ref。

- 使用展开运算符(...)展开 reactive 返回的响应式对象会使其失去响应性，可以结合 toRefs() 将值转换为Ref对象之后再展开。
