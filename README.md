 # miniprogram

小程序基础库封装 [**Experimental(尚未经过生产环境测试)**]

## Packages

* [miniprogram-queue](packages/queue) 小程序API队列封装
    * [x] 可自动注入/手动管理
    * [x] 支持取消操作(`abort`)
    * [x] 支持进度回调(progress)
* [miniprogram-promise](packages/promise) 小程序异步API转Promise
    * [x] Finally Promise (支持finally)
    * [x] cancelable/abort (可取消的Promise)
* [miniprogram-fetch](packages/fetch) 小程序中使用[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
    * [x] 自动队列支持
    
