---
isTimeLine: true
title: keep-alive的源码解析
date: 2023-9-15
tags:
 - 面试经验
 - Vue 源码解析
categories:
 - 面试经验
---

# keep-alive的源码解析

```js
export default {
  name: 'keep-alive',
  abstract: true, //抽象组件
 
  props: { //接收三个参数
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
 
  created () {
    this.cache = Object.create(null) //缓存的组件
    this.keys = [] //缓存组件的key数组
  },
 
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys) //删除缓存中所有组件
    }
  },
 
 /**
    监听include和exclude的值，如果当前cache中的组件不在include中或在exclude中，则
    需要将该组件从cache中去掉。pruneCache方法就是将cache中不满足include和exclude
    规则的组件删除掉
 */
  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
 
  render () {
    const slot = this.$slots.default //获取keep-alive标签包裹的默认插槽中的元素
    const vnode: VNode = getFirstComponentChild(slot) //获取到默认插槽中的第一个子元素（keep-alive只对第一个子元素起作用）
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if ( //如果组件不符合include和exclude规则，那么直接返回该组件，不需要从缓存中获取
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
 
      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) { //如果缓存中存在当前组件
        vnode.componentInstance = cache[key].componentInstance //将缓存中的组件实例赋给当前组件实例
        // make current key freshest
        remove(keys, key) //将当前组件key从缓存的keys数组中删除
        keys.push(key) //将当前组件keypush到缓存的keys中，以此来保持该组件在缓存中是最新的
      } else { //如果缓存中没有当前组件
        cache[key] = vnode //将当前组件放入缓存中
        keys.push(key) //将当前组件key放入缓存keys数组中
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) { //如果已缓存的组件数量大于max值，则将缓存keys数组中第一个组件删除掉。（缓存中组件的顺序是不常用的在前面，常用的在后面，这是由上面代码中如果组件在缓存中，就需要先在缓存中删除组件key，再重新向缓存keys数组中推入组件key的实现方式决定的）
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
 
      vnode.data.keepAlive = true //标记该组件的keepAlive状态
    }
    return vnode || (slot && slot[0]) //如果上面方法没执行，则直接返回vnode或第一个子元素
  }
}


/**
* 获取组件的名称。组件的componentOptions包含以下几个属性{ Ctor, tag, propsData, listeners，children } ，通过Ctor.options.name或tag可以获取到组件的name值
**/
function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}
/**
* 判断组件是否在include或exclude中
**/
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
 
/**
* 如果缓存的组件不在include或exclude的规则内，则将组件从缓存中删除
*/
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
/**
* 删除缓存中的组件
*/
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```