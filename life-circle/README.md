# miniprogram-network-life-cycle [![npm version](https://badge.fury.io/js/miniprogram-network-life-cycle.svg)](https://npmjs.com/package/miniprogram-network-life-cycle)



## 网络请求生命周期

* [x] Promise
* [x] Cancelable
* [x] Interceptors in Lifecycle (only one,modify data or status)
    * [x] transform request data
    * [x] transform response data
* [x] Global Listeners
    * [x] On Send (before request data send & after request data transformed)
    * [x] On Response (after request response data transformed)
    * [ ] On resolved? (before `then` of Promise)
    * [x] On rejected (before `catch` of Promise)
    * [x] On abort
    * [x] On complete

## API

* `Request.Defaults` 全局配置项目
    * `transformSend(options: Exclude<FullOptions, 'transformSend' | 'transformResponse'>) => wx.Options | Promise<wx.Options>` 发送前转换参数
    * `transformResponse(res: wx.SuccessCallbackResult, config: TFullOptions) => any | Promise<any>` 数据返回转换参数
* `Reqeust.Listeners` 全局事件监听列表
    * `[onSend(options: RequestOptions) => any]`; 发送前事件监听列表
    * `[onResponse(res: wx.RequestSuccessCallbackResult, options: RequestOptions) => any]`; 收到服务器响应事件监听列表
    * `[onComplete(res: wx.GeneralCallbackResult, options: RequestOptions) => any]`;每个操作完成事件响应
    * `[onReject(res: any | wx.GeneralCallbackResult, options: RequestOptions) => any]`;操作最终失败响应事件
    * `[onAbort(reason: any, options: RequestOptions) => any]`;取消操作响应事件



## LifeCircle

![Request Life Circle](https://user-images.githubusercontent.com/6290356/49631309-6bddc080-fa2c-11e8-9a41-88fb50b2a1b7.png)

