# miniprogram-promise [![npm version](https://badge.fury.io/js/miniprogram-promise.svg)](https://npmjs.com/package/miniprogram-promise)

> MiniProgram Promise Asynchronous API poly fill
> 在小程序中异步API Promise封装

## Feathers：
* [x] finally Promise (支持Finally)
* [x] cancelable/abort (可取消的Promise)

## Usage

```js
import {cancelablePromisify} from 'miniprogram-promise';

request = cancelablePromisify(wx.request);

request({url:'xxx'})
    .then((res)=>{/**/})
    .catch((errr)=>{})
    .finally(()=>{});


request({url:'xxx'}).then().cancel()
```

## inspired by
* [minapp-wx](https://github.com/wx-minapp/minapp-wx)
* [promise-cancelable](https://github.com/joaogranado/promise-cancelable)
