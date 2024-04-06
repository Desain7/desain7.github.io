---
isTimeLine: true
title: Vue 的响应式实现中为什么要使用 Reflect？
date: 2024-4-4
tags:
 - Vue
 - 开发经验
categories:
 - Vue
---

# Vue 的响应式实现中为什么要使用 Reflect？

## Vue3 中的响应式

在 Vue3 中，Vue 的响应式机制发生了重大变化，主要引入了 Proxy 对象来替代了 Object.defineProperty()。

我们都知道，使用 Proxy 对一个对象进行封装能够得到一个代理对象，所有对这个代理对象的操作都会触发拦截器函数，我们可以在这个拦截器函数中对原对象进行操作。

但阅读 Vue3 的源码可以发现，Vue3 中并没有在拦截器函数中直接操作原对象，而是通过 Reflect 来操作。

类似下面这样：

```js
let obj = {
  name:'desain',
  age:'0'
}
 
let handler = {
  get(target,key,receiver){
    return Reflect.get(target,key,receiver)
  },
  set(target,key,val){
    Reflect.set(target,key,val)
  },
  deleteProperty(target,key){
    return Reflect.deleteProperty(target,key)
  }
}
 
let proxyObj = new Proxy(obj,handler);
```

那么 Vue3 中为什么要这样做呢？

## 什么是 Reflect？

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 proxy handler 的方法相同。

包括以下这些：

```js
Reflect.apply(target, thisArgument, argumentsList)
Reflect.construct(target, argumentsList[, newTarget]) // 相当于new
Reflect.defineProperty(target, propertyKey, attributes)
Reflect.deleteProperty(target, propertyKey)
Reflect.get(target, propertyKey[, receiver])
Reflect.getOwnPropertyDescriptor(target, propertyKey)
Reflect.getPrototypeOf(target)
Reflect.has(target, propertyKey)
Reflect.isExtensible(target)
Reflect.ownKeys(target)
Reflect.preventExtensions(target)
Reflect.set(target, propertyKey, value[, receiver])
Reflect.setPrototypeOf(target, prototype)
```

## 为什么 Proxy 要配合 Reflect 使用？

观察上面 Proxy handler 中的方法可以发现还存在第三个参数 *receiver*，而 Reflect 的 handler 中的方法同样存在这个参数，那么这个参数是用来干嘛的呢？

```js
const proxyObj  =new Proxy(obj,{
  // get 拦截器中target表示原对象 key表示访问的属性名
  get(target, key, receiver) {
    console.log(receiver === proxyObj);
    return target[key];
  },

})
```

当对上面的代理对象执行 get 操作时，将会返回 true，说明 receiver 就是返回的那个代理对象。

那么 Reflect 中的 receiver 又是什么呢？

我们可以简单的将 *Reflect.get(target, key, receiver)* 理解为 *target[key].call(receiver)*，这里的 receiver 就是访问属性时 this 的指向。

所以使用 Reflect 就能够**保证在对原对象进行操作时，传递正确的调用者指向**。

这在普通属性的访问中可能用处不大，但当我们要操作的属性值是一个函数时，保证正确的调用者指向就很有必要了。

```js
const parent = {
  a: 1,
  get value() {
    console.log(this === child); // false
    return this.a;
  },
};
const handler = {
  get: function (obj, prop, receiver) {
    return obj[prop];
  },
  set: function (obj, prop, value, receiver) {
    obj[prop] = value;
    return true;
  },
};

const proxyObj = new Proxy(parent, handler);
const child = Object.setPrototypeOf({ a: 2 }, proxyObj);
child.value; // 1
```

另一方面，Reflect 操作对象的健壮性也要强于普通的操作，这对于一个框架来说，也是一个重要的考量。