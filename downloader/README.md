# miniprogram-downloader [![npm version](https://badge.fury.io/js/miniprogram-downloader.svg)](https://npmjs.com/package/miniprogram-downloader)

> An axios API like `Download` package for MiniProgram [alpha]
>
> 小程序下载封装 [alpha]
> 小程序网络库[miniprogram-network](https://github.com/NewFuture/miniprogram-network) 核心库之一


## API

### methods:

* `download<T>(options: DownloadOption): Promise<T>`;
* `download<T>(url: string, filePath?: string, options?: Exclude<DownloadOption, 'url' | 'filePath'>): Promise<T>`

### options

* [x] `url` 地址 **required** (_只能请求时设置for single request_)
* [x] `filePath` 保存地址 (_只能请求时设置for single request_) 
* [x] `cancelToken` 取消 (_只能请求时设置for single request_) 
* [x] `onProgressUpdate` 下载进度响应 (_只能请求时设置for single request_) 
* [x] `onHeadersReceived` 接收头响应 (_只能请求时设置for single request_) 
* [x] `jump` 是否插队 (_只能请求时设置for single request_)
* [x] `headers`
* [x] `params`
* [x] `baseUrl`
* [x] `headers`
* [x] `retry`
* [x] `transformSend`
* [x] `transformResponse`

### Global Listeners

* [x] `onSend` (before request data send & after request data transformed)
* [x] `onResponse` (after request response data transformed)
* [x] `onRejected` (before `catch` of Promise)
* [x] `onAbort`
* [x] `onComplete`

## Usage

### quick start

```js
import {Download} from 'miniprogram-downloder';
Download.download('item/1.jpg')
        .then(applyFunction) // 返回数据
        .catch(err=>wx.showToast({title:'下载失败'}));

Download.download({url:'item/1.jpg'})
        .then(applyFunction) // 返回数据
        .catch(err=>wx.showToast({title:'下载失败'}));
```


### 直接返回保存位置

```js
import {Download,transformDownloadResponseOkData} from 'miniprogram-downloder';
// 根据状态码，直接返回保存地址
//默认配置全局有效
Download.Defaults.transformResponse=transformDownloadResponseOkData;

//js
Download.download('item/1.jpg').then(console.log);//打印字符串，保存地址 
//TS
Download.download<string>('item/1.jpg')
        .then(path=>{
            console.log(path)//path 为保存路径
        }) 


//返回完整数据 对当前下载有效
Download.download(url:'item/1.jpg',null,{transformResponse:(res,o)=>res})
        .then(console.log) //打印 返回的Object
```



### CancelToken (abort)
可通过cancel token 方式取消请求
```js
import { Download, CancelToken } from 'miniprogram-request';

// 创建一个 tokensource
const source = CancelToken.source();

Download.download('items','tempfile' , { 
    // 配置 cancelToken
    cancelToken: source.token 
});

// 需要取消操作时
source.cancel('cancel the download');
```
