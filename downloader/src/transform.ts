import { DownloadConfig, DownloadOptions, KeyRawValuePair } from './configuration';

/**
 * 请求参数预处理,
 * 输入配置; 返回 WxParam | Promise<WxParam>
 */
export type BeforeDownload = (data: DownloadConfig) => DownloadParams | PromiseLike<DownloadParams>;

/**
 * 相应数据数据预处理
 * 输入原始返回信息;返回数据或者包含数据的Promise
 */
export type afterDownload = (res: wx.DownloadFileSuccessCallbackResult, config: DownloadOptions) => any | Promise<any>

/**
 * 微信请求参数 (不包含回调函数)
 */
export type DownloadParams = Pick<wx.DownloadFileOption, 'url' | 'filePath' | 'header'>


function replaceParams(url: string, params: KeyRawValuePair): string {
    if (params) {
        for (let key in params) {
            url = url.replace(new RegExp('{' + key + '}', 'g'), params[key] as string);
        }
    }
    return url;
}

/**
 * 构建请求参数
 * @param data 
 */
export function defaultBeforeDowanload(data: DownloadConfig): DownloadParams {
    const wxParam: DownloadParams = {
        url: data.baseURL + replaceParams(data.url, data.params),
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
export function defaultDownloadResponseTransformation(res: wx.DownloadFileSuccessCallbackResult, config: DownloadOptions): string;
export function defaultDownloadResponseTransformation<T>(res: wx.DownloadFileSuccessCallbackResult, config: DownloadOptions): T {
    return res.tempFilePath as any as T;
}

