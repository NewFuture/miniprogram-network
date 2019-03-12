import { Http } from './http';

export { CancelToken } from 'miniprogram-network-life-cycle';
export {
  Http,
  RequestConfig,
  RequestInit,
  RequestOption
} from './http';
export {
  RequestParams,
  transformRequestResponseOkData,
  transformRequestSendDefault
} from './transform';

/**
 * 预定义全局 REQUEST 对象
 */
// tslint:disable-next-line: export-name
export const REQUEST = /*#__PURE__*/ new Http();
