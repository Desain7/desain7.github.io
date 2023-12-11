---
isTimeLine: true
title: Vue 中有哪些性能优化？
date: 2023-12-7
tags:
 - Vue
 - 开发经验
categories:
 - Vue
---

# Vue 中有哪些性能优化？

## 路由懒加载

路由懒加载是通过动态导入（Dynamic Import）实现的，它可以帮助优化应用程序的性能。

路由懒加载的原理是延迟加载（懒加载）路由组件，只在需要时才进行加载，以减少初始加载时间和资源负担。

```js
const router = createRouter({
  routes: [
    // 借助webpack的import()实现异步组件
    { path: '/foo', component: () => import('./Foo.vue') }
  ]
})
```

**路由懒加载的工作原理：**

1. 动态导入：在路由配置中，使用import()函数来异步加载路由组件。这样可以将路由组件的加载推迟到需要时才进行，而不是在初始加载时一次性加载所有组件。
2. 以路由组件为单位的懒加载：每个路由都被拆分为独立的组件，只有用户导航到某个路由时，对应的组件才会被下载和执行。
3. 代码分包：在打包构建的过程中，Vue 会将每个异步加载的路由组件划分为单独的代码块，每个页面只加载当前页面所需的代码块，以减少初始加载时间和资源负担。
4. 组件缓存：在路由懒加载的过程中，组件实例会被缓存，以便在路由切换时重用，避免重复加载组件。

## 页面/组件缓存

在Vue中，使用 `<keep-alive>` 组件可以实现页面缓存，即在组件被销毁后保留其状态和内容，以便下次重新加载时能够快速恢复(从缓存中获取)。

用法：`<keep-alive>`通常与 `<component>` 或 `<router-view>` 组件一起使用。

```html
<router-view v-slot="{ Component }">
    <keep-alive>
    <component :is="Component"></component>
  </keep-alive>
</router-view>
```

**`<keep-alive>` 的工作原理**

1. 缓存组件：将需要缓存的组件包裹在 `<keep-alive>` 标签内。
2. 组件生命周期改变：当组件被包裹在 `<keep-alive>` 中时，它们的生命周期钩子函数会有所变化。正常情况下，组件的 created、mounted 和 destroyed 等钩子函数会在组件的创建、挂载和销毁时触发。但是在 `<keep-alive>` 中，被缓存的组件的 mounted 和 destroyed 钩子函数不会被触发，而是会触发 activated 和 deactivated 钩子函数。
3. 缓存和恢复：当组件被缓存时，其状态和内容将被保留在内存中，而不会被销毁。当离开该组件并再次进入时，组件将从缓存中恢复，而不会重新创建和初始化。这样可以避免重新渲染和重新加载组件所需的数据，提高页面的加载速度和性能。
4. 切换缓存策略：在 `<keep-alive>` 组件上可以设置不同的属性，以控制缓存的行为。

常用的属性包括：

- include：指定需要缓存的组件名称或匹配模式。
- exclude：指定不需要缓存的组件名称或匹配模式。
- max：指定最大缓存的组件实例数量。当超过该数量时，较早的组件实例将被销毁。

## 复用 DOM

使用 v-show 实现 DOM 的复用，避免重复创建组件。

```html
<template>
  <div class="cell">
    <!-- 这种情况用v-show复用DOM，比v-if效果好 -->
    <div v-show="value" class="on">
      <Heavy :n="10000"/>
    </div>
    <section v-show="!value" class="off">
      <Heavy :n="10000"/>
    </section>
  </div>
</template>
```

## v-once/v-memo

- 对于不再变化的数据，使用 v-once 避免重复渲染。

```html
<!-- single element -->
<span v-once>This will never change: {{msg}}</span>
<!-- the element have children -->
<div v-once>
  <h1>comment</h1>
  <p>{{msg}}</p>
</div>
<!-- component -->
<my-component v-once :comment="msg"></my-component>
<!-- `v-for` directive -->
<ul>
  <li v-for="i in list" v-once>{{i}}</li>
</ul>
```

- 需要按条件跳过更新时，使用 v-memo

```html
<div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
  <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
  <p>...more child nodes</p>
</div>
```

## 及时销毁事件及定时器

在 Vue 组件销毁时，调用相应的生命周期钩子，解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。

```js
export default {
  created() {
    this.timer = setInterval(this.refresh, 2000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
```

## 按需引入第三方插件

像 ant-design、element-plus 这样的第三方组件库可以按需引入避免体积太大。

```js
import { createApp } from 'vue';
import { Button, Select } from 'element-plus';
​
const app = createApp()
app.use(Button)
app.use(Select)
```

