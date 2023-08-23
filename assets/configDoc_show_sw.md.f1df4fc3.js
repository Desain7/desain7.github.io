import{_ as e,o as a,c as r,S as t}from"./chunks/framework.59c3ae61.js";const g=JSON.parse('{"title":"🤔为什么需要手动刷新本站点","description":"","frontmatter":{"isTimeLine":true,"title":"🤔为什么需要手动刷新本站点","date":"2020-11-28T00:00:00.000Z","tags":["大前端"],"categories":["其它"]},"headers":[],"relativePath":"_configDoc/show/sw.md","filePath":"_configDoc/show/sw.md","lastUpdated":1692787965000}'),o={name:"_configDoc/show/sw.md"},i=t('<h1 id="🤔为什么需要手动刷新本站点" tabindex="-1">🤔为什么需要手动刷新本站点 <a class="header-anchor" href="#🤔为什么需要手动刷新本站点" aria-label="Permalink to &quot;🤔为什么需要手动刷新本站点&quot;">​</a></h1><p>当你访问站点时，如发现页面右下角有这个小窗时，请记得点一下</p><div><img width="400px;" src="https://img.cdn.sugarat.top/mdImg/MTYwNjU0NzUyMDQwNg==606547520406" alt="示例"></div><h2 id="为什么🤔" tabindex="-1">为什么🤔 <a class="header-anchor" href="#为什么🤔" aria-label="Permalink to &quot;为什么🤔&quot;">​</a></h2><p>网站接入了资源离线化方案 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API" target="_blank" rel="noreferrer">ServiceWorker</a></p><p>通俗讲就是首次联网访问后，浏览器会把资源文件都缓存起来，用户断网后仍能访问本站点（需要用户的浏览器支持 ServiceWorker）</p><p>能提升用户的阅读体验，利用缓存也能大幅提高页面加载速率</p><h2 id="如何查看是否支持🤪" tabindex="-1">如何查看是否支持🤪 <a class="header-anchor" href="#如何查看是否支持🤪" aria-label="Permalink to &quot;如何查看是否支持🤪&quot;">​</a></h2><ol><li><p>通过<a href="https://caniuse.com/?search=serviceworker" target="_blank" rel="noreferrer">CAN I USE</a>查询自己的终端是否支持</p></li><li><p>\b\b可在DevTools(开发者调试工具) 中的 Application 面板的 ServiceWorkers的侧边栏中 看到如下内容</p></li></ol><p><img src="https://img.cdn.sugarat.top/mdImg/MTYwNjU0OTYzNDg5NQ==606549634895" alt="图片"></p><ul><li>绿色的表示是目前正在使用的sw.js(缓存控制文件)版本</li><li>橙色表示已经就绪的新版本内容，等待被载入使用</li></ul><p>💡1. 用户可以通过弹窗的引导，主动载入最新的内容</p><p>💡2. <strong>完全</strong>退出浏览器，重新访问本站点</p><p>以上两种方式都可实现最新内容的加载</p>',14),s=[i];function c(l,p,n,d,_,h){return a(),r("div",null,s)}const f=e(o,[["render",c]]);export{g as __pageData,f as default};