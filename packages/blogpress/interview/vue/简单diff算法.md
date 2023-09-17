---
isTimeLine: true
title: 简单 diff 算法
date: 2023-9-15
tags:
 - 面试经验
 - Vue 源码解析
categories:
 - 面试经验
---

# 简单 diff 算法

## 减少 DOM 操作的性能开销

对于下面两组虚拟节点：

```js
// 旧 vnode
const oldVNode = {
   type: 'div',
   children: [
     { type: 'p', children: '1' },
     { type: 'p', children: '2' },
     { type: 'p', children: '3' }
   ]
 }

 // 新 vnode
 const newVNode = {
   type: 'div',
   children: [
     { type: 'p', children: '4' },
     { type: 'p', children: '5' },
     { type: 'p', children: '6' }
   ]
 }
```

当我们按照常规的 Patch 操作来更新子节点时，需要执行 6 次 DOM 操作。

 - 卸载所有旧子节点，需要 3 次 DOM 删除操作；
 - 挂载所有新子节点，需要 3 次 DOM 添加操作。

然而，上面的两组虚拟节点在更新前后，标签元素并没有发生变化，只有 p 标签的子节点（文本节点）发生了变化。

所以，最理想的更新方式是，直接更新这个 p 标签的文本节点的内容。这样只需要一次 DOM 操作，即可完成一个 p 标签更新。

对于上面这种情况，只需要执行 3 次 DOM 操作就可以完成全部节点的更新，性能相比原来提升了一倍。

我们可以对 patchChildren 函数进行更新：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     // 重新实现两组子节点的更新方式
06     // 新旧 children
07     const oldChildren = n1.children
08     const newChildren = n2.children
09     // 遍历旧的 children
10     for (let i = 0; i < oldChildren.length; i++) {
11       // 调用 patch 函数逐个更新子节点
12       patch(oldChildren[i], newChildren[i])
13     }
14   } else {
15     // 省略部分代码
16   }
17 }
```

但上面的方法仍存在弊端，当新旧节点数量不一致时，他将无法正常秩序。

当新节点多于旧节点时，我们要对多出的部分执行挂载操作；同理，当旧节点多于新节点时，我们要对多出的部分执行卸载操作。

所以我们应该始终遍历较短的那组子节点，对上面的代码进行更新：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     const oldChildren = n1.children
06     const newChildren = n2.children
07     // 旧的一组子节点的长度
08     const oldLen = oldChildren.length
09     // 新的一组子节点的长度
10     const newLen = newChildren.length
11     // 两组子节点的公共长度，即两者中较短的那一组子节点的长度
12     const commonLength = Math.min(oldLen, newLen)
13     // 遍历 commonLength 次
14     for (let i = 0; i < commonLength; i++) {
15       patch(oldChildren[i], newChildren[i], container)
16     }
17     // 如果 newLen > oldLen，说明有新子节点需要挂载
18     if (newLen > oldLen) {
19       for (let i = commonLength; i < newLen; i++) {
20         patch(null, newChildren[i], container)
21       }
22     } else if (oldLen > newLen) {
23       // 如果 oldLen > newLen，说明有旧子节点需要卸载
24       for (let i = commonLength; i < oldLen; i++) {
25         unmount(oldChildren[i])
26       }
27     }
28   } else {
29     // 省略部分代码
30   }
31 }
```

## DOM 复用与 key 的作用

对于下面两组虚拟节点，上面的方法依然存在很大的弊端：

```js
01 // oldChildren
02 [
03   { type: 'p' },
04   { type: 'div' },
05   { type: 'span' }
06 ]
07
08 // newChildren
09 [
10   { type: 'span' },
11   { type: 'p' },
12   { type: 'div' }
13 ]
```

我们仍然需要执行六次 DOM 操作来完成更新，但实际上，我们只需要对 DOM 节点进行移动来完成更新。

但是，想要通过 DOM 的移动来完成更新，必须要保证一个前提：新旧两组子节点中的确存在可复用的节点。

我们可以通过 vnode.type 来判断子节点是否相同。不过这种判断方式仍然有问题，对于下面的例子：

```js
01 // oldChildren
02 [
03   { type: 'p', children: '1' },
04   { type: 'p', children: '2' },
05   { type: 'p', children: '3' }
06 ]
07
08 // newChildren
09 [
10   { type: 'p', children: '3' },
11   { type: 'p', children: '1' },
12   { type: 'p', children: '2' }
13 ]
```

我们可以通过移动 DOM 来对上面的节点完成更新，但这两组节点的 vnode.type 的属性值相同。所以，我们无法确认新旧两组子节点中节点的对应关系，也就无法对它们进行移动了。

此时，我们可以引入额外的 key 作为 vnode 的标识。

```js
01 // oldChildren
02 [
03   { type: 'p', children: '1', key: 1 },
04   { type: 'p', children: '2', key: 2 },
05   { type: 'p', children: '3', key: 3 }
06 ]
07
08 // newChildren
09 [
10   { type: 'p', children: '3', key: 3 },
11   { type: 'p', children: '1', key: 1 },
12   { type: 'p', children: '2', key: 2 }
13 ]
```

key 属性就像虚拟节点的“身份证”号，只要两个虚拟节点的 type 属性值和 key 属性值都相同，那么我们就认为它们是相同的，即可以进行 DOM 的复用。

根据子节点的 key 属性，明确知道了新子节点在旧子节点中的位置，就可以进行相应的 DOM 移动操作了。

```js
01 const oldVNode = { type: 'p', key: 1, children: 'text 1' }
02 const newVNode = { type: 'p', key: 1, children: 'text 2' }
```

DOM 可复用并不意味着不需要更新，我们可能仍需要对这两个虚拟节点进行 patch 操作。

对 patchChildren 再次进行更新：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     const oldChildren = n1.children
06     const newChildren = n2.children
07
08     // 遍历新的 children
09     for (let i = 0; i < newChildren.length; i++) {
10       const newVNode = newChildren[i]
11       // 遍历旧的 children
12       for (let j = 0; j < oldChildren.length; j++) {
13         const oldVNode = oldChildren[j]
14         // 如果找到了具有相同 key 值的两个节点，说明可以复用，但仍然需要调用 patch 函数更新
15         if (newVNode.key === oldVNode.key) {
16           patch(oldVNode, newVNode, container)
17           break // 这里需要 break
18         }
19       }
20     }
21
22   } else {
23     // 省略部分代码
24   }
25 }
```

在上面的代码中，使用了两层 for 循环，外层循环用于遍历新的一组子节点，内层循环则遍历旧的一组子节点。

在内层循环中，我们逐个对比新旧子节点的 key 值，试图在旧的子节点中找到可复用的节点。一旦找到，则调用 patch 函数进行打补丁。

## 找到需要移动的元素

通过 key 值找到可复用的节点后，我们需要思考如何判断一个节点是否需要移动，以及如何移动。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00533.jpeg)

我们对上面的节点执行更新算法，并在这个过程中，每一次寻找可复用的节点时，都记录该可复用节点在旧的一组子节点中的位置索引。

如果把这些位置索引值按照先后顺序排列，则可以得到一个序列。如果一个递增的序列，则不需要移动任何节点。

下面是执行流程：

1. 第一步：

- 取新的一组子节点中的第一个节点 p-3，它的 key 为 3。
- 尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 2。

2. 第二步：

- 取新的一组子节点中的第二个节点 p-1，它的 key 为 1。
- 尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 0。
- 此时，可以发现索引值递增的顺序被打破了。节点 p-1 在旧 children 中的索引是 0，它小于节点 p-3 在旧 children 中的索引 2。
- 这说明节点 p-1 在旧 children 中排在节点 p-3前面，但在新的 children 中，它排在节点 p-3 后面。
- 因此，我们能够得出一个结论：节点 p-1 对应的真实 DOM 需要移动。

3. 第三步：

- 取新的一组子节点中的第三个节点 p-2，它的 key 为 2。尝试在旧的一组子节点中找到具有相同 key 值的可复用节点，发现能够找到，并且该节点在旧的一组子节点中的索引为 1。
- 此时，可以发现节点 p-2 在旧 children 中的索引 1 要小于节点 p-3 在旧 children 中的索引 2。
- 这说明，节点 p-2 在旧 children 中排在节点 p-3 前面，但在新的 children 中，它排在节点 p-3 后面。
- 因此，节点 p-2 对应的真实DOM 也需要移动。

**以上就是 Diff 算法在执行更新的过程中，判断节点是否需要移动的方式。**

我们可以将节点 p-3 在旧 children 中的索引定义为：

*在旧 children 中寻找具有相同 key 值节点的过程中，遇到的最大索引值。*

在后续寻找的过程中，如果存在索引值比当前遇到的最大索引值还要小的节点，则意味着这个节点需要移动。

使用 lastIndex 变量来存储整个寻找过程中遇到的最大索引值，得到下面的代码：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     const oldChildren = n1.children
06     const newChildren = n2.children
07
08     // 用来存储寻找过程中遇到的最大索引值
09     let lastIndex = 0
10     for (let i = 0; i < newChildren.length; i++) {
11       const newVNode = newChildren[i]
12       for (let j = 0; j < oldChildren.length; j++) {
13         const oldVNode = oldChildren[j]
14         if (newVNode.key === oldVNode.key) {
15           patch(oldVNode, newVNode, container)
16           if (j < lastIndex) {
17             // 如果当前找到的节点在旧 children 中的索引小于最大索引值 lastIndex，
18             // 说明该节点对应的真实 DOM 需要移动
19           } else {
20             // 如果当前找到的节点在旧 children 中的索引不小于最大索引值，
21             // 则更新 lastIndex 的值
22             lastIndex = j
23           }
24           break // 这里需要 break
25         }
26       }
27     }
28
29   } else {
30     // 省略部分代码
31   }
32 }
```


如果新旧节点的 key 值相同，说明我们在旧 children 中找到了可复用 DOM 的节点。

此时我们用该节点在旧 children 中的索引 j 与 lastIndex 进行比较，如果 j 小于 lastIndex，说明当前 oldVNode 对应的真实DOM 需要移动，否则说明不需要移动。

此时还应该将变量 j 的值赋给变量 lastIndex，以保证寻找节点的过程中，变量 lastIndex 始终存储着当前遇到的最大索引值。

## 如何移动元素

移动节点指的是，移动一个虚拟节点所对应的真实 DOM 节点，并不是移动虚拟节点本身。

:::tip
当一个虚拟节点被挂载后，它对应的真实 DOM 节点会存储在他的 vnode.el 属性中。
:::

在更新操作发生时，渲染器调用 patchElement 函数在新旧虚拟节点间打补丁。如下：

```js
01 function patchElement(n1, n2) {
02   // 新的 vnode 也引用了真实 DOM 元素
03   const el = n2.el = n1.el
04   // 省略部分代码
05 }
```

无论是新的子节点还是旧子节点，都存在对真实 DOM 的引用。在此基础上，我们就可以进行 DOM 移动的操作了。

![](https://res.weread.qq.com/wrepub/CB_3300028078_image00536.jpeg)

以上面这组 DOM 节点为例，他的更新步骤如下：

1. 对于新子节点中的第一个节点 p-3

- 它的 key 值为3，在旧的一组子结点中找具有相同 key 值的可复用节点。发现能找到，且该节点在旧子节点中索引为 *2*。

- 此时的 lastIndex 值为 0，*2* 大于 0，所以节点 p-3 对应的真实 DOM 不需要移动，但需要将 lastIndex 的值更新为 2。

2. 对于新子节点中的第二个节点 p-1

- 它的 key 值为 1，在旧的一组子结点中找具有相同 key 值的可复用节点。发现能找到，且该节点在旧子节点中索引为 *0*。

- 此时的 lastIndex 值为 2，*0* 小于 2，所以节点 p-1 对应的真实 DOM 需要移动。

- **新 children 的顺序就是更新后的真实 DOM 节点应有的顺序。**所以节点 p-1 在新的 children 中的位置旧代表了真实 DOM 更新后的位置。

- 由于节点 p-1 在新的 children 中排在节点 p-3 后面，所以我们要把节点 p-1 对应的真实 DOM 移动到节点 p-3 对应的真实 DOM 后面。

3. 对于新子节点中的第三个节点 p-2

- 它的 key 值为 2，在旧的一组子结点中找具有相同 key 值的可复用节点。发现能找到，且该节点在旧子节点中索引为 *1*。

- 此时的 lastIndex 值为 2，*1* 小于 2，所以节点 p-2 对应的真实 DOM 需要移动。

- 由于节点 p-2 在新的 children 中排在节点 p-1 后面，所以我们要把节点 p-2 对应的真实 DOM 移动到节点 p-1 对应的真实 DOM 后面。

**此时，真实 DOM 的顺序与新一组子节点的顺序相同。至此，更新操作完成。**

按照上面的思路，实现代码如下：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     const oldChildren = n1.children
06     const newChildren = n2.children
07
08     let lastIndex = 0
09     for (let i = 0; i < newChildren.length; i++) {
10       const newVNode = newChildren[i]
11       let j = 0
12       // 在第一层循环中定义变量 find，代表是否在旧的一组子节点中找到可复用的节点，
13       // 初始值为 false，代表没找到
14       let find = false
15       for (j; j < oldChildren.length; j++) {
16         const oldVNode = oldChildren[j]
17         if (newVNode.key === oldVNode.key) {
18           // 一旦找到可复用的节点，则将变量 find 的值设为 true
19           find = true
            // 调用 patch 函数对当前旧子节点和新子节点进行比较和更新操作。
20           patch(oldVNode, newVNode, container)
            // 此时的真实 DOM 完成了更新，但可能还需要进行移动
21           if (j < lastIndex) {
22             const prevVNode = newChildren[i - 1]
23             if (prevVNode) {
  // 使用前一个虚拟节点对应的真实 DOM 的下一个兄弟节点作为锚点元素
24               const anchor = prevVNode.el.nextSibling
25               insert(newVNode.el, container, anchor)
26             }
27           } else {
28             lastIndex = j
29           }
30           break
31         }
32       }
33       // 如果代码运行到这里，find 仍然为 false，
34       // 说明当前 newVNode 没有在旧的一组子节点中找到可复用的节点
35       // 也就是说，当前 newVNode 是新增节点，需要挂载
36       if (!find) {
37         // 为了将节点挂载到正确位置，我们需要先获取锚点元素
38         // 首先获取当前 newVNode 的前一个 vnode 节点
39         const prevVNode = newChildren[i - 1]
40         let anchor = null
41         if (prevVNode) {
42           // 如果有前一个 vnode 节点，则使用它的下一个兄弟节点作为锚点元素
43           anchor = prevVNode.el.nextSibling
44         } else {
45           // 如果没有前一个 vnode 节点，说明即将挂载的新节点是第一个子节点
46           // 这时我们使用容器元素的 firstChild 作为锚点
47           anchor = container.firstChild
48         }
49         // 挂载 newVNode
50         patch(null, newVNode, container, anchor)
51       }
52     }
53
54   } else {
55     // 省略部分代码
56   }
57 }
```

为了让 patch 函数支持传递第四个参数，将它的代码调整成如下：

```js
01 // patch 函数需要接收第四个参数，即锚点元素
02 function patch(n1, n2, container, anchor) {
03   // 省略部分代码
04
05   if (typeof type === 'string') {
06     if (!n1) {
07       // 挂载时将锚点元素作为第三个参数传递给 mountElement 函数
08       mountElement(n2, container, anchor)
09     } else {
10       patchElement(n1, n2)
11     }
12   } else if (type === Text) {
13     // 省略部分代码
14   } else if (type === Fragment) {
15     // 省略部分代码
16   }
17 }
18
19 // mountElement 函数需要增加第三个参数，即锚点元素
20 function mountElement(vnode, container, anchor) {
21   // 省略部分代码
22
23   // 在插入节点时，将锚点元素透传给 insert 函数
24   insert(el, container, anchor)
25 }
```

## 移除不存在的元素

在更新子节点时，还可能出现元素被删除的情况。一轮更新结束后，被删除节点对应的真实 DOM 仍然存在，所以需要增加额外的逻辑来删除遗留节点。

思路很简单，当基本的更新结束时，我们需要遍历旧的子节点，然后去新的一组子节点中寻找具有相同 key 值的节点。如果找不到，则说明该节点应该被删除。代码如下：

```js
01 function patchChildren(n1, n2, container) {
02   if (typeof n2.children === 'string') {
03     // 省略部分代码
04   } else if (Array.isArray(n2.children)) {
05     const oldChildren = n1.children
06     const newChildren = n2.children
07
08     let lastIndex = 0
09     for (let i = 0; i < newChildren.length; i++) {
10       // 省略部分代码
11     }
12
13     // 上一步的更新操作完成后
14     // 遍历旧的一组子节点
15     for (let i = 0; i < oldChildren.length; i++) {
16       const oldVNode = oldChildren[i]
17       // 拿旧子节点 oldVNode 去新的一组子节点中寻找具有相同 key 值的节点
18       const has = newChildren.find(
19         vnode => vnode.key === oldVNode.key
20       )
21       if (!has) {
22         // 如果没有找到具有相同 key 值的节点，则说明需要删除该节点
23         // 调用 unmount 函数将其卸载
24         unmount(oldVNode)
25       }
26     }
27
28   } else {
29     // 省略部分代码
30   }
31 }
```