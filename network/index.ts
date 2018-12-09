import { Request, Http } from "miniprogram-request";
import { Downloder, Download } from "miniprogram-downloader";
import { Uploader, Upload } from "miniprogram-uploader";

export { setConfig } from "./src/set-config";

export {
    Http,
    Request,
    RequestOption,
    RequestConfig,
    RequestInit,
    RequestParams,
    transformRequestResponseOkData,
    transformRequestSendDefault,
    CancelToken,
} from "miniprogram-request";

export {
    Uploader,
    Upload,
    UploadOption,
    UploadInit,
    UploadParams,
    transformUploadResponseOkData,
    transformUploadSendDefault,
} from 'miniprogram-uploader';

export {
    Downloder,
    Download,
    DownloadOption,
    DownloadInit,
    DownloadParams,
    transformDownloadResponseOkData,
    transfomDownloadSendDefault,
} from 'miniprogram-downloader';

// ShortLink for Request
/**
 * Request.request
 */
export const request: Http['request'] = Request.request.bind(Request) as Http['request'];
/**
 * Request.get
 */
export const get: Http['get'] = Request.get.bind(Request) as Http['get'];
/**
 * Request.post
 */
export const post: Http['post'] = Request.post.bind(Request) as Http['post'];
/**
 * Request.put
 */
export const put: Http['put'] = Request.put.bind(Request) as Http['put'];
/**
 * Request.delete
 */
export const del: Http['delete'] = Request.delete.bind(Request) as Http['delete'];
/**
 * Request.patch
 */
export const patch: Http['patch'] = Request.patch.bind(Request) as Http['patch'];
/**
 * Request.head
 */
export const head: Http['head'] = Request.head.bind(Request) as Http['head'];

// Short Link for Download
/** 
 * Download.download
*/
export const download: Downloder['download'] = Download.download.bind(Download) as Downloder['download'];

// ShortLink for Upload
/**
 * Upload.upload
 */
export const upload: Uploader['upload'] = Upload.upload.bind(Upload) as Uploader['upload'];
