import { buildParams } from 'miniprogram-network-utils';
import { DownloadOption } from './downloader';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type DownloadParams = Exclude<wx.DownloadFileOption, 'success' | 'fail' | 'complete'>

/**
 * 默认下载请求参数构建方法
 * @param data 
 */
export function transfomDownloadSendDefault(data: DownloadOption): DownloadParams {
    const wxParam: DownloadParams = {
        url: data.baseURL + buildParams(data.url, data.params),
        filePath: data.filePath,
        header: data.headers,
    }
    return wxParam;
}

/**
 * 正确返回返回数据处理方式
 * @param res 
 * @param config 
 */
export function transformDownloadResponseOkData(res: wx.DownloadFileSuccessCallbackResult, options: DownloadOption): string {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        throw res;
    }
    return res.tempFilePath;
}

