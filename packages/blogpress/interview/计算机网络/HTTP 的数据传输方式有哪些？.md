---
isTimeLine: true
title: HTTP 的数据传输方式有哪些？
date: 2024-3-6
tags:
 - 面试经验
 - 计算机网络
categories:
 - 计算机网络
---

# HTTP 的数据传输方式有哪些？

对前端来说，后端主要通过提供 http 接口来传输数据，而数据传输的方式主要有 5 种：

- url param
- query
- form-urlencoded
- form-data
- json

## url param

url param 是 url 中的参数，它是通过 URL 中的参数来传输数据的。

我们可以把参数写在 url 中，比如：
```text
http://baidu.com/person/abc
```

这里的 abc 就是路径中的参数（url param），服务端框架或单页应用的路由都支持从 url 中取出参数。

## query

通过 url 中 ？后面用 & 分隔的字符串传递数据。比如：
```text
http://baidu.com/person?name=abc&age=20
```

这里的 name 和 age 就是 query 传递的数据。

其中非英文的字符和一些特殊字符要经过编码，可以使用  encodeURIComponent 的 api 来编码：

```js
const query = "?name=" + encodeURIComponent('abc') + "&age=" + encodeURIComponent(20)
// ?name=%E5%85%89&age=20
```

或使用 querystring 的 api 来编码：

```js
const query = querystring.stringify({ name: 'abc', age: 20 })
// ?name=%E5%85%89&age=20
```

## form-urlencoded

直接用 form 表单提交数据就是这种，它和 query 字符串的方式的区别只是放在了 body 里，然后指定了 content-type 是 `application/x-www-form-urlencoded`。


因为内容也是 query 字符串，所以也要用 encodeURIComponent 的 api 或 query-string 库处理下。


这种格式也很容易理解，get 是把数据拼成 query 字符串放在 url 后面，于是表单的 post 提交方式的时候就直接用相同的方式把数据放在了 body 里。


通过 & 分隔的 form-urlencoded 的方式需要对内容做 url encode，如果传递大量的数据，比如上传文件的时候就不是很合适了，因为文件 encode 一遍的话太慢了，这时候就可以用 form-data。

## form-data

form data 不再是通过 & 分隔数据，而是用 --------- + 一串数字做为 boundary 分隔符。因为不是 url 的方式了，自然也不用再做 url encode 了。

form-data 需要指定 content type 为 multipart/form-data，然后指定 boundary 也就是分割线。


body 里面就是用 boundary 分隔符分割的内容。


很明显，这种方式适合传输文件，而且可以传输多个文件。

但是毕竟多了一些只是用来分隔的 boundary，所以请求体会增大。

## json

form-urlencoded 需要对内容做 url encode，而 form data 则需要加很长的 boundary，两种方式都有一些缺点。如果只是传输 json 数据的话，不需要用这两种。


可以直接指定content type 为 application/json 就行，我们平时传输 json 数据基本用的是这种。