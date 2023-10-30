---
isTimeLine: true
title: JS 常考手写题
date: 2023-10-29
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---

# JS 常考手写题

## 产生一个不重复的随机数组

利用 Math.random() 生成随机数，hash 记录随机数

```js
/**
 *
 * @param {number} len 数组长度
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns
 */
function getNumber(len, min, max) {
  const res = []
  const hash = {}
  for (let i = 0; i < len; i++) {
    let num = Math.floor(Math.random() * (max - min + 1))
    while (hash[num]) {
      num = Math.floor(Math.random() * (max - min + 1))
    }
    hash[num] = true
    res.push(num)
  }
  return res
}
```

## 递归实现 1 到 100 的累加

```js
function addNum(i) {
  if (i === 1) return 1
  return i + addNum(i - 1)
}
addNum(100)
```

## 打印出 1 到 10000 以内的对称数

利用字符串和数组的方法，判断反转前后的字符串是否相等。

```js
function dcNumber(min, max) {
  const res = []
  for (let i = min; i <= max; i++) {
    const str = String(i)
    if (str.split('').reverse().join('') === str) {
      res.push(i)
    }
  }
  return res
}
```

## 手写字符串的 IndexOf 方法

```js
String.prototype._indexOf = function (str) {
  if (str.length > this.length) {
    throw new Error('str is too long')
  }
  const firstChar = str[0]
  for (let i = 0; i < this.length; i++) {
    const left = this[i] === firstChar ? i : 0
    if (this.substring(left, left + str.length) === str) {
      return left
    }
  }
  return -1
}
```

## 请实现一个模块 math，支持链式调用math.add(2,4).minus(3).times(2)

```js
class Math {
  constructor(initVal = 0) {
    this.val = initVal
  }

  add(...args) {
    this.val += args.reduce((pre, cur) => {
      return pre + cur
    }, 0)
    return this
  }

  minus(...args) {
    this.val -= args.reduce((pre, cur) => {
      return pre + cur
    }, 0)
    return this
  }

  times(arg) {
    this.val *= arg
    return this
  }

  getVal() {
    return this.val
  }
}
```

## 手写用 Proxy 实现 arr[-1] 的访问

```js
const arr = [1, 2, 3, 4, 5]
const proxyArr = new Proxy(arr, {
  get(target, key) {
    if (key < 0) {
      // 由于默认情况下 key 都会被转换为字符串，所以需要进行一个转换
      key = parseInt(key)
      return target[target.length + key]
    }
    return target[key]
  }
})
```

## 有一堆整数，请把他们分成三份，确保每一份和尽量相等

```js
function sum(arr) {
  const res = [
    { sum: 0, arr: [] },
    { sum: 0, arr: [] },
    { sum: 0, arr: [] }
  ]
  nums = arr.sort((a, b) => b - a)
  nums.forEach((i) => {
    const add = res.sort((a, b) => a.sum - b.sum)[0]
    add.sum += i
    add.arr.push(i)
  })
  return res
}
```

## 判断一个字符串是否为驼峰字符串， judge('ByteDance','BD') -> true judge('Bytedance','BD') -> false

```js
const judge = (str, jdg) => {
  let j = 0
  for (const c of str) {
    if (c === jdg[j]) {
      j++
    }
  }
  if (j === jdg.length) {
    return true
  }
  return false
}
```

## 压缩字符串

```js
const minifyStr = (str) => {
  let res = ''
  let cur = str[0]
  let count = 0
  for (c of str) {
    if (c !== cur) {
      res += `${cur}${count}`
      cur = c
      count = 1
    } else {
      count++
    }
  }
  res += `${cur}${count}`
  return res
}
```

## 输入50a6we8y20x 输出50个a，6个we，8个y，20个x

```js
function print(str){
    return String(str).replace(/(\d+)([a-zA-Z]+)/g,function(_, number, string){
        return string.repeat(number);
    })
}
```

## 用一行代码，将数组中的字符串和字符串对象(new String(123))直接判定出来

```js
const judge = arr.filter((i) => typeof i === 'string' || i instanceof String)
```

## before

before(num,fn)接受两个参数，第一个参数是数字，第二个参数是函数，调用before函数num次数以内，返回与fn执行相同的结果，超过num次数返回最后一次fn的执行结果。

利用闭包保存当前调用次数和最后一次调用的结果。

```js
function before(num, fn) {
  let count = 0
  let res
  return (...args) => {
    if (count < num) {
      res = fn(...args)
    }
    count++
    return res
  }
}
```

## 将十进制数字转为二进制数字字符串

```js
// 内置方法
const num = 10
console.log(num.toString(2))

// 位运算符手写
const two = (num) => {
  let res = ''
  while (num) {
    const c = num & 1 ? 1 : 0
    res += c
    num >>= 1
  }
  return res.split('').reverse().join('')
}
```

## 使用多种方法构造一个包含 10 个 1 的数组

```js
// 字面量构造
let nums = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// 构造函数+填充数组
let nums = new Array(10);
nums.fill(1); 
// ES6: Array.of(),将参数依次转化为数组项
let nums = Array.of(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) 
// ES6: Array.from(),基于可迭代对象创建新数组
let str = '1111111111'
let nums = Array.from(str, (val) => parseInt(val))
// for 循环
const nums = [];
for(let i = 0; i < 10; i++) arr2[i] = 1;
```

## 移除对象中的空属性

```js
const obj = { a: null, b: '哈哈哈', c: '', d: undefined }

for (const key in obj) {
  if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
    Reflect.deleteProperty(obj, key)
  }
}
console.log(obj)
```

## 寻找页面中出现次数最多的三个标签

```js
const getTop3 = () => {
  // 获取页面中所有元素
  const domList = Array.from(document.querySelectorAll('*'))
  // 计数
  const domMap = new Map()
  domList.forEach((dom) => {
    domMap.set(dom.tagName, (domMap.get(dom.tagName) ?? 0) + 1)
  })
  // 输出前三

  const arr = Array.from(domMap)
  arr.sort((a, b) => b[1] - a[1])
  return arr.slice(0, 3)
}
```

## 解析 URL Params 为对象(hot)

```js
const url =
  'https://translate.google.com.hk/?pli=1&sl=en&tl=zh-CN&text=elint&op=translate'

function getUrlParams(url) {
  const index = url.indexOf('?')
  const params = url.slice(index + 1)
  const obj = {}
  const arr = params.split('&')
  arr.forEach((item) => {
    let [key, val] = item.split('=')
    key = decodeURIComponent(key)
    val = decodeURIComponent(val)

    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(val)
      } else {
        obj[key] = [obj[key], val]
      }
    } else {
      obj[key] = val
    }
  })
  return obj
}
```

## 颜色生成

```js
function color1() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .slice(0, 7)}`
}

function color2() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}
```

## 判断A、B数组的包含关系（值和数量），A属于B返回1，B属于A返回2，两者相等返回0，其他返回-1 

```js
function judge(arr1, arr2) {
  const str1 = arr1.sort((a, b) => a - b).join('')
  const str2 = arr2.sort((a, b) => a - b).join('')
  if (str1 === str2) {
    return 0
  }
  if (str1.includes(str2)) {
    return 2
  }
  if (str2.includes(str1)) {
    return 1
  }
  return -1
}
```

## 对象的合并

```js
// 判断是否是对象
function isObj(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
// 合并对象
function myAssign(obj1, obj2) {
  const res = { ...obj1 }
  for (const key in obj2) {
    if (isObj(res[key]) && isObj(obj2[key])) {
      res[key] = myAssign(res[key], obj2[key])
    } else {
      res[key] = obj2[key]
    }
  }
  return res
}
```

## 多行字符串转二维数组

```js
const str = ` 1 21    3
4 5  6
7   8 9 `

function toArr(str) {
  const arr = str.split('\n')
  return arr.map((item) => {
    return item.trim().split(/\s+/g)
  })
}
```

## 数组合并

```js
const arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const arr2 = ['A', 'B', 'C']

// Set 实现
function mergeArr1(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])]
}
// Filter 实现
function mergeArr2(arr1, arr2) {
  return [...arr1, ...arr2].filter((item, index, arr) => {
    return arr.indexOf(item) === index
  })
}
```

## 多维数组全排列