# miniprogram-request [![npm version](https://badge.fury.io/js/miniprogram-request.svg)](https://npmjs.com/package/miniprogram-request)

> A better Request package for MiniProgram API
>
> 小程序请求封装


### Features
  
* [x] Promise
* [x] Cancelable
* [x] Queue
* [x] Wx request option
    * [x] responseType
    * [x] headers
    * [ ] ~~dataType~~ (merged into `responseType`)
    * [ ] ~~timeout~~ (not supported for each request)
* [ ] Configuration
    * [x] baseUri
    * [x] replace parameters
    * [x] Retry when network failure
    * [ ] authentication?
* [x] Interceptors in Lifecycle (only one,modify data or status)
    * [x] transform request data
    * [x] transform response data
* [x] Global Listeners
    * [x] On Send (before request data send & after request data transformed)
    * [x] On Response (after request response data transformed)
    * [x] On resolved (before `then` of Promise)
    * [x] On rejected (before `catch` of Promise)
    * [x] On abort
    * [x] On complete
* [ ] On Progress?
* [ ] ~~pause/resume~~ (promise/async instead)

### API
* request
* create
*



## LifeCircle

![Request Life Circle](https://user-images.githubusercontent.com/6290356/47618036-485c5780-db09-11e8-8db8-57d106883607.png)