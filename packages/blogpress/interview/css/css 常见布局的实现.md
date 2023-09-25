---
isTimeLine: true
title: css 常见布局的实现
date: 2023-9-24
tags:
 - 面试经验
 - Css
categories:
 - 面试经验
---

# css 常见布局的实现

## 单行、多行文本溢出隐藏

**单行文本溢出** 

```css
.single {
  overflow: hidden;            // 溢出隐藏
  text-overflow: ellipsis;      // 溢出用省略号显示
  white-space: nowrap;         // 规定段落中的文本不进行换行
}

```

**多行文本溢出**

```css
.multi {
  overflow: hidden;            // 溢出隐藏
  text-overflow: ellipsis;     // 溢出用省略号显示
  display:-webkit-box;         // 作为弹性伸缩盒子模型显示。
  -webkit-box-orient:vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
  -webkit-line-clamp:3;        // 显示的行数
}

```

## 两栏布局的实现

> 页面中共两栏，左边一栏宽度固定，右边一栏宽度自适应。

1. 浮动 + margin

- 左侧元素给定一个宽度，并设置向左浮动。
- 右侧元素 margin-left 设置为左侧元素的宽度。

```css
.outer {
  height: 100px;
}
.left {
  float: left;
  width: 200px;
  background: tomato;
}
.right {
  margin-left: 200px;
  width: auto;
  background: gold;
}

```

2. 浮动 + BFC

- 左侧元素左浮动
- 右侧元素开启 BFC

```css
.left{
  width: 100px;
  height: 200px;
  background: red;
  float: left;
 }
 .right{
  height: 300px;
  background: blue;
  overflow: hidden;
 }
```

3. flex 布局

- 父元素开启 flex 布局
- 左侧元素固定宽度
- 右侧元素设置 flex 为 1

```css
.outer {
  display: flex;
  height: 100px;
}
.left {
  width: 200px;
  background: tomato;
}
.right {
  flex: 1;
  background: gold;
}
```

4. 绝对定位 + margin

- 父元素设置相对定位
- 左侧元素设置绝对定位，给定宽度
- 右侧元素 margin-left 设置为左侧元素宽度

```css
.outer {
  position: relative;
  height: 100px;
}
.left {
  position: absolute;
  width: 200px;
  background: tomato;
}
.right {
  margin-left: 200px;
  background: gold;
}
```

5. 绝对定位

- 父元素设置相对定位
- 左侧元素给定宽度
- 右侧元素设置绝对定位，left 为左侧元素宽度，其余方向设置为 0

## 三栏布局的实现

> 页面中共有三栏，左右两栏宽度固定，中间一栏自适应

1. 绝对定位 + margin

- 左右两栏设置为绝对定位，给定宽度
- 中间栏 margin 设置为对应方向的宽度

```css
.outer {
  position: relative;
  height: 100px;
}

.left {
  position: absolute;
  width: 100px;
  height: 100px;
  background: tomato;
}

.right {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 100px;
  background: gold;
}

.center {
  margin-left: 100px;
  margin-right: 200px;
  height: 100px;
  background: lightgreen;
}
```

2. flex 布局

- 父级元素开启 flex 布局
- 左右元素固定大小
- 中间元素 flex 设置为 1

```css
.outer {
  display: flex;
  height: 100px;
}

.left {
  width: 100px;
  background: tomato;
}

.right {
  width: 100px;
  background: gold;
}

.center {
  flex: 1;
  background: lightgreen;
}
```

3. 浮动 + margin

- 左右两栏给定宽度，并设置对应方向的浮动
- 中间栏 margin 设置为对应方向的宽度
- **中间栏必须放在最后**

4. 圣杯布局（浮动 + 定位 + 负边距）

- 父元素设置左右的 padding，使中间内容元素不受左右影响
- 三栏均向左浮动
- 中间栏宽度设置为父元素的宽度，此时其他栏会被挤到下一行
- 为左右两栏设置 margin 负值，将它们移动到上一行，并利用相对定位将它们定位到两边

```html
<div class="container">
  <div class="content"></div>
  <div class="left-sidebar"></div>
  <div class="right-sidebar"></div>
</div>
```

```css

.container {
  padding-left: 200px; /* 左侧边栏宽度 */
  padding-right: 250px; /* 右侧边栏宽度 */
  height: 100vh;
}

.left-sidebar, .content, .right-sidebar {
  float: left;
  height: 100vh;
}

.content {
  width: 100%;
  background-color: #0af;
}

.left-sidebar {
  width: 200px;
  margin-left: -100%;
  position: relative;
  left: -200px;
  background-color: #0fa;
}

.right-sidebar {
  width: 250px;
  margin-left: -250px;
  position: relative;
  right: -250px;
  background-color: #fa0;
}
```

5. 双飞翼布局（浮动 + 定位 + 负边距）

:::tip
双飞翼布局与圣杯布局的不同之处在于，双飞翼布局的中间 content 部分多了一个子容器存在，通过控制 content 的子容器的 margin 或者 padding 空出左右两列的宽度。
:::

```html
<div class="container">
  <div class="content-container">
    <div class="content"></div>
  </div>
  <div class="left-sidebar"></div>
  <div class="right-sidebar"></div>
</div>
```


```css
.container {
  height: 100vh;
}

.left-sidebar, .content, .right-sidebar {
  float: left;
  height: 100vh;
}

.left-sidebar {
  margin-left: -100%;
  width: 250px;
  background: tomato;
}

.right-sidebar {
  margin-left: -250px;
  width: 250px;
  background: gold;
}

.content-container {
  float: left;
  width: 100%;
  height: 100vh;
  background: lightgreen;
}

/* 与圣杯布局最大的不同，内容区域两边的内容由其中的子元素空出 */
.content {
  margin: 0 250px;
  height: 100vh;
}
```

## 水平垂直居中的实现

1. 绝对定位 + transform

```css
.parent { 
  position: relative;
} 
.child {
  position: absolute; 
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
```

2. 绝对定位 + 方向

> 适用于盒子有宽高的情况

- 利用绝对定位，设置四个方向的值都为 0，并将margin设置为auto
- 由于宽高固定，因此对应方向实现平分，可以实现水平和垂直方向上的居中。

```css
.parent {
  position: relative;
}
 
.child {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
```

3. 绝对定位 + margin

> 适用于盒子宽高已知的情况

```css
.parent {
  position: relative;
}
 
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;     /* 自身 height 的一半 */
  margin-left: -50px;    /* 自身 width 的一半 */
}

```

4. flex 布局

> 父元素开启 flex 布局后，子元素的 margin 设置为 auto

```css
.parent {
    display: flex;
    justify-content:center;
    align-items:center;
}
```