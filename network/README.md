# miniprogram-network [![npm version](https://badge.fury.io/js/miniprogram-network.svg)](https://npmjs.com/package/miniprogram-network)

> A Network package for MiniProgram
>
> 小程序底层网络库封装


## Integration
* [x] [request](https://www.npmjs.com/package/miniprogram-request)
* [x] [upload](https://www.npmjs.com/package/miniprogram-uploader)
* [x] [download](https://www.npmjs.com/package/miniprogram-downloader)
* [x] cache
* [ ] websocket


## 网络库封装

* [x] Promise<T>泛型Promise
* [x] CancelToken 可取消操作
* [x] Retry 网络错误自动重试
* [x] Cache 底层缓存支持(包括并发请求合并)
* [x] Timeout 自定义超时时间
* [x] timestamp 记录请求时间戳
* [x] 每个请求的原生回调接口支持(`onHeadersReceived`事件)和(`onProgressUpdate`事件)
* [x] Interceptors 拦截器 transform send data / transform response data
* [x] Listeners 全局事件监听`onSend`,`onResponse`,`onRejected`,`onAbort`,`onComplete`
* [x] 支持全局配置和每个请求单独配置

tips: `miniprogram-network` >= 4.0.0  底层默认不在直接使用`miniprogram-queue`进行队列封装, 如果有需要可自行引用, 或直接使用 v4.x

> * wx.request 自基础库 1.4.0 (2017.07) 开始支持队列
> * wx.downloadFile 自基础库 1.4.4 (2017.07) 开始支持队列
> * wx.uploadFile 自基础库 2.4.1 (2018.11) 开始支持队列

## 安装
```
npm i miniprogram-network
```
```ts
import {post} from 'miniprogram-network';
post('xxx',data).then(console.log)
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

* [x] `timeout` 请求超时时间
* [x] `cancelToken` 取消请求的Token
* [x] `onHeadersReceived` header 接受回调
* [x] `onProgressUpdate` 进度回调
* [Request配置项](../request#options)
* [Download配置项](../downloader#options)
* [Upload配置项](../uploader#options)

### 缓存配置 

全局缓存策略 `cacheConfig`

* [x] `cacheConfig.expire` 缓存时间单位`ms` 默认 `10分钟`
* [x] `cacheConfig.excludeMethod` string[] 不缓存的操作,默认`['POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']`
* [x] `cacheConfig.resultCondition`结果缓存条件,默认`isOkResult`(2xx)
* [x] `cacheConfig.keyBuilder` 缓存key生成规则,修改后`excludeMethod`将失效

单个请求设置缓存

* [x] `expire` 缓存时间单位`ms` 默认 使用全局配置


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

### 取消操作 CancelToken (abort)

可通过cancel token 方式取消请求
```js
import { get, CancelToken } from 'miniprogram-network';

// 创建一个 tokensource
const source = CancelToken.source();

get('items', { skip: 100 }, { 
    // 配置 cancelToken
    cancelToken: source.token 
});

// 需要取消操作时
source.cancel('cancel the get');
```

## 快速配置 setConfig

```ts
import { setConfig } from 'miniprogram-network';

//将Request,Upload,Download的默认baseURL设置为'https://api.newfuture.cc'
setConfig('baseURL', 'https://api.newfuture.cc');

//等效方式
setConfig({
    baseURL:'https://api.newfuture.cc'
})

```

## Cache 缓存

* `cacheRequest`,`cacheGet`与`REQUEST`公用默认配置
* `cacheDownload`与`DOWNLOAD`公用默认配置


```js
import {
    cacheConfig, // 缓存配置
    cacheGet, // 与get方法一致,自动使用cache
    cacheDownload, // 与download方法一致，自动使用cache
    cacheRequest, // 与request方法一致,自动使用cache
    } from 'miniprogram-network';

cacheConfig.expire = 10*60*1000;//设置缓存有效时间
// 设置缓存条件,默认响应状态为2xx缓存数据
cacheConfig.resultCondition = function(res){
    return res.statusCode === 200;
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
