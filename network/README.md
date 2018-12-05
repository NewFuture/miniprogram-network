
* [x] request
* [x] upload
* [x] download
* [] websocket

```js
import {Request,Download,Upload} from 'miniprogram-network';
Resuest.Defaults.baseUrl = 'https://aa.xx';
Request.get('test').then(s=>console.log(s));
```