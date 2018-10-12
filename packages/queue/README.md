# miniprogram-queue

小程序队列化操作

## 直接替换

app.js

```js
import {apply} from 'miniprogram-queue';
apply(); // 替换默认API, wx.request, wx.uploadFile,wx.downloadFile
```

## 自定义队列

```js
import {WxQueue} from 'miniprogram-queue';
//创建请求队列
const requestQueue = new WxQueue(wx.request,10);
// 发送请求
requestQueue.push({
    url:'https://github.com/NewFuture/miniprogram/'
});
```