---
isTimeLine: true
title: 快速 diff 算法
date: 2023-9-19
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

