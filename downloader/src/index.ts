export { CancelToken, ICancelTokenSource } from 'miniprogram-network-life-cycle';
export { Downloader, DownloadInit, DownloadOption } from './downloader';
export {
    DownloadParams,
    transfomDownloadSendDefault,
    transformDownloadResponseOkData 
} from './transform';

import { Downloader } from './downloader';
/**
 * 预定义全局Download
 */
// tslint:disable-next-line: export-name
export const DOWNLOAD = /*#__PURE__*/ new Downloader();
