# miniprogram-cancel-token [![npm version](https://badge.fury.io/js/miniprogram-cancel-token.svg)](https://npmjs.com/package/miniprogram-cancel-token)

> Cancle Token for Promise in MiniProgram

## APT

### CancelTokenSource 外部调用(暴露出的API接口)

* `cancel(reason?)` 取消操作
* `token` 调用cancel时所取消的 CancelToken 

### CancelToken 响应cancel操作(API内部实现)

* `#source()` 静态方法创建一个CancelTokenSource
* `promise` 调用cancel时所触发的promise;
* `isCancelled()` 判断是否已经取消过;
* `throwIfRequested()` 取消则抛出异常;

## usage

```js
function doFoo(foo, cancelToken) {
    return new Promise((resolve, reject) => {
      cancelToken.throwIfRequested();
      cancelToken.promise.then(()=>{
          // do somethig to cancel
          // like xhr.abort()
          foo.abort();
      })
      resolve('something');
  });
}
```

```js
import CancelToken from 'miniprogram-cancel-token'
//create CancelToken Source
const cts = CancelToken.scoure();
//use canceltoken
doFoo(foo,stc.token).then(console.log);
// cancle it
cts.cancel();

```