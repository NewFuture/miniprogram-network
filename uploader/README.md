# miniprogram-uploader [![npm version](https://badge.fury.io/js/miniprogram-uploader.svg)](https://npmjs.com/package/miniprogram-uploader)

> An axios API like `Upload` package for MiniProgram [alpha]
>
> 小程序上传封装 [alpha]
> 小程序网络库[miniprogram-network](https://github.com/NewFuture/miniprogram-network) 核心库之一


## API

### methods:

* `upload<T>(options: UploadOption): Promise<T>`;
* `upload<T>(filePath: string, name: string, url?: string, options?):  Promise<T>`;

### options

* [x] filePath 文件路径  **required** (_只能请求时设置for single request_) 
* [x] name 上传文件名  **required** (_只能请求时设置for single request_) 
* [x] data 额外数据 (_只能请求时设置for single request_) 
* [x] cancelToken 取消 (_只能请求时设置for single request_) 
* [x] onProgress 下载进度响应 (_只能请求时设置for single request_) 
* [x] onHeaders 接收头响应 (_只能请求时设置for single request_) 
* [x] url 上传地址
* [x] responseType
* [x] headers
* [x] params
* [x] baseUri
* [x] headers
* [x] retry
* [x] transformSend
* [x] transformResponse
    
### Global Listeners
* [x] On Send (before request data send & after request data transformed)
* [x] On Response (after request response data transformed)
* [x] On rejected (before `catch` of Promise)
* [x] On abort
* [x] On complete

## Usage

### quick start

```js
import {Upload} from 'miniprogram-uploader';
Upload.upload(localPath,'file','https://upload.site/file')
        .then(console.log) // 返回数据
        .catch(err=>wx.showToast({title:'下载失败'}));
```


### 直接返回保存位置

```js
import {Upload,transformUploadResponseOkData} from 'miniprogram-downloder';
// 根据状态码，直接返回保存地址
//默认配置全局有效
Upload.Defaults.transformResponse=transformUploadResponseOkData;

//js
Upload.upload(localPath,'file','https://upload.site/file').then(console.log);//打印data
//TS
Upload.upload<{url:string}>(localPath,'file','https://upload.site/file')
        .then(data=>{
            console.log(data)//打印数据object {url:'xxx'}
        }) 


//返回完整数据 对当前下载有效
Upload.upload(url:'item/1.jpg',null,{transformResponse:(res,o)=>res})
        .then(console.log) //打印 返回的Object {errMsg:'xx',data:{url:'xxx'}}
```



### CancelToken (abort)
可通过cancel token 方式取消请求
```js
import { Upload, CancelToken } from 'miniprogram-request';

// 创建一个 tokensource
const source = CancelToken.source();

Upload.upload({ 
    filePath:localPath,
    file:'tempfile', 
    // 配置 cancelToken
    cancelToken: source.token 
});

// 需要取消操作时
source.cancel('canceled');
```
