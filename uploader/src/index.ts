import { Uploader } from './uploader';

export {
  CancelToken,
  ICancelTokenSource
} from 'miniprogram-network-life-cycle';
export {
  transformUploadResponseOkData,
  transformUploadSendDefault,
  UploadParams
} from './transform';
export { Uploader, UploadInit, UploadOption, UploaderResponse } from './uploader';
/**
 * 预定义全局 Upload 对象
 */
// tslint:disable-next-line: export-name
export const UPLOAD = /*#__PURE__*/ new Uploader();
