import {
  DOWNLOAD,
  Downloader,
  DownloadInit as NetworkDownloadInit,
  DownloadOption as NetworkDownloadOption,
  DownloadParams as NetworkDownloadParams
} from 'miniprogram-downloader';
import {
  Http,
  REQUEST,
  RequestConfig as NetworkRequestConfig,
  RequestInit as NetworkRequestInit,
  RequestOption as NetworkRequestOption,
  RequestParams as NetworkRequestParams
} from 'miniprogram-request';
import {
  UPLOAD,
  Uploader,
  UploadInit as NetworkUploadInit,
  UploadOption as NetworkUploadOption,
  UploadParams as NetworkUploadParams
} from 'miniprogram-uploader';

export { setConfig } from './set-config';
export {
  get as getCache,
  request as requestCache,
  download as downloadCache,
  config as cacheConfig
} from './cache';
export {
  Http,
  REQUEST as Request,
  transformRequestResponseOkData,
  transformRequestSendDefault,
  CancelToken
} from 'miniprogram-request';
export {
  Uploader,
  UPLOAD as Upload,
  transformUploadResponseOkData,
  transformUploadSendDefault
} from 'miniprogram-uploader';
export {
  Downloader,
  DOWNLOAD as Download,
  transformDownloadResponseOkData,
  transfomDownloadSendDefault
} from 'miniprogram-downloader';
// ShortLink for Request
/**
 * Request.request
 */
export const request: Http['request'] = REQUEST.request.bind(
  REQUEST
);
/**
 * Request.get
 */
// tslint:disable-next-line: no-reserved-keywords
export const get: Http['get'] = REQUEST.get.bind(REQUEST);
/**
 * Request.post
 */
export const post: Http['post'] = REQUEST.post.bind(REQUEST);
/**
 * Request.put
 */
export const put: Http['put'] = REQUEST.put.bind(REQUEST);
/**
 * Request.delete
 */
export const del: Http['delete'] = REQUEST.delete.bind(
  REQUEST
);
/**
 * Request.patch
 */
export const patch: Http['patch'] = REQUEST.patch.bind(
  REQUEST
);
/**
 * Request.head
 */
export const head: Http['head'] = REQUEST.head.bind(REQUEST);

// Short Link for Download
/**
 * Download.download
 */
export const download: Downloader['download'] = DOWNLOAD.download.bind(
  DOWNLOAD
);

// ShortLink for Upload
/**
 * Upload.upload
 */
export const upload: Uploader['upload'] = UPLOAD.upload.bind(
  UPLOAD
);

export declare namespace Network {
  /**
   * Full Options for send a Request
   */
  type RequestOption = NetworkRequestOption;
  /**
   * Extra Request Config for each Request
   */
  type RequestConfig = NetworkRequestConfig;
  /**
   * Request Defaults Config to init a HTTP
   */
  type RequestInit = NetworkRequestInit;
  /**
   * return type for Request TransformSend
   */
  type RequestParams = NetworkRequestParams;
  /**
   * Full Options for download
   */
  type DownloadOption = NetworkDownloadOption;
  /**
   * Defaults Config to init a Downloader
   */
  type DownloadInit = NetworkDownloadInit;
  /**
   * return type for Download TransformSend
   */
  type DownloadParams = NetworkDownloadParams;
  /**
   * Full Options for upload
   */
  type UploadOption = NetworkUploadOption;
  /**
   * Defaults Config to init a Uploader
   */
  type UploadInit = NetworkUploadInit;
  /**
   * return type for Upload TransformSend
   */
  type UploadParams = NetworkUploadParams;
}
