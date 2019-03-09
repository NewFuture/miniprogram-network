export { CancelToken } from 'miniprogram-network-life-cycle';
export { Downloader, DownloadOption, DownloadInit } from './downloader';
export {
  transfomDownloadSendDefault,
  transformDownloadResponseOkData,
  DownloadParams
} from './transform';

import { Downloader } from './downloader';
/**
 * 预定义全局Download
 */
// tslint:disable-next-line: export-name
export const DOWNLOAD = /*@__PURE__*/ new Downloader();
