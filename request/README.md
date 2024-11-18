# miniprogram-request [![npm version](https://badge.fury.io/js/miniprogram-request.svg)](https://npmjs.com/package/miniprogram-request)

> An axios API like `Request` package for MiniProgram
>
> 更好用的小程序请求库封装
> 小程序网络库[miniprogram-network](https://github.com/NewFuture/miniprogram-network) 核心库之一

## API

### methods:

* `request<T>(options): Promise<T>`;
* `request<T>(method, action, data?, config?): Promise<T>`;
* `get<T>(action, data?, config?): Promise<T>`;
* `post<T>(action, data?, config?): Promise<T>`;
* `put<T>(action, data?, config?): Promise<T>`;
* `delete<T>(action, data?, config?): Promise<T>`;
* `patch<T>(action, data?, config?): Promise<T>`;
* `head<T>(action, data?, config?): Promise<T>`;

### options

* [x] `url` 地址 **required** (_只能请求时设置for single request_)
* [x] `method` 方法 (_只能请求时设置for single request_) 
* [x] `data` 数据 (_只能请求时设置for single request_) 
* [x] `cancelToken` 取消 (_只能请求时设置for single request_) 
* [x] `onHeadersReceived` 接收头响应 (_只能请求时设置for single request_) 
* [x] `timeout` 自定义超时时间ms (_只能请求时设置for single request_)
* [x] `responseType` 返回数据类型
* [x] `headers` 请求头
* [x] `params` URL参数
* [x] `baseURL` 根URL
* [x] `retry` 重试次数
* [x] `timestamp` 是否记录发送和响应时间戳
* [x] `transformSend` 输入转换函数
* [x] `transformResponse` 输出转换函数

### Global Listeners

* [x] `onSend` (before request data send & after request data transformed)
* [x] `onResponse` (after request response data transformed)
* [x] `onRejected` (before `catch` of Promise)
* [x] `onAbort`
* [x] `onComplete`

## Usage

## install
```
npm i miniprogram-request
```

### quick start

```js
import {REQUEST} from 'miniprogram-request';

// 设置全局配置，设置一次全部生效
// 设置请求根地址,可选
REQUEST.Defaults.baseURL = "https://minipgrogram.newfuture.cc/"
// 添加监听时间 可选
REQUEST.Listeners.onResponse.push(console.log); // 记录每次响应

REQUEST.get('items')
        .then(applyFunction) // 返回数据
        .catch(err=>wx.showToast({title:'数据拉取失败'}));
```

### URL build

```js
REQUEST.post('/items',{name:'future'})
// POST /items
// {name:"future"}

REQUEST.get('/items/{id}',{show_detail:false},{params:{id:12345}})
// GET /items/12345?show_detail=false

REQUEST.put('/items/{id}',{name:'new'},{params:{id:12345}})
// PUT /items/12345
// {name:"new"}
// --- json 序列化body


//由于小程序不支持Patch，此处使用X-HTTP-Method-Override实现Patch
//此功能需要服务器端支持
REQUEST.patch('/items/{id}',{name:'new'},{params:{id:12345}})
// POST /items/12345
// X-HTTP-Method-Override: PATCH
// {name:"new"}


```

###  TypeScript
泛型支持
```js
// TS 类型推断
import { REQUEST, transformRequestResponseOkData } from 'miniprogram-request';

// 自动提取返回值为 2xx 时的 `response.data`
REQUEST.Defaults.transformResponse = transformRequestResponseOkData

interface Item {
    id: number,
    name: string
}

// 泛型 then的参数值类型为 Item[]
REQUEST.get<Item[]>('/items')
    .then(list => list.forEach(i => console.log(i.id + i.name)))
```

### CancelToken (abort)
可通过cancel token 方式取消请求
```js
import { REQUEST, CancelToken } from 'miniprogram-request';

// 创建一个 tokensource
const source = CancelToken.source();

REQUEST.get('items', { skip: 100 }, { 
    // 配置 cancelToken
    cancelToken: source.token 
});

// 需要取消操作时
source.cancel('cancel the reqeust');
```

## configuration

### 修改全局配置
```js
REQUEST.Defaults.retry = 2;//设置网络错误时重试次数
```

### 全部可配置内容
```js
{

    /**
    * 请求的相对地址
    */
    url: string;

    /**
    * 请求方法
    * HTTP request mthod: GET POST ...
    */
    method:'OPTIONS'|'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'TRACE'|'CONNECT';

    /**
     * 请求数据
     * reqeust data
     *  * **data 数据说明：**
     *
     * 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
     *
     * *   对于 `GET` 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     * *   对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会对数据进行 JSON 序列化
     * *   对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     */
    data?: any;
    
    /**
     * 取消操作的 CancelToken 
     */
    cancelToken?: CancelToken;

    /**
     * 接收到响应头回调
     */
    onHeadersReceived?: TwxTask['onHeadersReceived'];

    /**
    * 请求的根目录
    * Base URL for request
    */
    baseURL?: string;
    
    /**
    * 自定义头 
    * user defined headers
    */
    headers?: KeyBasicValuePair;

    /**
     * URL Path
     * the path parameters to be replace in path
     * Must be a plain object
     * @example 
     *  url = "/{ID}/status"
     *  param = {ID: 12345}
     * request url will be /1234/status
     */
    params?: KeyBasicValuePair,

    /**
    * 重试次数 默认重试1次
    * retry times when fail
    */
    retry?: number; 

    /**
     * response data type
     */
    responseType?: "json" | "text" | "arraybuffer";

    /**
     * 修改数据或者头;返回 wx.request参数
     * 异步返回promise
     * You may modify the data or headers object before it is sent.
     */
    transformSend?: (options) => PromiseOrValue<Exclude<wx.options, 'complete' | 'success' | 'fail'>>;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?:  (res, options) => any|Promise<any>;

}
```

### 单次请求特殊配置

```js
/每次请求全部可配置参数
//已设置的参数会覆盖默认参数
//仅对此次请求生效
REQUEST.request({
    url: 'items',
    method: 'POST',
    data: {},
    cancelToken: null,
    baseURL: 'https://qq.com/',
    headers: {},
    params: null,
    retry: 3,
    responseType: "json",
    transformSend: transformRequestSendDefault,
    transformResponse: transformRequestResponseOkData
})

// 快速请求配置参数
REQUEST.post('items', {}, {
    //除了method,url和 data 不能设置其他均可设置
    cancelToken: null,
    baseURL: 'https://qq.com/',
    headers: {},
    params: null,
    retry: 3,
    responseType: "json",
    transformSend: transformRequestSendDefault,
    transformResponse: transformRequestResponseOkData
})
```

### 创建一个新的Http管理对象
```js
// 重新创建一个Http
const http = new Http({
    //除了method,url，data 和cancelToken不能设置其他均可设置
    baseURL: 'https://qq.com/',
    headers: {},
    params: null,
    retry: 3,
    responseType: "json",
    transformSend: transformRequestSendDefault,
    transformResponse: transformRequestResponseOkData
})
```

## LifeCircle

![Request Life Circle](https://user-images.githubusercontent.com/6290356/47618036-485c5780-db09-11e8-8db8-57d106883607.png)


## references

* API inspired by <https://github.com/axios/axios>
