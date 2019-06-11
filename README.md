# [miniprogram-network](https://github.com/NewFuture/miniprogram-network)

> 小程序网络库,提供完整`代码自动完成` 和 `类型检查`,支持`Promise`、自动`重试`、`缓存`、`取消`、`自定义超时`、全局`拦截`、和`事件监听`等……
>
> Redefine the network API of Wechat MiniProgram, including full `IntelliSense` and `Type Checking`, with `Promise`,`retry`,`Cache`,`CancelToken`,`timeout`, global `interceptors`, `event listeners` and more.

## Features 主要功能

* [x] Promise<T>泛型Promise支持
* [x] Retry 网络错误自动重试
* [x] Cache 底层缓存支持(包括并发请求合并)
* [x] CancelToken 可取消操作
* [x] Timeout 自定义超时时间
* [x] timestamp 记录耗时统计(需开启配置)
* [x] 每个请求的原生回调接口支持(`onHeadersReceived`事件)和(`onProgressUpdate`事件)
* [x] Interceptors 拦截器 `transformSend`/ `transformRresponse`自定义数据拦截
* [x] Listeners 全局事件监听`onSend`,`onResponse`,`onRejected`,`onAbort`,`onComplete`
* [x] 支持全局默认配置和每个请求单独配置
* [x] 类型推断和代码自动提示(TypeScript)

## Examples 示例

### 安装

```sh
npm i miniprogram-network
```

### JavaScript

> es5 兼容

```js
const Network = require('miniprogram-network');
// 也可使用 es6 import 写法

// setConfig设置所有网络请求的全局默认配置,一次定义，所有文件中使用均生效
Network.setConfig('baseURL','https://miniprogram-network.newfuture.cc/')
// 也可Network.REQUEST.Defaults,Network.DOWNLOAD.Defaults,Network.UPLOAD.Defaults 分别设置不同默认配置
Network.REQUEST.Defaults.transformResponse = Network.transformRequestResponseOkData

Network.get('index.html')
    .then(res=>console.log(res))
    .finally(()=>{console.info('done')}) //支持 finally操作

Network.patch('items/{id}',{dataKey:'dataValue'},{
        params: {id:123456}, // 绑定模板参数
        retry:3,// 重试3次
    }).then((item)=>console.log(item))

Network.dowanload('network/','lcoalpath',{
        onProgressUpdate:progressUpdateCallBack,//进度回调
        transformResponse: Network.transformDownloadResponseOkData, //状态码2xx成功,返回本地路径
    }).then(path=>console.log(path))
    .catch(console.error)
```

### TypeScript

> 装完即用，无需额外配置和类型声明

```ts
import {setConfig,REQUEST,download,transformRequestResponseOkData,transformDownloadResponseOkData, delayRetry} from 'miniprogram-network';

// setConfig设置所有网络请求的全局默认配置,一次定义，所有文件中使用均生效
setConfig('baseURL', 'https://miniprogram-network.newfuture.cc/');
// 也可通过 REQUEST.Defaults,DOWNLOAD.Defaults,UPLOAD.Defaults 分别设置不同默认配置
REQUEST.Defaults.transformResponse = transformRequestResponseOkData;
// 请求发送失败时, 间隔1s再次重试，最多重试2次
REQUEST.Defaults.retry = delayRetry(1000,2);

REQUEST.get('index.html')
    .then(res=>console.log(res))
    .finally(()=>{console.info('done')}); //支持 finally操作

REQUEST.patch<Item>('items/{id}',{dataKey:'dataValue'},{
        params: {id:123456}, // 绑定参数
        retry:3,// 重试3次
    }).then((item:Item)=>console.log(item));

download<string>('network/','lcoalpath',{
        onProgressUpdate: (res)=>console.log(res), //进度回调
        transformResponse: transformDownloadResponseOkData, //状态码2xx成功,返回本地路径
    }).then((path:string)=>console.log(path))
    .catch(console.error);
```

`miniprogram-network`对网络操作做了统一封装，详细操作和用法可查看完整[miniprogram-network 完整文档](network)

* 如果只需要微信request的相关的HTTP操作API可只使用[miniprogram-request(文档🔗)](request)
* 如果只需要微信downloadFile的相关下载API可只使用[miniprogram-downloader(文档🔗)](downloader)
* 如果只需要微信uploadFile的相关上传API可只使用[miniprogram-uploader(文档🔗)](uploader)


### IntelliSense & Types 代码提示和类型检查

包含完整的类型定义,结合编辑器(VScode)等,能提供完整的代码提示和自动完成功能。

![Intelligent code completion](https://user-images.githubusercontent.com/6290356/50153198-b569bd80-0300-11e9-859c-5742d070434a.png)

对于TypeScript提供泛型支持,可完整的进行静态类型检查。


## Main Packages 所有包 [![Build Status](https://travis-ci.com/NewFuture/miniprogram-network.svg?branch=master)](https://travis-ci.com/NewFuture/miniprogram-network)

> 如果担心包依赖多,可使用[miniprogram-build](https://github.com/NewFuture/miniprogram-build) 打包小程序rollup 精简为单文件。



tips: 自`miniprogram-network` >= 5.0.0  底层默认不在直接使用`miniprogram-queue`进行队列封装, 如果有需要可自行引用, 或直接使用 v4.x

> * wx.request 自基础库 1.4.0 (2017.07) 小程序开始支持队列
> * wx.downloadFile 自基础库 1.4.0 (2017.07) 小程序开始支持队列
> * wx.uploadFile 自基础库 2.4.1 (2018.11) 小程序开始支持队列

![network-dependencies-graph](https://user-images.githubusercontent.com/6290356/58758745-6f24b580-8552-11e9-890d-02c4559eb400.png)

* [miniprogram-network](network) All in one 小程序网络库库合集[![npm version](https://badge.fury.io/js/miniprogram-network.svg)](https://npmjs.com/package/miniprogram-network)
    * `Request` from `miniprogram-request`
    * `Upload` from `miniprogram-uploader`
    * `Download` from `miniprogram-downloader`
    * 网络缓存和请求合并
* [miniprogram-request](request) 小程序请求库 [![npm version](https://badge.fury.io/js/miniprogram-request.svg)](https://npmjs.com/package/miniprogram-request)
    * [x] Promise支持+finally+泛型
    * [x] CancelToken 取消支持
    * [x] retry 网络错误重试
    * [x] Interceptors 自定义请求/响应拦截
    * [x] Listeners 事件监听
    * [x] OnHeadersReceived 响应头回调
    * [x] axios like API
* [miniprogram-uploader](uploader) 小程序上传库 [![npm version](https://badge.fury.io/js/miniprogram-uploader.svg)](https://npmjs.com/package/miniprogram-uploader)
    * [x] Promise支持+finally+泛型
    * [x] Cancelable 可取消
    * [x] OnProgressUpdate 进度回调
    * [x] OnHeadersReceived 响应头回调
    * [x] retry 网络错误重试
    * [x] Interceptors 自定义请求/响应拦截
    * [x] Listeners 事件监听
* [miniprogram-downloader](downloader) 小程序下载库 [![npm version](https://badge.fury.io/js/miniprogram-downloader.svg)](https://npmjs.com/package/miniprogram-downloader)
    * [x] Promise支持+finally+泛型
    * [x] Cancelable 可取消
    * [x] retry 网络错误重试
    * [x] OnProgressUpdate 进度回调
    * [x] OnHeadersReceived 响应头回调
    * [x] Interceptors 自定义请求/响应拦截
    * [x] Listeners 事件监听
* [miniprogram-network-life-cycle](life-cycle) 网络操作流程和事件
    * [x] 事件周期监听器
    * [x] 事件周期拦截器
    * [x] 自定义超时
    * [x] 时间戳打点
![life-cycle](https://user-images.githubusercontent.com/6290356/49631309-6bddc080-fa2c-11e8-9a41-88fb50b2a1b7.png)
* [miniprogram-fetch](fetch) 小程序中使用[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch) [![npm version](https://badge.fury.io/js/miniprogram-fetch.svg)](https://npmjs.com/package/miniprogram-fetch)
    * [x] 自动队列支持
* [miniprogram-queue](queue) 自定义队列封装 [![npm version](https://badge.fury.io/js/miniprogram-queue.svg)](https://npmjs.com/package/miniprogram-queue)
    * [x] 可自动注入/手动管理
    * [x] 支持取消操作(`abort`)
    * [x] OnProgressUpdate 进度回调
    * [x] OnHeadersReceived 响应头回调
    * [x] 支持插队
    * [x] 支持自定义超时