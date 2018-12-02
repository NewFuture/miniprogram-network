import { buildParams } from 'miniprogram-network-utils';
import { DownloadConfig, DownloadOptions } from './configuration';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type DownloadParams = Pick<wx.DownloadFileOption, 'url' | 'filePath' | 'header'>
/**
 * 构建请求参数
 * @param data 
 */
export function defaultBeforeDowanload(data: DownloadConfig): DownloadParams {
    const wxParam: DownloadParams = {
        url: data.baseURL + buildParams(data.url, data.params),
        filePath: data.filePath,
        header: data.headers,
    }
    return wxParam;
}

/**
 * 处理返回数据
 * @param res 
 * @param config 
 */
export function defaultDownloadResponseTransformation(res: wx.DownloadFileSuccessCallbackResult, options: DownloadOptions): string;
export function defaultDownloadResponseTransformation<T>(res: wx.DownloadFileSuccessCallbackResult, options: DownloadOptions): T {
    return res.tempFilePath as any as T;
}

