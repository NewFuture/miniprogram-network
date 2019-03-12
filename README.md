# miniprogram-network

> 小程序全局网络库,提供完整`代码自动提示`,支持`Promise`、`队列`、自动`重试`、`缓存`、`取消`、全局`拦截`、和多`事件监听`等……
>
> Redefine the network API of Wechat MiniProgram, including full `Intelligent Code Completion`, with `Promise`,`Queue`,`retry`,`Cache`,`CancelToken`, global `interceptors`, `event listeners` and more.
> 
> GitHub: [NewFuture/miniprogram-network](https://github.com/NewFuture/miniprogram-network)
> for `JavaScript` & `TypeScript`

## Examples 示例

### 安装

```sh
npm i miniprogram-network
```

### JavaScript

```js
const Network = require('miniprogram-network');

// setConfig设置所有网络请求的全局默认配置,一次定义，所有文件中使用均生效
Network.setConfig('baseURL','https://miniprogram-network.newfuture.cc/')
// 也可Network.REQUEST.Defaults,Network.DOWNLOAD.Defaults,Network.UPLOAD.Defaults 分别设置不同默认配置
Network.REQUEST.Defaults.transformResponse = Network.transformRequestResponseOkData

Network.get('index.html')
    .then(res=>console.log(res))
    .finally(()=>{console.info('done')}) //支持 finally操作

Network.patch('items/{id}',{dataKey:'dataValue'},{
        params: {id:123456}, // 绑定参数
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
import {setConfig,REQUEST,download,transformRequestResponseOkData,transformDownloadResponseOkData} from 'miniprogram-network';

// setConfig设置所有网络请求的全局默认配置,一次定义，所有文件中使用均生效
setConfig('baseURL', 'https://miniprogram-network.newfuture.cc/');
// 也可通过 REQUEST.Defaults,DOWNLOAD.Defaults,UPLOAD.Defaults 分别设置不同默认配置
REQUEST.Defaults.transformResponse = transformRequestResponseOkData;

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


### Intelligent code completion 代码提示

包含完整的类型定义,结合编辑器(VScode)等,能提供完整的代码提示和自动完成功能。

![Intelligent code completion](https://user-images.githubusercontent.com/6290356/50153198-b569bd80-0300-11e9-859c-5742d070434a.png)

对于TypeScript提供泛型支持,可完整的进行静态类型检查。


## Main Packages 所有包 [![Build Status](https://travis-ci.com/NewFuture/miniprogram-network.svg?branch=master)](https://travis-ci.com/NewFuture/miniprogram-network)


![network-dependencies-graph](https://user-images.githubusercontent.com/6290356/53808057-35143980-3f8c-11e9-8618-4d6e7c5eaa1e.png)

* [miniprogram-network](network) All in one 小程序网络库库合集[![npm version](https://badge.fury.io/js/miniprogram-network.svg)](https://npmjs.com/package/miniprogram-network)
    * `Request` from [`miniprogram-request` npm](https://npmjs.com/package/miniprogram-request)
    * `Upload` from [`miniprogram-uploader` npm](https://npmjs.com/package/miniprogram-uploader)
    * `Download` from [`miniprogram-downloader` npm](https://npmjs.com/package/miniprogram-downloader)
* [miniprogram-request](request) 小程序请求库 [![npm version](https://badge.fury.io/js/miniprogram-request.svg)](https://npmjs.com/package/miniprogram-request)
    * [x] Promise支持+finally+泛型
    * [x] CancelToken 取消支持
    * [x] Queue 底层队列维护，支持插队
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
    * [x] Queue 底层队列维护，支持插队
    * [x] retry 网络错误重试
    * [x] Interceptors 自定义请求/响应拦截
    * [x] Listeners 事件监听
* [miniprogram-downloader](downloader) 小程序下载库 [![npm version](https://badge.fury.io/js/miniprogram-downloader.svg)](https://npmjs.com/package/miniprogram-downloader)
    * [x] Promise支持+finally+泛型
    * [x] Cancelable 可取消
    * [x] Queue 底层队列维护，支持插队
    * [x] retry 网络错误重试
    * [x] OnProgressUpdate 进度回调
    * [x] OnHeadersReceived 响应头回调
    * [x] Interceptors 自定义请求/响应拦截
    * [x] Listeners 事件监听
* [miniprogram-queue](queue) 小程序API队列封装 [![npm version](https://badge.fury.io/js/miniprogram-queue.svg)](https://npmjs.com/package/miniprogram-queue)
    * [x] 可自动注入/手动管理
    * [x] 支持取消操作(`abort`)
    * [x] OnProgressUpdate 进度回调
    * [x] OnHeadersReceived 响应头回调
    * [x] 支持插队
* [miniprogram-network-life-cycle](life-cycle) 网络操作流程和事件
![life-cycle](https://user-images.githubusercontent.com/6290356/49631309-6bddc080-fa2c-11e8-9a41-88fb50b2a1b7.png)
* [miniprogram-fetch](fetch) 小程序中使用[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch) [![npm version](https://badge.fury.io/js/miniprogram-fetch.svg)](https://npmjs.com/package/miniprogram-fetch)
    * [x] 自动队列支持
* ~~[miniprogram-promise](promise) 小程序异步API转Promise~~
    * [x] Finally Promise (支持finally)
    * [x] cancelable/abort (可取消的Promise)


## Todo
* [x] Cache (Network)
* [x] data 泛型支持
* [x] timestamp (queue)
* [ ] resize queue