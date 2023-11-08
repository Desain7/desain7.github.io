---
isTimeLine: true
title: css 手写题
date: 2023-11-8
tags:
 - 手撕代码
 - css
categories:
 - 手撕代码
---

# css 手写题

## 选择器选择到第1第2个div，倒数第1倒数第2个div

选择器选择div中的div,不知道内层有多少个div，尽可能多种方法实现选择器选择到第1第2个div，倒数第1倒数第2个div

```html
<div class="container">
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
</div>
```

```css
/*法一 :nth-child() */
.cell:nth-child(1), .cell:nth-child(2), .cell:nth-last-child(1), .cell:nth-last-child(2) {
  background-color: #0af;

}
/*法二 :nth-of-type() */
.cell:nth-of-type(1), .cell:nth-of-type(2), .cell:nth-last-of-type(1), .cell:nth-last-of-type(2) {
  background-color: #bfa;
}
.bg {
  background-color: pink;
}
.cell {
  width: 100px;
  height: 100px;
  margin: 10px;
  border: 1px solid black;
}
```

```js
// 法三: js 实现
let elements = document.querySelectorAll('.cell')
elements[0].style.backgroundColor = 'pink'
elements[1].style.backgroundColor = 'pink'
elements[elements.length - 1].style.backgroundColor = 'pink'
elements[elements.length  - 2].style.backgroundColor = 'pink'
```

## 宽高比 4:3 的长方形

下面的div，需要长方形，宽高比是4：3，同时左右两边距离屏幕左右两边的间距都是50px。

```html
<div class="container">
</div>
```

