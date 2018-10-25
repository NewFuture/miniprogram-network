# miniprogram-request [![npm version](https://badge.fury.io/js/miniprogram-request.svg)](https://npmjs.com/package/miniprogram-request)

> A better Request package for MiniProgram API
>
> 小程序请求封装


Features

* [ ] Promise
* [ ] Cancelable
* [ ] Queue
* [ ] Wx request params
    * [ ] timeout
    * [ ] datatype
* [ ] Retry when network failure
* [ ] Configuration
    * [ ] BaseUri
    * [ ] Authentication
    * [ ] ...
* [ ] Interceptors in Lifecycle (only one,modify data or status)
    * [ ] transform request data
    * [ ] transform response data
* [ ] Listeners
    * [ ] On Send (before request data send & after request data transformed)
    * [ ] On Response (after request response data transformed)
    * [ ] On resolved (before `then` of Promise)
    * [ ] On rejected (before `catch` of Promise)
    * [ ] On abort
    * [ ] On complete
* [ ] On Progress?
