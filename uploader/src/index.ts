
import { Uploader } from './uploader';
export { CancelToken } from 'miniprogram-network-life-cycle';
export { Uploader, UploadOption, UploadInit } from "./uploader";
export { transformUploadSendDefault, transformUploadResponseOkData, UploadParams } from "./transform";
/**
 * 预定义全局 Upload 对象
 */
export const Upload = new Uploader();