import { Request, CancelToken } from '../index';
// 创建一个 tokensource
const source = CancelToken.source();

Request.get('items', { skip: 100 }, { 
    // 配置 cancelToken
    cancelToken: source.token 
});

// 需要取消操作时
source.cancel('cancel the reqeust');