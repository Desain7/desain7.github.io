---
isTimeLine: true
title: 手写实现 Promise
date: 2023-8-24
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 手写实现 Promise
[Promise 简述](/interview/js/Promise简述.md)

---
1. 首先定义三种状态
* Promise 的三种状态
  - pending（等待）: 初始状态，没有完成，也没有被拒绝
  - resolved（完成）: 表示操作成功完成
  - rejectde（拒绝）: 表示操作失败
```js
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败
```
2. 