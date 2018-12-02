import 'miniprogram-network-utils/promise.finally';
import { Http } from './src/http';

// 全局 Request 对象
const Request = new Http();
export {
    Request,
    Http
}

export { WxParam } from './src/transform';
export { RequestData, RequestOptions, Configuration } from './src/configuration';
export { CancelToken } from 'miniprogram-cancel-token';
