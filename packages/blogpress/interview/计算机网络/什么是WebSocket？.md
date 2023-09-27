---
isTimeLine: true
title: 什么是 WebSocket？
date: 2023-9-27
tags:
 - 面试经验
 - 计算机网络
categories:
 - 面试经验
---

# 什么是 WebSocket？

## WebSocket 概述

**WebSocket** 是 HTML5 提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。

它基于TCP传输协议，并复用HTTP的握手通道。浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

WebSocket 的出现解决了半双工通信的弊端。它最大的特点是：**服务器可以向客户端主动推动消息，客户端也可以主动向服务器推送消息。**

相比传统的HTTP请求-响应模式，WebSocket 提供了实时、高效和双向的通信能力。

## WebSocket 的特点

1. 双向通信

WebSocket 提供了全双工通信，允许客户端和服务器之间同时发送和接收数据。

这使得实时性应用程序（如聊天应用、实时协作工具等）的开发更加简单和高效。

2. 持久连接

WebSocket 建立一次连接后，会保持连接状态，直到客户端或服务器主动关闭连接。

有效减少了通信的开销，提升了性能和效率。

3. 低延迟

由于 WebSocket 的持久连接和双向通信特性，它可以实现低延迟的实时数据传输。

相比传统的HTTP请求-响应模式，减少了通信的延迟和开销。

4. 支持跨域

WebSocket 不同于传统的 AJAX 请求，它支持跨域通信。服务器和客户端可以在不同的域之间建立 WebSocket 连接。

5. 安全性

WebSocket 支持加密和身份验证，可以通过安全的 WebSocket 连接（wss://）进行通信，确保数据的安全性和完整性。

## WebSocket 的工作原理

### 建立连接

- 客户端通过普通的HTTP请求发送一个特殊的Upgrade头部，指示将连接升级为 WebSocket 协议。

- 服务器收到请求后，验证并确认升级协议为 WebSocket，返回状态码101 Switching Protocols 的响应。

- 连接建立后，客户端和服务器之间建立了一个持久化的双向通信通道。

### WebSocket 协议格式

- WebSocket 协议使用帧（Frame）的格式进行消息的封装和传输。帧包含了一些必要的控制信息和负载数据，用于描述和传递消息。

### 数据传输

- 客户端和服务器可以通过发送帧来进行双向通信。

- 客户端和服务器可以随时发送帧给对方，无需等待请求-响应的模式。

- 帧可以是文本类型（包含Unicode字符）或二进制类型（原始字节数据）。并支持进行分片传输，一个消息可以被分成多个帧进行传输。

### 心跳机制

- WebSocket 连接是持久化的，为了保持连接的活跃状态，客户端和服务器可以定期发送心跳消息。

- 心跳消息是一个特殊的帧，用于确认连接的存活性。

### 关闭连接

- 客户端或服务器可以发送一个特殊的关闭帧来关闭连接。关闭帧包含关闭码和关闭原因，用于描述关闭的原因。

- 接收到关闭帧后，另一方也会发送关闭帧以确认关闭。

## WebSocket 的使用

### 客户端

```js
// 在index.html中直接写WebSocket，设置服务端的端口号为 9999
let ws = new WebSocket('ws://localhost:8080');
// 在客户端与服务端建立连接后触发
ws.onopen = function() {
    console.log("Connection open."); 
    ws.send('hello');
};
// 在服务端给客户端发来消息的时候触发
ws.onmessage = function(res) {
    console.log(res);       // 打印的是MessageEvent对象
    console.log(res.data);  // 打印的是收到的消息
};
// 在客户端与服务端建立关闭后触发
ws.onclose = function(evt) {
  console.log("Connection closed.");
}; 
```

### 服务端

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // 创建WebSocket服务器实例，指定监听的端口

wss.on('connection', (ws) => {  // 当有客户端连接时触发connection事件
  console.log('Client connected');

  // 处理客户端消息
  ws.on('message', (message) => {
    console.log('Received message:', message);
    // 在这里可以对收到的消息进行处理

    // 向客户端发送消息
    ws.send('Server message: Hello!');
  });

  // 处理客户端断开连接
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
```