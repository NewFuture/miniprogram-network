# miniprogram-queue [![npm version](https://badge.fury.io/js/miniprogram-queue.svg)](https://npmjs.com/package/miniprogram-queue)

> Queue Package for MiniProgram API
>
> 小程序操作队列化(`wx.request`, `wx.downloadFile`,`wx.uploadFile`)


Features:

* [x] 可自动注入/手动管理
* [x] [取消操作(`abort`)](#abort-取消操作)
* [x] [进度回调](#progress-进度支持)
* [x] [插队](#jump-插队)

## Install(安装)

```
npm i miniprogram-queue -S
```

## Usage(使用)

### Replace Native API (替换原生接口)


```js
/// app.js (entry of your app), call apply();
/// 在小程序入口(通常是app.js) 调用 apply() 函数, 实现自动注入

import {apply} from 'miniprogram-queue';
apply(); 
// 替换默认API, wx.request, wx.uploadFile,wx.downloadFile
```

### Manual management `WxQueue` (手动管理队列)

```js
import {WxQueue} from 'miniprogram-queue';
//创建请求队列
const requestQueue = new WxQueue(wx.request,10);
// const uploadQueue = new WxQueue(wx.uploadFile,10);
// const downloadQueue = new WxQueue(wx.downloadFile,10);

// 发送请求
let task = requestQueue.push({
    url:'https://github.com/NewFuture/miniprogram/'
});

// task.abort() 可取消操作
```

## API 

### 参数

与官网API参数兼容

* [request](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)
* [downloadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html)
* [uploadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html) 

同时 `downloadFile` 和 `uploadFile` 支持通过[process 参数](#progress) 之间设置进度回调

### jump (插队)

```js
//第二个参数为true时优先级最高
requestQueue.push(param,true);
```

## Abort (取消操作)

所有操作返回一个`Task`对象，可取消操作

注意: 和官方API一致 **取消时依然会执行complete(如果配置了)**。

* 自动注入方式
```js
var task = wx.request(obj);
task.abort();
```

* 手动push
```js
var task = queue.push(obj);
task.abort();
```

## Progress (进度支持)

* `DownloadTask.onProgressUpdate(function callback)`
* `UploadTask.onProgressUpdate(function callback)`

> 小程序`onProgressUpdate`API的接口，设计上不太合理,
> 这个接口放在请求发生时更合适,而非在Task创建后。

此处保留了对onProgressUpdate的兼容适配,同时提供了可通过参数(`progress`)传入的方法

```js

const task =uploadQueue.push({
    // 其他参数
    progress:processCallback// callback function
});
// function processCallback(progress,currentBytes,totalBytes){}
```

```js
// obj update object
const task = wx.uploadFile(obj);
// 保留原生调用方式支持
task.onProgressUpdate(processCallback); // callback function
// function processCallback(progress,currentBytes,totalBytes){}
```
