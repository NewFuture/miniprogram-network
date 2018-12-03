import { buildParams } from 'miniprogram-network-utils';
import { DownloadOption } from './downloader';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type DownloadParams = Exclude<wx.DownloadFileOption, 'success' | 'fail' | 'complete'>

/**
 * 构建请求参数
 * @param data 
 */
export function defaultDowanloadTransformSend(data: DownloadOption): DownloadParams {
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
export function defaultDownloadTransformResponse(res: wx.DownloadFileSuccessCallbackResult, options: DownloadOption): string;
export function defaultDownloadTransformResponse<T>(res: wx.DownloadFileSuccessCallbackResult, options: DownloadOption): T {
    return res.tempFilePath as any as T;
}

