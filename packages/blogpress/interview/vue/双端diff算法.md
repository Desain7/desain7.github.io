---
isTimeLine: true
title: 双端 diff 算法
date: 2023-9-18
tags:
 - 面试经验
 - Vue 源码解析
categories:
 - 面试经验
---

# 双端 diff 算法

简单 diff 算法已经在一定程度上减少了 DOM 操作的次数，但它对 DOM 的移动操作并不是最优的。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00548.jpeg)

以上面两组节点为例，如果使用简单 Diff 算法来更新它，会发生两次 DOM 移动操作。

- 将 p-1 移动到 p-3 后面
- 将 p-2 移动到 p-1 后面

上面这种更新过程并非最优解。实际上，只要把 p-3 移动到 p-1 前面就可以完成更新，只需要完成一次 DOM 移动操作。但简单 Diff 算法并不能做到这样的更新，需要使用双端 Diff 算法。

## 双端 Diff 算法的原理

**双端 Diff 算法**是一种同时对新旧两组子节点的两个端点进行比较的算法。因此，需要四个索引值，分别指向新旧两组子节点的端点。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00550.jpeg)

代码如下：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     // 封装 patchKeyedChildren 函数处理两组子节点
06     patchKeyedChildren(n1, n2, container)
07   } else {
08     // 省略部分代码
09   }
10 }
11
12 function patchKeyedChildren(n1, n2, container) {
13   const oldChildren = n1.children
14   const newChildren = n2.children
15   // 四个索引值
16   let oldStartIdx = 0
17   let oldEndIdx = oldChildren.length - 1
18   let newStartIdx = 0
19   let newEndIdx = newChildren.length - 1
20 }
```

通过这四个索引值，就可以找到它们所指向的虚拟节点了。

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const oldChildren = n1.children
03   const newChildren = n2.children
04   // 四个索引值
05   let oldStartIdx = 0
06   let oldEndIdx = oldChildren.length - 1
07   let newStartIdx = 0
08   let newEndIdx = newChildren.length - 1
09   // 四个索引指向的 vnode 节点
10   let oldStartVNode = oldChildren[oldStartIdx]
11   let oldEndVNode = oldChildren[oldEndIdx]
12   let newStartVNode = newChildren[newStartIdx]
13   let newEndVNode = newChildren[newEndIdx]
14 }
```

有了新旧子节点中的第一个节点和最后一个节点的信息后，就可以进行双端比较了。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00551.jpeg)

对于上面这种情况，**双端比较的具体过程如下：**

1. 比较旧子节点中的*第一个*子节点 p-1 与新子节点中的*第一个*子节点 p-4，由于两者 key 值不同，因此不可复用，所以什么都不做。

2. 比较旧子节点中的*最后一个*子节点 p-4 与新子节点中的*最后一个*子节点 p-3。由于两者 key 值不同，因此不可复用，所以什么都不做。

3. 比较旧子节点中的*第一个*子节点 p-1 与新子节点中的*最后一个*子节点 p-3，由于两者 key 值不同，因此不可复用，所以什么都不做。

4. 比较旧子节点中的*最后一个*子节点 p-4 与新子节点中的*第一个*子节点 p-3，由于两者 key 值相同，所以可以进行 DOM 复用。

在第四步中，找到了相同的节点，说明它们对应的真实 DOM 节点可以复用。对于这两个节点，只需要通过 DOM 移动操作完成更新即可。

旧子节点中的最后一个子节点和新子节点中的第一个子节点相同，说明：**节点 p-4 原本是最后一个子节点，但在新的顺序中，它变成零第一个子节点。**也就是说，节点 p-4 在更新后会变成第一个子节点。**可以将索引 oldEndIdx 指向的虚拟节点对应的真实 DOM 移动到索引 oldStartIdx 指向的虚拟节点对应的真实 DOM 前。**

代码如下：

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const oldChildren = n1.children
03   const newChildren = n2.children
04   // 四个索引值
05   let oldStartIdx = 0
06   let oldEndIdx = oldChildren.length - 1
07   let newStartIdx = 0
08   let newEndIdx = newChildren.length - 1
09   // 四个索引指向的 vnode 节点
10   let oldStartVNode = oldChildren[oldStartIdx]
11   let oldEndVNode = oldChildren[oldEndIdx]
12   let newStartVNode = newChildren[newStartIdx]
13   let newEndVNode = newChildren[newEndIdx]
14
15   if (oldStartVNode.key === newStartVNode.key) {
16     // 第一步：oldStartVNode 和 newStartVNode 比较
17   } else if (oldEndVNode.key === newEndVNode.key) {
18     // 第二步：oldEndVNode 和 newEndVNode 比较
19   } else if (oldStartVNode.key === newEndVNode.key) {
20     // 第三步：oldStartVNode 和 newEndVNode 比较
21   } else if (oldEndVNode.key === newStartVNode.key) {
22     // 第四步：oldEndVNode 和 newStartVNode 比较
23     // 仍然需要调用 patch 函数进行打补丁
24     patch(oldEndVNode, newStartVNode, container)
25     // 移动 DOM 操作
26     // oldEndVNode.el 移动到 oldStartVNode.el 前面
27     insert(oldEndVNode.el, container, oldStartVNode.el)
28
29     // 移动 DOM 完成后，更新索引值，并指向下一个位置
30     oldEndVNode = oldChildren[--oldEndIdx]
31     newStartVNode = newChildren[++newStartIdx]
32   }
33 }
```

在第四步中，找到了具有相同 key 值的节点。这说明，原来处于尾部的节点在新的顺序中应该处于头部。

所以只需要以头部元素 oldStartVNode.el 作为锚点，将尾部元素oldEndVNode.el 移动到锚点前面即可。

但需要注意的是，在进行 DOM 的移动操作之前，仍然需要调用 patch 函数在新旧虚拟节点之间打补丁。

:::tip
当两个具有相同 key 值的节点需要进行位置调整时，虽然它们具有相同的 key 值，但它们的其他属性或子节点可能存在差异。如果没有调用 patch 函数进行补丁操作，那么移动节点后，新的位置上的节点可能会出现不一致的状态，导致渲染结果不符合预期。
:::

第一步 DOM 移动操作完成后，新旧子节点及真实 DOM 节点的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00553.jpeg)

此时真实 DOM 节点的顺序与新子节点的顺序还不一致，因为 Diff 算法还没有结束，还需要进行下一轮更新。

将更新逻辑封装到一个 while 循环中，代码如下：

```js
01 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
02   if (oldStartVNode.key === newStartVNode.key) {
03     // 步骤一：oldStartVNode 和 newStartVNode 比较
04   } else if (oldEndVNode.key === newEndVNode.key) {
05     // 步骤二：oldEndVNode 和 newEndVNode 比较
06   } else if (oldStartVNode.key === newEndVNode.key) {
07     // 步骤三：oldStartVNode 和 newEndVNode 比较
08   } else if (oldEndVNode.key === newStartVNode.key) {
09     // 步骤四：oldEndVNode 和 newStartVNode 比较
10     // 仍然需要调用 patch 函数进行打补丁
11     patch(oldEndVNode, newStartVNode, container)
12     // 移动 DOM 操作
13     // oldEndVNode.el 移动到 oldStartVNode.el 前面
14     insert(oldEndVNode.el, container, oldStartVNode.el)
15
16     // 移动 DOM 完成后，更新索引值，指向下一个位置
17     oldEndVNode = oldChildren[--oldEndIdx]
18     newStartVNode = newChildren[++newStartIdx]
19   }
20 }
```

每一轮更新完成后，四个索引值都会更新，所以整个 while 循环执行的条件是： 头部索引值小于等于尾部索引值。

第一轮更新结束后循环条件仍然成立，因此需要进行下一轮比较：

:::tip
也可以用 **头部节点** 代指第一个子节点， **尾部节点** 代指最后一个子节点。
:::


1. 比较旧子节点中的头部节点 p-1 与新子节点中的头部节点 p-2，由于两者 key 值不同，因此不可复用，所以什么都不做。


2. 比较旧子节点中的尾部节点 p-3 与新子节点中的尾部节点 p-3，两者 key 值相同，可以复用。由于两者位置一致，都处于尾部，因此，不需要对真实 DOM 进行移动，只需要打补丁即可，代码如下：

```js
01 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
02   if (oldStartVNode.key === newStartVNode.key) {
03     // 步骤一：oldStartVNode 和 newStartVNode 比较
04   } else if (oldEndVNode.key === newEndVNode.key) {
05     // 步骤二：oldEndVNode 和 newEndVNode 比较
06     // 节点在新的顺序中仍然处于尾部，不需要移动，但仍需打补丁
07     patch(oldEndVNode, newEndVNode, container)
08     // 更新索引和头尾部节点变量
09     oldEndVNode = oldChildren[--oldEndIdx]
10     newEndVNode = newChildren[--newEndIdx]
11   } else if (oldStartVNode.key === newEndVNode.key) {
12     // 步骤三：oldStartVNode 和 newEndVNode 比较
13   } else if (oldEndVNode.key === newStartVNode.key) {
14     // 步骤四：oldEndVNode 和 newStartVNode 比较
15     patch(oldEndVNode, newStartVNode, container)
16     insert(oldEndVNode.el, container, oldStartVNode.el)
17     oldEndVNode = oldChildren[--oldEndIdx]
18     newStartVNode = newChildren[++newStartIdx]
19   }
20 }
```

这一轮更新完成后，新旧子节点与真实 DOM节点的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00555.jpeg)

真实 DOM 的顺序相比上一轮没有发生变化，因为这一轮没有对 DOM 节点进行移动，只对 p-3 节点进行打补丁的操作。

紧接着，进行第三轮的比较：

1. 比较旧的一组子节点中的头部节点 p-1 与新的一组子节点中的头部节点 p-2，看看它们是否相同。由于两者的key 值不同，不可复用，因此什么都不做。

2. 比较旧的一组子节点中的尾部节点 p-2 与新的一组子节点中的尾部节点 p-1，看看它们是否相同，由于两者的key 值不同，不可复用，因此什么都不做。

3. ：比较旧的一组子节点中的头部节点 p-1 与新的一组子节点中的尾部节点 p-1。两者的 key 值相同，可以复用。

在第三步的比较中，找到了相同的节点，说明：**节点 p-1 原本是头部节点，但在新的顺序中，它变成了尾部节点。**

因此，需要将节点 p-1 对应的真实 DOM 移动到旧子节点的尾部节点 p-2 对应的真实 DOM 后面，并更新索引。

本轮比较结束后，两组节点及真实 DOM 的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00555.jpeg)


这一步的代码实现如下：

```js
01 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
02   if (oldStartVNode.key === newStartVNode.key) {
03   } else if (oldEndVNode.key === newEndVNode.key) {
04     patch(oldEndVNode, newEndVNode, container)
05     oldEndVNode = oldChildren[--oldEndIdx]
06     newEndVNode = newChildren[--newEndIdx]
07   } else if (oldStartVNode.key === newEndVNode.key) {
08     // 调用 patch 函数在 oldStartVNode 和 newEndVNode 之间打补丁
09     patch(oldStartVNode, newEndVNode, container)
10     // 将旧的一组子节点的头部节点对应的真实 DOM 节点 oldStartVNode.el 移动到
11     // 旧的一组子节点的尾部节点对应的真实 DOM 节点后面
12     insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
13     // 更新相关索引到下一个位置
14     oldStartVNode = oldChildren[++oldStartIdx]
15     newEndVNode = newChildren[--newEndIdx]
16   } else if (oldEndVNode.key === newStartVNode.key) {
17     patch(oldEndVNode, newStartVNode, container)
18     insert(oldEndVNode.el, container, oldStartVNode.el)
19
20     oldEndVNode = oldChildren[--oldEndIdx]
21     newStartVNode = newChildren[++newStartIdx]
22   }
23 }
```

如果旧子节点的头部节点与新子节点的尾部节点匹配，则说明该旧节点所对应的真实DOM 节点需要移动到尾部。

因此，需要获取当前尾部节点的下一个兄弟节点作为锚点，即oldEndVNode.el.nextSibling。最后，更新相关索引到下一个位置。

当前新旧子节点的头部索引和尾部索引发生重合，但仍满足循环的条件，所以还会进行下一轮的更新。

1. 比较旧子节点中的头部节点 p-2 与新子节点中的头部节点 p-2。发现两者 key 值相同，可以复用。但两者在新旧两组子节点中都是头部节点，因此不需要移动，只需要调用 patch 函数进行打补丁即可。

代码实现如下：

```js
01 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
02   if (oldStartVNode.key === newStartVNode.key) {
03     // 调用 patch 函数在 oldStartVNode 与 newStartVNode 之间打补丁
04     patch(oldStartVNode, newStartVNode, container)
05     // 更新相关索引，指向下一个位置
06     oldStartVNode = oldChildren[++oldStartIdx]
07     newStartVNode = newChildren[++newStartIdx]
08   } else if (oldEndVNode.key === newEndVNode.key) {
09     patch(oldEndVNode, newEndVNode, container)
10     oldEndVNode = oldChildren[--oldEndIdx]
11     newEndVNode = newChildren[--newEndIdx]
12   } else if (oldStartVNode.key === newEndVNode.key) {
13     patch(oldStartVNode, newEndVNode, container)
14     insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
15
16     oldStartVNode = oldChildren[++oldStartIdx]
17     newEndVNode = newChildren[--newEndIdx]
18   } else if (oldEndVNode.key === newStartVNode.key) {
19     patch(oldEndVNode, newStartVNode, container)
20     insert(oldEndVNode.el, container, oldStartVNode.el)
21
22     oldEndVNode = oldChildren[--oldEndIdx]
23     newStartVNode = newChildren[++newStartIdx]
24   }
25 }
```

这一轮更新后，新旧子节点及真实 DOM 节点的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00556.jpeg)

## 双端 Diff 算法的优势

