---
isTimeLine: true
title: 怎么实现 WebSocket 长连接？
date: 2023-10-16
tags:
 - Node
 - 开发经验
categories:
 - Node
---

# 怎么实现 WebSocket 长连接？


## 建立 WebSocket 连接

在前端，可以使用 JS 的 WebSocket 对象来建立 WebSocket 连接。通过指定 WebSocket 服务器的地址，可以创建一个 WebSocket 实例。

如下：

```js
const socket = new WebSocket('ws://your-websocket-server-url');
```

在 Nodejs 中，可以使用 ws 模块来创建一个 WebSocket 服务器。

如下：

```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // 处理连接事件
});
```

## 处理连接事件

前端部分，可以为 WebSocket 实例添加事件处理程序来处理不同的连接事件，例如 open、close、error 和 message。

如下：

```js
socket.addEventListener('open', (event) => {
  console.log('WebSocket 连接已建立');
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket 连接已关闭');
});

socket.addEventListener('error', (event) => {
  console.error('WebSocket 错误:', event.error);
});

socket.addEventListener('message', (event) => {
  const message = event.data;
  console.log('接收到消息:', message);
});
```

后端部分，则可以使用 ws 模块中的事件处理程序来处理连接事件。

如下：

```js
wss.on('connection', (ws) => {
  console.log('WebSocket 连接已建立');

  ws.on('message', (message) => {
    console.log('接收到消息:', message);

    // 处理接收到的消息

    // 发送消息给客户端
    ws.send('服务器发送的消息');
  });

  ws.on('close', () => {
    console.log('WebSocket 连接已关闭');
  });
});
```

## 保持连接活跃

如果 WebSocket 连接在一段时间内没有被使用，那么该连接将被关闭。我们需要让 WebSocket 保持活跃状态，以便持续收发数据。

我们可以使用心跳机制来保持 WebSocket 连接的活跃状态。

在前端，可以定期发送心跳消息给后端，以保持连接。

```js
// 定期发送心跳消息
setInterval(() => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send('心跳消息');
  }
}, 5000); // 5 秒发送一次心跳消息
```

后端则可以通过监听客户端的活动来保持连接活跃。在收到客户端的消息时，可以更新一个时间戳来表示最近的活动。

```js
wss.on('connection', (ws) => {
  let lastActivity = Date.now();

  ws.on('message', (message) => {
    lastActivity = Date.now();
    // 处理接收到的消息
  });

  // 检查连接活跃状态
  setInterval(() => {
    const now = Date.now();
    if (now - lastActivity > 15000) { // 15 秒无活动则关闭连接
      ws.terminate();
    }
  }, 5000); // 每 5 秒检查一次
});
```

## 处理接收和发送数据

在前端和后端，都可以使用 send() 方法来发送数据，使用事件处理程序来接收数据。

前端部分：

```js
// 发送消息给服务器
socket.send('要发送的消息');

// 接收服务器发送的消息
socket.addEventListener('message', (event) => {
  const message = event.data;
  console.log('接收到消息:', message);
});
```

后端部分:

```js
wss.on('connection',(ws) => {
  ws.on('message', (message) => {
    console.log('接收到消息:', message);

    // 处理接收到的消息

    // 发送消息给客户端
    ws.send('服务器发送的消息');
  });
});
```