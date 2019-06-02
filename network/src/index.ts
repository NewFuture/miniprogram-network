import {
    DOWNLOAD,
    DownloadInit as NetworkDownloadInit,
    DownloadOption as NetworkDownloadOption,
    DownloadParams as NetworkDownloadParams
} from 'miniprogram-downloader';

import {
    REQUEST,
    RequestConfig as NetworkRequestConfig,
    RequestInit as NetworkRequestInit,
    RequestOption as NetworkRequestOption,
    RequestParams as NetworkRequestParams
} from 'miniprogram-request';
import {
    UPLOAD,
    UploadInit as NetworkUploadInit,
    UploadOption as NetworkUploadOption,
    UploadParams as NetworkUploadParams
} from 'miniprogram-uploader';
export {
    Http,
    REQUEST,
    transformRequestResponseOkData,
    transformRequestSendDefault,
    CancelToken,
    ICancelTokenSource
} from 'miniprogram-request';
export {
    Uploader,
    UPLOAD,
    transformUploadResponseOkData,
    transformUploadSendDefault
} from 'miniprogram-uploader';
export {
    Downloader,
    DOWNLOAD,
    transformDownloadResponseOkData,
    transfomDownloadSendDefault
} from 'miniprogram-downloader';
export {
    defaultKeyBuilder
} from 'miniprogram-network-cache';
export {
    cacheHttp,
    get as cacheGet,
    request as cacheRequest,
    download as cacheDownload,
    config as cacheConfig
} from './cache';
export { setConfig } from './set-config';

// ShortLink for Request
/**
 * REQUEST.request
 */
export const request: typeof REQUEST['request'] =
    /*#__PURE__*/
    REQUEST.request.bind(REQUEST);
/**
 * REQUEST.get
 */
// tslint:disable-next-line: no-reserved-keywords
export const get: typeof REQUEST['get'] =
    /*#__PURE__*/
    REQUEST.get.bind(REQUEST);
/**
 * REQUEST.post
 */
export const post: typeof REQUEST['post'] =
    /*#__PURE__*/
    REQUEST.post.bind(REQUEST);
/**
 * REQUEST.put
 */
export const put: typeof REQUEST['put'] =
    /*#__PURE__*/
    REQUEST.put.bind(REQUEST);
/**
 * REQUEST.delete
 */
export const del: typeof REQUEST['delete'] =
    /*#__PURE__*/
    REQUEST.delete.bind(REQUEST);
/**
 * REQUEST.patch
 */
export const patch: typeof REQUEST['patch'] =
    /*#__PURE__*/
    REQUEST.patch.bind(REQUEST);
/**
 * REQUEST.head
 */
export const head: typeof REQUEST['head'] =
    /*#__PURE__*/
    REQUEST.head.bind(REQUEST);

// Short Link for Download
/**
 * DOWNLOAD.download
 */
export const download: typeof DOWNLOAD['download'] =
    /*#__PURE__*/
    DOWNLOAD.download.bind(DOWNLOAD);

// ShortLink for Upload
/**
 * UPLOAD.upload
 */
export const upload: typeof UPLOAD['upload'] =
    /*#__PURE__*/
    UPLOAD.upload.bind(UPLOAD);

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
