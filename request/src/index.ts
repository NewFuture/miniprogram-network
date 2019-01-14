import { Http } from './http';

export { CancelToken } from 'miniprogram-network-life-cycle';
export {
  RequestParams,
  transformRequestSendDefault,
  transformRequestResponseOkData
} from './transform';
export { Http, RequestOption, RequestConfig, RequestInit } from './http';

/**
 * 预定义全局 REQUEST 对象
 */
export const REQUEST = new Http();
