import { buildParams, Omit, getCommonOptions } from 'miniprogram-network-utils';
import { DownloadOption, wx } from './downloader';


/**
 * 微信请求参数 (不包含回调函数)
 */
export type DownloadParams = Omit<wx.DownloadFileOption, 'success' | 'fail' | 'complete'>

/**
 * 默认下载请求参数构建方法
 * @param data 
 */
export function transfomDownloadSendDefault(data: DownloadOption): DownloadParams {
    return getCommonOptions<DownloadParams>({
        url: buildParams(data.url, data.params, data.baseURL),
        header: data.headers
    }, data, ['filePath', 'jump', 'timestamp']);
}

/**
 * 正确返回返回数据处理方式
 * @param res 
 * @param config 
 */
export function transformDownloadResponseOkData(res: Parameters<NonNullable<wx.DownloadFileOption['success']>>[0], options: DownloadOption): string {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        throw res;
    }
    return res.tempFilePath;
}

