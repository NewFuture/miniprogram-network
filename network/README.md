# miniprogram-network [![npm version](https://badge.fury.io/js/miniprogram-network.svg)](https://npmjs.com/package/miniprogram-network)

> A Network package for MiniProgram
>
> 小程序底层网络库封装


## Integration
* [x] [request](https://www.npmjs.com/package/miniprogram-request)
* [x] [upload](https://www.npmjs.com/package/miniprogram-uploader)
* [x] [download](https://www.npmjs.com/package/miniprogram-downloader)
* [ ] websocket


## 网络库封装

* [x] Promise<T>泛型Promise
* [x] CancelToken 可取消操作
* [x] Queue 队列支持
* [x] Retry 网络错误自动重试
* [x] Cache 底层缓存支持
* [x] 每个请求的原生回调接口支持(`onHeadersReceived`事件)和(`onProgressUpdate`事件)
* [x] Interceptors 拦截器 transform send data / transform response data
* [x] Listeners 全局事件监听`onSend`,`onResponse`,`onRejected`,`onAbort`,`onComplete`

## 安装
```
npm i miniprogram-network
```

## 配置 

### 通用配置

* [x] `headers` 请求头
* [x] `params` URL替换参数
* [x] `baseURL` 根URL
* [x] `retry` 重试次数
* [x] `timestamp` 是否记录发送和响应时间戳
* [x] `transformSend` 输入转换函数(Request,Download,Upload需分别设置)
* [x] `transformResponse` 输出转换函数 (Request,Download,Upload需分别设置)

### 不同网络请求单独配置项

* [Request配置项](../request#options)
* [Download配置项](../downloader#options)
* [Upload配置项](../uploader#options)

### transform 数据转换

默认的`transformResponse`直接返回小程序原始的返回数据{statusCode,...}

同时提供了根据状态码返回对应数据的转换方式

```js
import {
    REQUEST, transformRequestResponseOkData,
    DOWNLOAD, transformDownloadResponseOkData,
    UPLOAD, transformUploadResponseOkData,
} from 'miniprogram-network';

// Request的默认响应拦设为成transformRequestResponseOkData,
// 正常2xx返回data部分，否则rejected
REQUEST.Defaults.transformResponse = transformRequestResponseOkData;
// Download的默认响应拦设为transformDownloadResponseOkData，
// 正常2xx返回string,否则rejected
DOWNLOAD.Defaults.transformResponse = transformDownloadResponseOkData;
// Upload默认响应拦截transformUploadResponseOkData,
// 与小程序wx.uploadFile 不同之处会尝试进行JSON.parse反序列化字符串
// 正常2xx返回data,否则rejected
UPLOAD.Defaults.transformResponse = transformUploadResponseOkData;

DOWNLOAD.download('url')
    .then(path=>{
        console.log(path);//string
    }).catch(res=>{
        console.error(res);//objct
    });

// 参数绑定
Network.put('items/{id}',data,{
        params: {id:123456}, // Object绑定模板参数
    }).then(console.log)
Network.put('items/{0}',data,{
        params: [123456], // 数组绑定模板参数
    }).then(console.log)
```

## 快速配置 setConfig

```js
import { setConfig } from 'miniprogram-network';

//将Request,Upload,Download的默认baseURL设置为'https://api.newfuture.cc'
setConfig('baseURL', 'https://api.newfuture.cc');

//等效方式
setConfig({
    baseURL:'https://api.newfuture.cc'
})

```

## Cache 缓存

```js
import {
    cacheConfig, // 缓存配置
    cacheGet, // 与get方法一致,自动使用cache
    cacheDownload, // 与download方法一致，自动使用cache
    cacheRequest, // 与request方法一致,自动使用cache
    } from 'miniprogram-network';

CacheConfig.expire = 30*60*1000;//设置缓存有效时间
// 设置缓存条件,默认响应状态为2xx缓存数据
CacheConfig.resultCondition = function(res){
    return true;
}

//cacheGet 与 Request共用配置
cacheGet('xxx').then(resolve);
cacheGet('xxx').then(resolve);

// cacheDownload 与 Download共用配置
cacheDownload('xxx').then();

```

## LifeCycle

详情说明[miniprogram-network-life-cycle](../life-cycle/)
![](https://user-images.githubusercontent.com/6290356/49631309-6bddc080-fa2c-11e8-9a41-88fb50b2a1b7.png)
