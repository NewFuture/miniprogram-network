# miniprogram-network

> 小程序全局网络库,支持`Promise`、`队列`、自动`重试`、`可取消`、全局`拦击器`、和多种`事件监听`等……
>
> Redefine the network API of Wechat MiniProgram with `Promise`,`Queue`,`retry`,`CancelToken`, global `interceptors` and `event listeners` etc...
> 
> GitHub: [NewFuture/miniprogram-network](https://github.com/NewFuture/miniprogram-network)
> for `Javascript` & `TypeScript`

## Examples 示例代码

### JavaScript

```js
const Network = require('miniprogram-network');

// setConfig设置所有网络请求的全局默认配置,一次定义，所有文件中使用均生效
// 也可Network.Request.Defaults,Network.Download.Defaults,Network.Upload.Defaults 分别设置不同默认配置
Network.setConfig('baseURL','https://miniprogram-network.newfuture.cc/')

Network.get('index.html')
    .then(res=>console.log(res))
    .catch(console.error)
    .finally(()=>{console.info('done')}); //支持 finally操作

Network.patch('items/{id}',{dataKey:'dataValue'},{
        params: {id:123456}, // 绑定参数
        transformResponse: Network.transformRequestResponseOkData,// 响应2xx操作成功直接返回数据
    }).then((item)=>console.log(item))
    .catch(console.error);

Network.dowanload('network/','lcoalpath',{
        onProgressUpdate:progressUpdateCallBack,// 进度回调
        retry:3,// 重试3次
        transformResponse: Network.transformDownloadResponseOkData, // 根据状态码只返回2xx对应的本地文件名
    }).then(path=>console.log(path))
    .catch(console.error);
```

### TypeScript

> 注: ~~TS开启完整的定义支持,依赖小程序官方定义 [miniprogram-api-typings](https://github.com/wechat-miniprogram/api-typings)~~
> 完整定义支持无需额外依赖

```js
import {setConfig,Request,Download,transformRequestResponseOkData,transformDownloadResponseOkData} from 'miniprogram-network';

// setConfig设置所有网络请求的全局默认配置,一次定义，所有文件中使用均生效
// 也可通过Request.Defaults,Download.Defaults,Upload.Defaults 分别设置不同默认配置
setConfig('baseURL','https://miniprogram-network.newfuture.cc/');

Request.get('index.html')
    .then(res=>console.log(res))
    .catch(console.error);
    .finally(()=>{console.info('done')}); //支持 finally操作

Request.patch<Item>('items/{id}',{dataKey:'dataValue'},{
        params: {id:123456}, // 绑定参数
        transformResponse:transformRequestResponseOkData, // 响应2xx操作成功直接返回数据
    }).then((item:Item)=>console.log(item))
    .catch(console.error);

Download.dowanload<string>('network/','lcoalpath',{
        onProgressUpdate:progressUpdateCallBack,// 进度回调
        retry:3,// 重试3次
        transformResponse: transformDownloadResponseOkData, // 根据状态码只返回2xx对应的本地文件名
    }).then((path:string)=>console.log(path))
    .catch(console.error);
```

更多用法和配置参看`miniprogram-request`,`miniprogram-downloader`,`miniprogram-uploader`


## Main Packages 主要模块和功能

* [miniprogram-network](network) 小程序网路库合集[![npm version](https://badge.fury.io/js/miniprogram-network.svg)](https://npmjs.com/package/miniprogram-network)
    * `Request` from [`miniprogram-request` ![npm version](https://badge.fury.io/js/miniprogram-request.svg)](https://npmjs.com/package/miniprogram-request)
    * `Upload` from [`miniprogram-uploader` ![npm version](https://badge.fury.io/js/miniprogram-uploader.svg)](https://npmjs.com/package/miniprogram-uploader)
    * `Download` from [`miniprogram-downloader` ![npm version](https://badge.fury.io/js/miniprogram-downloader.svg)](https://npmjs.com/package/miniprogram-downloader)
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
* [miniprogram-fetch](fetch) 小程序中使用[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch) [![npm version](https://badge.fury.io/js/miniprogram-fetch.svg)](https://npmjs.com/package/miniprogram-fetch)
    * [x] 自动队列支持
* ~~[miniprogram-promise](promise) 小程序异步API转Promise~~
    * [x] Finally Promise (支持finally)
    * [x] cancelable/abort (可取消的Promise)
* [miniprogram-network-life-cycle](life-cycle) 网络操作流程和事件
![life-cycle](https://user-images.githubusercontent.com/6290356/49631309-6bddc080-fa2c-11e8-9a41-88fb50b2a1b7.png)