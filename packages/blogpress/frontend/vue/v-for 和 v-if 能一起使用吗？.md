---
isTimeLine: true
title: v-for 和 v-if 能一起使用吗？
date: 2023-12-6
tags:
 - Vue
 - 开发经验
categories:
 - Vue
---

# v-for 和 v-if 能一起使用吗？

结论：**v-for 和 v-if 不能一起使用**

## 原因

在 Vue2 中，v-for 的 优先级高于 v-if，而 Vue3 中 v-if 的 优先级高于 v-for。

Vue2 时期，由于 v-for 的 优先级高于 v-if 所以会先执行循环再判断条件。哪怕只有其中的一部分元素需要渲染，也会在重新渲染的时候去遍历整个列表，此时就会造成性能的浪费。

而到了 Vue3 中，v-if 的优先级高于 v-for，当 v-if 执行时，他调用的变量还不存在，就会导致异常。

## 源码

```js
function genNode(node: CodegenNode | symbol | string, context: CodegenContext) {
  if (isString(node)) {
    context.push(node)
    return
  }
  if (isSymbol(node)) {
    context.push(context.helper(node))
    return
  }
  switch (node.type) {
    case NodeTypes.ELEMENT:
    case NodeTypes.IF:
    case NodeTypes.FOR:
      __DEV__ &&
        assert(
          node.codegenNode != null,
          `Codegen node is missing for element/if/for node. ` +
            `Apply appropriate transforms first.`
        )
      genNode(node.codegenNode!, context)
      break
      ...
```

可以看到，在 Vue3 中，生成代码时，v-if 的优先级高于 v-for。

```js
export function genElement(el: ASTElement, state: CodegenState): string {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
    ...
```

Vue2 中，v-for 的优先级高于 v-if。

## 同时使用

在 Vue3 中，当二者同时使用时，渲染函数如下：

```js
ƒ anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}},_l((items),function(item){return (item.isActive)?_c('div',{key:item.id},[_v("\n      "+_s(item.name)+"\n    ")]):_e()}),0)}
}
```

由于 v-if 的优先级高于 v-for，会先进行 v-if 的判断，也即会先获取 item.isActive，此时并未执行 v-for，所以将会报错。
