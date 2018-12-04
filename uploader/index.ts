import 'miniprogram-network-utils/promise.finally';
import { Uploader } from './src/uploader';
export { CancelToken } from 'miniprogram-network-life-circle';
export { Uploader, UploadOption, UploadInit } from "./src/uploader";
export { uploadTransformSendDefault, uploadTransformResponseDefault, uploadTransformResponseOkData, UploadParams } from "./src/transform";
/**
 * 预定义全局 Upload 对象
 */
export const Upload = new Uploader();
