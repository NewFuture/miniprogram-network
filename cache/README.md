# miniprogram-network-cache [![npm version](https://badge.fury.io/js/miniprogram-network-cache.svg)](https://npmjs.com/package/miniprogram-network-cache)


## 请求缓存
```js
import {CacheOperator} from 'miniprogram-network-cache';
const cacheRequest = CacheOperator.createHandler(wx.request);
cacheRequest({url:'https://miniprogram-network.newfuture.cc'})
cacheRequest({url:'https://miniprogram-network.newfuture.cc'}) // 请求将被合并
```

```js
import {CacheOperator} from 'miniprogram-network-cache';
const cacheRequest = new CacheOperator(wx.request,{ 
    /**
     * 缓存时间
     */
    expire: number;
    /**
     * 结果缓存条件
     * @param res 结果
     */
    resultCondition:(res: TRes)=>boolean;
    /**
     * 参数缓存条件,无则全部缓存
     * @param options request/downloadFile参数
     * @returns 返回string键值,无返回值时不进行缓存和请求合并
     */
    keyBuilder?(options: TOptions): string | void | null;
});

```

## 配置

* `expire` 缓存过期时间单位ms,为0时不缓存只合并请求
* `resultCondition` 结果缓存条件, 默认条件 `isOkResult`
* `keyBuilder` 自定义缓存键, 无返回值则不缓存, 默认`defaultKeyBuilder`

## export

* `defaultKeyBuilder(opts)`
* `isOkResult(res)`
* `CacheOperator`