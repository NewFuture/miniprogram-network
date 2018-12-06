 # miniprogram-network

小程序基础库封装 [**alpha**]

## Packages

* [miniprogram-network](network) 小程序网路库集合
    * [request](https://www.npmjs.com/package/miniprogram-request)
    * [upload](https://www.npmjs.com/package/miniprogram-uploader)
    * [download](https://www.npmjs.com/package/miniprogram-downloader)
* [miniprogram-request](request) 小程序请求库
    * [x] Promise+泛型
    * [x] Cancelable 可取消
    * [x] Queue 底层队列维护
    * [x] retry 错误重试
    * [x] Interceptors 请求/响应拦截
    * [x] Listeners 事件监听
    * [x] OnHeaders 响应头回调
    * [x] axios like API
* [miniprogram-uploader](uploader) 小程序上传库
    * [x] Promise+泛型
    * [x] Cancelable 可取消
    * [x] OnProgress 进度回调
    * [x] OnHeaders 响应头回调
    * [x] Queue 底层队列维护
    * [x] retry 错误重试
    * [x] Interceptors 请求/响应拦截
    * [x] Listeners 事件监听
* [miniprogram-ddownloader](ddownloader) 小程序下载库
    * [x] Promise+泛型
    * [x] Cancelable 可取消
    * [x] Queue 底层队列维护
    * [x] retry 错误重试
    * [x] Interceptors 请求/响应拦截
    * [x] Listeners 事件监听
* [miniprogram-queue](queue) 小程序API队列封装
    * [x] 可自动注入/手动管理
    * [x] 支持取消操作(`abort`)
    * [x] 支持进度回调(progress)
    * [x] 支持插队
* [miniprogram-promise](promise) 小程序异步API转Promise
    * [x] Finally Promise (支持finally)
    * [x] cancelable/abort (可取消的Promise)
* [miniprogram-fetch](fetch) 小程序中使用[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
    * [x] 自动队列支持
    
