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
// tslint:disable-next-line: export-name
export const REQUEST = /*#__PURE__*/ new Http();
