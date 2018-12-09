import { Uploader } from './src/uploader';
export { CancelToken } from 'miniprogram-network-life-cycle';
export { Uploader, UploadOption, UploadInit } from "./src/uploader";
export { transformUploadSendDefault, transformUploadResponseOkData, UploadParams } from "./src/transform";
/**
 * 预定义全局 Upload 对象
 */
export const Upload = new Uploader();