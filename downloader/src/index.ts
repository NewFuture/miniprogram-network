export { CancelToken } from 'miniprogram-network-life-cycle';
export { Downloader, DownloadOption, DownloadInit } from './downloader';
export {
  transfomDownloadSendDefault,
  transformDownloadResponseOkData,
  DownloadParams
} from './transform';
/**
 * 于定义全局Download
 */
import { Downloader } from './downloader';
export const Download = new Downloader();
