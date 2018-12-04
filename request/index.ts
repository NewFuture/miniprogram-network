import 'miniprogram-network-utils/promise.finally';
import { Http } from './src/http';
export { CancelToken } from 'miniprogram-network-life-circle';
export { RequestParams, transformRequestSendDefault, transformRequestResponseOkData } from './src/transform';
export { RequestOption, RequestConfig, RequestInit } from './src/configuration';
export { Http };
/**
 * 预定义全局 Request 对象
 */
export const Request = new Http();
