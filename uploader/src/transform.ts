import { buildParams } from 'miniprogram-network-utils';
import { UploadOption } from './uploader';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type UploadParams = Exclude<wx.UploadFileOption, 'success' | 'fail' | 'complete'>

/**
 * 构建请求参数
 * @param data 
 */
export function uploadTransformSendDefault(data: UploadOption): UploadParams {
    const wxParam: UploadParams = {
        url: data.baseURL + buildParams(data.url, data.params),
        filePath: data.filePath,
        header: data.headers,
        formData: data.data,
        name: data.name,
    }
    return wxParam;
}

/**
 * 根据错误码处理数据
 * statusCode 2xx 操作成功仅返回data数据
 * 否则抛出错误(rejected)
 * @param res 
 * @param options 
 */
export function uploadTransformResponseOkData<T=any>(res: wx.UploadFileSuccessCallbackResult, options: UploadOption): T {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        throw res;
    }
    return res.data as any as T;
}

