import { buildParams, getCommonOptions, Omit } from 'miniprogram-network-utils';
import { FullDownloadOption, wx } from './downloader';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type DownloadParams = Omit<wx.DownloadFileOption, 'success' | 'fail' | 'complete'>;

/**
 * 默认下载请求参数构建方法
 * @param data - 完整配置参数
 */
export function transfomDownloadSendDefault<T extends {} = {}>(data: T & FullDownloadOption<T>): DownloadParams {
    return getCommonOptions<DownloadParams>(
        {
            url: buildParams(data.url, data.params, data.baseURL),
            header: data.headers
        },
        data,
        ['filePath']
    );
}

/**
 * 正确返回返回数据处理方式
 * @param res - 返回结果
 * @param config - 完整参数
 */
export function transformDownloadResponseOkData(
    res: Parameters<NonNullable<wx.DownloadFileOption['success']>>[0],
    options: FullDownloadOption
)
    : string {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        throw res;
    }
    return res.tempFilePath;
}
