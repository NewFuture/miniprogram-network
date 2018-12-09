import { Request, RequestInit } from "miniprogram-request";
import { Upload, UploadInit } from "miniprogram-uploader";
import { Download, DownloadInit } from "miniprogram-downloader";
import { Omit } from "miniprogram-network-utils";

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

type CommonConfig =Partial<Omit<(RequestInit | DownloadInit | UploadInit), 'transformSend' | 'transformResponse'>>;

/**
 * 设置所有网络请求基本配置
 * @param config 公共配置项
 */
function setConfig(config: CommonConfig): void;
/**
 * 设置所有网络请求公共配置
 * @example setConfig<'retry'>('retry',3);
 * @param key - 配置字段
 * @param value - 配置值
 */
function setConfig<T extends keyof CommonConfig>(key: T, value: CommonConfig[T]): void;
function setConfig(): void {
    if (arguments.length === 2) {
        const key: keyof CommonConfig = arguments[0];
        const value = arguments[1];
        Request.Defaults[key] = value;
        Download.Defaults[key] = value;
        Upload.Defaults[key] = value;
    } else if (typeof arguments[0] === 'object') {
        const config: CommonConfig = arguments[0];
        for (let key in config) {
            if (config.hasOwnProperty(key)) {
                Request.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig];
                Download.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig];
                Upload.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig];
            }
        }
    }
}

export {
    setConfig,
}