---
isTimeLine: true
title: 快速 diff 算法
date: 2023-9-22
tags:
 - 面试经验
 - Vue 源码解析
categories:
 - 面试经验
---

# 快速 diff 算法

## 相同的前置元素和后置元素

有别于简单 Diff 算法和双端 Diff 算法，快速 Diff 算法包含预处理步骤，这借鉴了纯文本 Diff 算法的思路。

在对两段文本进行 Diff 之前，可以先对它们进行全等比较：

```js
if(text1 === text2) {
    return true;
}
```

如果两段文本全等，就不需要进入核心 Diff 算法的步骤了，预处理的过程还会处理两端文本相同的前缀和后缀。

假设有下面两段文本：

```js
text1 = 'hello my world';
text2 = 'hello your world';
```

对于这两段文本，内容相同的部分，是不需要进行核心 Diff 操作的。因此，对于 text1 和 text2 来说，真正需要进行 Diff 操作的部分是：

```js
text1 = 'my';
text2 = 'your';
```

这样，在特定的情况下，就可以轻松地判断文本的插入和删除。

快速 Diff 算法正是借鉴了这种预处理的思路。对于下面这组节点：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00584.jpeg)

它们有相同的前置节点 p-1 和相同的后置节点 p-2 和 p-3。

对于相同的部分，由于它们在新旧两组子结点中的相对位置不变，所以不需要移动它们，只需要在它们之间打补丁。

对于前置节点，可以建立索引 j = 0，让它指向两组子节点的开头。
然后在一个 while 循环中，让 j 递增，直到遇到不同的节点。

代码如下：

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const newChildren = n2.children
03   const oldChildren = n1.children
04   // 处理相同的前置节点
05   // 索引 j 指向新旧两组子节点的开头
06   let j = 0
07   let oldVNode = oldChildren[j]
08   let newVNode = newChildren[j]
09   // while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
10   while (oldVNode.key === newVNode.key) {
11     // 调用 patch 函数进行更新
12     patch(oldVNode, newVNode, container)
13     // 更新索引 j，让其递增
14     j++
15     oldVNode = oldChildren[j]
16     newVNode = newChildren[j]
17   }
18
19 }
```

使用 while 循环查找所有相同前置节点，并在过程中调用 patch 对它们进行打补丁，直到遇到 key 不同的节点。

处理完相同的前置节点后，就要开始处理相同的后置节点了。由于新旧子节点的数量可能不同，所以需要用两个索引来表示，它们都指向新旧子节点中的最后一个节点。

同样，需要开启一个 while 循环，从后向前遍历这两组子节点，直到遇到 key 不同的节点。

代码如下：

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const newChildren = n2.children
03   const oldChildren = n1.children
04   // 更新相同的前置节点
05   let j = 0
06   let oldVNode = oldChildren[j]
07   let newVNode = newChildren[j]
08   while (oldVNode.key === newVNode.key) {
09     patch(oldVNode, newVNode, container)
10     j++
11     oldVNode = oldChildren[j]
12     newVNode = newChildren[j]
13   }
14
15   // 更新相同的后置节点
16   // 索引 oldEnd 指向旧的一组子节点的最后一个节点
17   let oldEnd = oldChildren.length - 1
18   // 索引 newEnd 指向新的一组子节点的最后一个节点
19   let newEnd = newChildren.length - 1
20
21   oldVNode = oldChildren[oldEnd]
22   newVNode = newChildren[newEnd]
23
24   // while 循环从后向前遍历，直到遇到拥有不同 key 值的节点为止
25   while (oldVNode.key === newVNode.key) {
26     // 调用 patch 函数进行更新
27     patch(oldVNode, newVNode, container)
28     // 递减 oldEnd 和 nextEnd
29     oldEnd--
30     newEnd--
31     oldVNode = oldChildren[oldEnd]
32     newVNode = newChildren[newEnd]
33   }
34
35 }
```

此时，新旧节点的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00588.jpeg)


在相同的前置和后置节点被处理完毕后，旧的一组子节点全部处理完毕，但在新子节点遗留了一个未被处理的节点 p-4。

如何让程序知道节点 p-4 是一个新增节点呢？

可以通过三个索引 j、newEnd、oldEnd 来得出这个结论：

- `oldEnd < j` 成立，说明在预处理的过程中，所有旧子节点都处理完毕了。

- `newEnd >= j` 成立， 说明预处理结束后，新子节点中，仍有未处理的节点，这些节点将被视作新增节点。

当两个条件同时成立时，说明新子节点中存在遗留节点，且它们都是新增节点，所以需要将它们挂载到正确的位置。

如何挂载到正确的位置呢？首先需要找到正确的锚点元素，观察可得新增的节点应挂载到 p-2 节点对应的真实 DOM 前。所以 p-2 对应的真实 DOM 节点就是挂载的锚点元素。

代码如下：

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const newChildren = n2.children
03   const oldChildren = n1.children
04   // 更新相同的前置节点
05   // 省略部分代码
06
07   // 更新相同的后置节点
08   // 省略部分代码
09
10   // 预处理完毕后，如果满足如下条件，则说明从 j --> newEnd 之间的节点应作为新节点插入
11   if (j > oldEnd && j <= newEnd) {
12     // 锚点的索引
13     const anchorIndex = newEnd + 1
14     // 锚点元素
15     const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
16     // 采用 while 循环，调用 patch 函数逐个挂载新增节点
17     while (j <= newEnd) {
18       patch(null, newChildren[j++], container, anchor)
19     }
20   }
21
22 }
```

若索引值大于新子节点的数量，则说明索引 newEnd 对应的节点已经是尾部节点了，此时不需要再提供锚点元素了。

得到锚点元素后，可以再一个 while 循环中遍历 j 和 newEnd 间的节点，并调用 patch 函数进行挂载。

**而对于删除节点的情况：**

以下面这组新旧子节点为例：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00590.jpeg)

对相同的前置节点和后置节点进行处理的方式与新增时相同。

处理后的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00593.jpeg)

当相同的前置节点和后置节点处理完毕后，新子节点已经全部处理完毕了，而旧子节点中遗留了一个节点 p-2。

这说明，应该对 p-2 执行卸载操作。

当遗留的节点有多个时，我们应该将索引 j 和 索引 oldEnd 间的所有节点卸载。

代码如下：

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const newChildren = n2.children
03   const oldChildren = n1.children
04   // 更新相同的前置节点
05   // 省略部分代码
06
07   // 更新相同的后置节点
08   // 省略部分代码
09
10   if (j > oldEnd && j <= newEnd) {
11     // 省略部分代码
12   } else if (j > newEnd && j <= oldEnd) {
13     // j -> oldEnd 之间的节点应该被卸载
14     while (j <= oldEnd) {
15       unmount(oldChildren[j++])
16     }
17   }
18
19 }
```

可以在之前的代码的基础上新增一个 else...if 的分支，当满足 j > newEnd && j <= oldEnd 的条件时，开启一个 while 循环，并调用 unmount 函数将它们逐个卸载。

## 判断是否需要进行 DOM 移动操作

上面的代码中，当处理完相同的前置节点或后置节点后，新旧两组子节点中总会有一组子节点全部被处理完毕，这是一种理想的情况。

实际情况往往更加复杂，如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00595.jpeg)

相同的前置节点只有 p-1，而相同的后置节点只有 p-5。

预处理结束后，新旧节点的状态如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00597.jpeg)

新旧子节点中，都存在部分节点未经处理，此时，就需要进一步处理。
与简单 Diff 算法、双端 Diff 算法相同，它们遵循同样的处理规则：

- 判断是否有节点需要移动，该如何对节点进行移动
- 找出需要被添加或移除的节点

在这种非理想情况下，相同的前置、后置节点被处理完毕后，索引 j、newEnd 和 oldEnd 不满足以下条件中的任何一个：

- j > oldEnd && j <= newEnd
- j > newEnd && j <= oldEnd

所以需要在之前的代码中增加新的 else 分支来处理：

```js
01 function patchKeyedChildren(n1, n2, container) {
02   const newChildren = n2.children
03   const oldChildren = n1.children
04   // 更新相同的前置节点
05   // 省略部分代码
06
07   // 更新相同的后置节点
08   // 省略部分代码
09
10   if (j > oldEnd && j <= newEnd) {
11     // 省略部分代码
12   } else if (j > newEnd && j <= oldEnd) {
13     // 省略部分代码
14   } else {
15     // 增加 else 分支来处理非理想情况
16   }
17
18 }
```
以下是具体的处理思路：

首先，构造一个数组 source，它的长度等于新一组子节点经过预处理后剩余未处理节点的数量，初始值为 -1。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00598.jpeg)

可以通过下面的代码完成 source 数组的构造：

```js
01 if (j > oldEnd && j <= newEnd) {
02   // 省略部分代码
03 } else if (j > newEnd && j <= oldEnd) {
04   // 省略部分代码
05 } else {
06   // 构造 source 数组
07   // 新的一组子节点中剩余未处理节点的数量
08   const count = newEnd - j + 1
09   const source = new Array(count)
10   source.fill(-1)
11 }
```

数组 source 中的每一个元素分别对应了新子节点中未被处理的节点。

它将用于存储新的一组子节点中的节点在旧的一组子节点中的位置索引，后面将会使用它计算出一个最长递增子序列，并用于辅助完成 DOM 移动的操作。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00599.jpeg)


对于新旧子节点中都存在的节点，更新 source 中的索引，旧子节点中不存在的节点则保留为 -1。

可以通过两层 for 循环来完成 source 数组的填充工作，外层循环用于遍历旧的一组子节点，内层循环用于遍历新的一组子节点。

```js
01 if (j > oldEnd && j <= newEnd) {
02   // 省略部分代码
03 } else if (j > newEnd && j <= oldEnd) {
04   // 省略部分代码
05 } else {
06   const count = newEnd - j + 1
07   const source = new Array(count)
08   source.fill(-1)
09
10   // oldStart 和 newStart 分别为起始索引，即 j
11   const oldStart = j
12   const newStart = j
13   // 遍历旧的一组子节点
14   for (let i = oldStart; i <= oldEnd; i++) {
15     const oldVNode = oldChildren[i]
16     // 遍历新的一组子节点
17     for (let k = newStart; k <= newEnd; k++) {
18       const newVNode = newChildren[k]
19       // 找到拥有相同 key 值的可复用节点
20       if (oldVNode.key === newVNode.key) {
21         // 调用 patch 进行更新
22         patch(oldVNode, newVNode, container)
23         // 最后填充 source 数组
24         source[k - newStart] = i
25       }
26     }
27   }
28 }
```

由于数组 source 的索引是从 0 开始的，而未处理节点的索引未必从 0 开始，所以在填充数组时需要使用表达式 k -newStart 的值作为数组的索引值。

外层循环的变量 i 就是当前节点在旧的一组子节点中的位置索引，因此直接将变量 i 的值赋给source[k - newStart] 即可。

上面的代码依然存在问题，由于使用了双层 for 循环，在新旧子节点的数量较多时，这会带来性能问题。

可以为新节点构建一张索引表，用于存储节点的 key 和节点位置索引间的映射，从而避免使用双层 for 循环。如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00600.jpeg)

通过索引表，可以快速地填充 source 数组。

```js
01 if (j > oldEnd && j <= newEnd) {
02   // 省略部分代码
03 } else if (j > newEnd && j <= oldEnd) {
04   // 省略部分代码
05 } else {
06   const count = newEnd - j + 1
07   const source = new Array(count)
08   source.fill(-1)
09
10   // oldStart 和 newStart 分别为起始索引，即 j
11   const oldStart = j
12   const newStart = j
13   // 构建索引表
14   const keyIndex = {}
15   for(let i = newStart; i <= newEnd; i++) {
16     keyIndex[newChildren[i].key] = i
17   }
18   // 遍历旧的一组子节点中剩余未处理的节点
19   for(let i = oldStart; i <= oldEnd; i++) {
20     oldVNode = oldChildren[i]
21     // 通过索引表快速找到新的一组子节点中具有相同 key 值的节点位置
22     const k = keyIndex[oldVNode.key]
23
24     if (typeof k !== 'undefined') {
25       newVNode = newChildren[k]
26       // 调用 patch 函数完成更新
27       patch(oldVNode, newVNode, container)
28       // 填充 source 数组
29       source[k - newStart] = i
30     } else {
31       // 没找到
32       unmount(oldVNode)
33     }
34   }
35 }
```

source 数组填充完毕后，就应该判断节点是否需要移动了。

快速 Diff 算法判断节点是否需要移动地方法和简单 Diff 算法类似，如下所示：

```js
01 if (j > oldEnd && j <= newEnd) {
02   // 省略部分代码
03 } else if (j > newEnd && j <= oldEnd) {
04   // 省略部分代码
05 } else {
06   // 构造 source 数组
07   const count = newEnd - j + 1  // 新的一组子节点中剩余未处理节点的数量
08   const source = new Array(count)
09   source.fill(-1)
10
11   const oldStart = j
12   const newStart = j
13   // 新增两个变量，moved 和 pos
14   let moved = false
15   let pos = 0
16
17   const keyIndex = {}
18   for(let i = newStart; i <= newEnd; i++) {
19     keyIndex[newChildren[i].key] = i
20   }
21   for(let i = oldStart; i <= oldEnd; i++) {
22     oldVNode = oldChildren[i]
23     const k = keyIndex[oldVNode.key]
24
25     if (typeof k !== 'undefined') {
26       newVNode = newChildren[k]
27       patch(oldVNode, newVNode, container)
28       source[k - newStart] = i
29       // 判断节点是否需要移动
30       if (k < pos) {
31         moved = true
32       } else {
33         pos = k
34       }
35     } else {
36       unmount(oldVNode)
37     }
38   }
39 }
```

在上面这段代码中，新增了两个变量 moved 和 pos。前者的初始值为 false，代表是否需要移动节点，后者的初始值为 0，代表遍历旧的一组子节点的过程中遇到的最大索引值 k。

如果在遍历过程中遇到的索引值呈现递增趋势，则说明不需要移动节点，反之则需要。

所以在第二个 for 循环内，需要通过比较变量 k 与变量 pos 的值来判断是否需要移动节点。

除此之外，还需要一个数量标识，用于表示**已经更新过的节点数量**。这个值应该小于新子节点中需要更新的节点数量。

一旦前者超过后者，则说明有多余的节点，要到将它们卸载。

代码如下：

```js
01 if (j > oldEnd && j <= newEnd) {
02   // 省略部分代码
03 } else if (j > newEnd && j <= oldEnd) {
04   // 省略部分代码
05 } else {
06   // 构造 source 数组
07   const count = newEnd - j + 1
08   const source = new Array(count)
09   source.fill(-1)
10
11   const oldStart = j
12   const newStart = j
13   let moved = false
14   let pos = 0
15   const keyIndex = {}
16   for(let i = newStart; i <= newEnd; i++) {
17     keyIndex[newChildren[i].key] = i
18   }
19   // 新增 patched 变量，代表更新过的节点数量
20   let patched = 0
21   for(let i = oldStart; i <= oldEnd; i++) {
22     oldVNode = oldChildren[i]
23     // 如果更新过的节点数量小于等于需要更新的节点数量，则执行更新
24     if (patched <= count) {
25       const k = keyIndex[oldVNode.key]
26       if (typeof k !== 'undefined') {
27         newVNode = newChildren[k]
28         patch(oldVNode, newVNode, container)
29         // 每更新一个节点，都将 patched 变量 +1
30         patched++
31         source[k - newStart] = i
32         if (k < pos) {
33           moved = true
34         } else {
35           pos = k
36         }
37       } else {
38         // 没找到
39         unmount(oldVNode)
40       }
41     } else {
42       // 如果更新过的节点数量大于需要更新的节点数量，则卸载多余的节点
43       unmount(oldVNode)
44     }
45   }
46 }
```

在上面这段代码中，增加了 patched 变量，其初始值为 0，代表更新过的节点数量。

接着，在第二个 for 循环中增加了判断patched <= count，如果此条件成立，则正常执行更新，并且每次更新后都让变量 patched 自增；否则说明剩余的节点都是多余的，就调用 unmount 函数将它们卸载。

## 如何移动元素

现在已经实现了两个目标：

- 判断是否需要进行 DOM 移动操作。当 moved 为 true 时，说明需要进行 DOM 移动操作。
- 构建 source 数组。该数组的长度等于新的一组子节点去掉相同的前置/后置节点后，剩余未处理节点的数量。

接下来，需要进行 DOM 移动操作：

```js
01 if (j > oldEnd && j <= newEnd) {
02   // 省略部分代码
03 } else if (j > newEnd && j <= oldEnd) {
04   // 省略部分代码
05 } else {
06   // 省略部分代码
07   for(let i = oldStart; i <= oldEnd; i++) {
08     // 省略部分代码
09   }
10
11   if (moved) {
12     // 如果 moved 为 true，则需要进行 DOM 移动操作
13   }
14 }
```

为了进行 DOM 移动操作，还需要根据 source 数组计算出它的最长递增子序列。

:::tip
简单来说，给定一个数值序列，找到它的一个子序列，并且该子序列中的值是递增的，子序列中的元素在原序列中不一定连续。一个序列可能有很多个递增子序列，其中最长的那一个就称为最长递增子序列。
:::

```js
01 if (moved) {
02   // 计算最长递增子序列
03   const seq = lis(sources) // [ 0, 1 ]
04 }
```

在上面的代码中，使用 lis 函数计算一个数组的最长递增子序列。lis 函数接收 source 数组作为参数，并返回 source 数组的最长递增子序列之一。

:::tip
lis 函数的返回结果是最长递增子序列中的元素在 source 数组中的位置索引。
:::

有了最长递增子序列的索引信息后，下一步要重新对节点进行编号，如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00603.jpeg)

在编号时，忽略了经过预处理的节点 p-1 和 p-5。所以，索引为 0 的节点是 p-2，而索引为 1 节点是 p-3，以此类推。

重新编号是为了让子序列 seq 与新的索引值产生对应关系。其实，最长递增子序列 seq 拥有一个非常重要的意义。

以上例来说，子序列 seq 的值为 [0, 1]，它的含义是：在新的一组子节点中，重新编号后索引值为 0 和 1 的这两个节点在更新前后顺序没有发生变化。

换句话说，重新编号后，索引值为 0 和 1 的节点不需要移动。

在新的一组子节点中，节点 p-3 的索引为 0，节点 p-4 的索引为1，所以节点 p-3 和 p-4 所对应的真实 DOM 不需要移动。

换句话说，只有节点 p-2 和 p-7 可能需要移动。

为了完成节点的移动，还需要创建两个索引值 i 和 s：

- 用索引 i 指向新的一组子节点中的最后一个节点
- 用索引 s 指向最长递增子序列中的最后一个元素

如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00604.jpeg)

然后，开启一个 for 循环，让变量 i 和 s 开始移动，如下：

```js
01 if (moved) {
02   const seq = lis(sources)
03
04   // s 指向最长递增子序列的最后一个元素
05   let s = seq.length - 1
06   // i 指向新的一组子节点的最后一个元素
07   let i = count - 1
08   // for 循环使得 i 递减，即按照上图中箭头的方向移动
09   for (i; i >= 0; i--) {
10     if (i !== seq[s]) {
11       // 如果节点的索引 i 不等于 seq[s] 的值，说明该节点需要移动
12     } else {
13       // 当 i === seq[s] 时，说明该位置的节点不需要移动
14       // 只需要让 s 指向下一个位置
15       s--
16     }
17   }
18 }
```

在 for 循环内，判断条件 i !==seq[s]，如果节点的索引 i 不等于 seq[s] 的值，则说明该节点对应的真实 DOM 需要移动，否则说明当前访问的节点不需要移动，但要让 s 指向下一个位置。

按照上面的思路执行代码，初始时索引 i 指向节点 p-7。由于 p-7 对应的 source 数组中相同位置的元素值为 -1，所以应该将 p-7 作为全新的节点进行挂载。

代码如下：

```js
01 if (moved) {
02   const seq = lis(sources)
03
04   // s 指向最长递增子序列的最后一个元素
05   let s = seq.length - 1
06   // i 指向新的一组子节点的最后一个元素
07   let i = count - 1
08   // for 循环使得 i 递减，即按照图 11-24 中箭头的方向移动
09   for (i; i >= 0; i--) {
10     if (source[i] === -1) {
11       // 说明索引为 i 的节点是全新的节点，应该将其挂载
12       // 该节点在新 children 中的真实位置索引
13       const pos = i + newStart
14       const newVNode = newChildren[pos]
15       // 该节点的下一个节点的位置索引
16       const nextPos = pos + 1
17       // 锚点
18       const anchor = nextPos < newChildren.length
19         ? newChildren[nextPos].el
20         : null
21       // 挂载
22       patch(null, newVNode, container, anchor)
23     } else if (i !== seq[s]) {
24       // 如果节点的索引 i 不等于 seq[s] 的值，说明该节点需要移动
25     } else {
26       // 当 i === seq[s] 时，说明该位置的节点不需要移动
27       // 只需要让 s 指向下一个位置
28       s--
29     }
30   }
31 }
```

如果 source[i] 的值为 -1，则说明索引为 i 的节点是全新的节点，于是调用 patch 函数将其挂载到容器中。

这里需要注意的是，由于索引 i 是重新编号后的，因此为了得到真实索引值，需要先计算表达式 i + newStart 的值。

此时 for 循环已经执行了一次，索引 i 向上移动一次，指向节点 p-2。如下：

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00605.jpeg)

进入下一轮 for 循环：

1. 判断 source[i] 是否等于 -1？很明显，此时索引 i 的值为 2，source[2] 的值等于 1，因此节点 p-2 不是全新的节点，不需要挂载它，进行下一步的判断。

2. 判断 i !== seq[s] 是否成立？此时索引 i 的值为 2，索引 s 的值为 1。因此 2 !== seq[1] 成立，节点 p-2 所对应的真实 DOM 需要移动。

移动 p-2 对应的真实 DOM 的过程如下:

```js
01 if (moved) {
02   const seq = lis(sources)
03
04   // s 指向最长递增子序列的最后一个元素
05   let s = seq.length - 1
06   let i = count - 1
07   for (i; i >= 0; i--) {
08     if (source[i] === -1) {
09       // 省略部分代码
10     } else if (i !== seq[s]) {
11       // 说明该节点需要移动
12       // 该节点在新的一组子节点中的真实位置索引
13       const pos = i + newStart
14       const newVNode = newChildren[pos]
15       // 该节点的下一个节点的位置索引
16       const nextPos = pos + 1
17       // 锚点
18       const anchor = nextPos < newChildren.length
19         ? newChildren[nextPos].el
20         : null
21       // 移动
22       insert(newVNode.el, container, anchor)
23     } else {
24       // 当 i === seq[s] 时，说明该位置的节点不需要移动
25       // 并让 s 指向下一个位置
26       s--
27     }
28   }
29 }
```

移动节点的实现思路类似于挂载全新的节点。不同点在于，移动节点是通过 insert 函数来完成的。

以下是 Vue3 实现求解给定序列的最长递增子序列的代码:

```js
01 function getSequence(arr) {
02   const p = arr.slice()
03   const result = [0]
04   let i, j, u, v, c
05   const len = arr.length
06   for (i = 0; i < len; i++) {
07     const arrI = arr[i]
08     if (arrI !== 0) {
09       j = result[result.length - 1]
10       if (arr[j] < arrI) {
11         p[i] = j
12         result.push(i)
13         continue
14       }
15       u = 0
16       v = result.length - 1
17       while (u < v) {
18         c = ((u + v) / 2) | 0
19         if (arr[result[c]] < arrI) {
20           u = c + 1
21         } else {
22           v = c
23         }
24       }
25       if (arrI < arr[result[u]]) {
26         if (u > 0) {
27           p[i] = result[u - 1]
28         }
29         result[u] = i
30       }
31     }
32   }
33   u = result.length
34   v = result[u - 1]
35   while (u-- > 0) {
36     result[u] = v
37     v = p[v]
38   }
39   return result
40 }
```
