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
export function defaultUploadTransformSend(data: UploadOption): UploadParams {
    const wxParam: UploadParams = {
        url: data.baseURL + buildParams(data.url, data.params),
        filePath: data.filePath,
        header: data.headers,
        formData: data.data,
        name: data.name
    }
    return wxParam;
}

/**
 * 处理返回数据
 * @param res 
 * @param config 
 */
export function defaultUploadTransformResponse(res: wx.UploadFileSuccessCallbackResult, options: UploadOption): any;
export function defaultUploadTransformResponse<T>(res: wx.UploadFileSuccessCallbackResult, options: UploadOption): T {
    return res.data as any as T;
}

