import { buildParams, Omit, getCommonOptions } from 'miniprogram-network-utils';
import { UploadOption, wx } from './uploader';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type UploadParams = Omit<wx.UploadFileOption, 'success' | 'fail' | 'complete'>

/**
 * 构建请求参数
 * baseUrl和dataUrl不同时为空
 * @param data 
 */
export function transformUploadSendDefault(data: UploadOption): UploadParams {
    return getCommonOptions<Partial<UploadParams>>({
        url: buildParams(data.url || '', data.params, data.baseURL),
        formData: data.data,
        header: data.headers,
    }, data, ['filePath', 'name', 'jump', 'timestamp']) as UploadParams;
}

/**
 * 根据错误码处理数据
 * statusCode 2xx 操作成功仅返回data数据
 * 否则抛出错误(rejected)
 * @param res 
 * @param options 
 */
export function transformUploadResponseOkData<T=any>(res: wx.UploadFileSuccessCallbackResult, options: UploadOption): T {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        throw res;
    }
    return res.data as any as T;
}

