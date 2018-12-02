import { RequestData, RequestOptions } from './configuration';
import { buildParams } from 'miniprogram-network-utils';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type WxParam = Pick<wx.RequestOption, 'url' | 'data' | 'dataType' | 'header' | 'method' | 'responseType'>

/**
 * 构建请求参数
 * @param data 
 */
export function defaultRequestTransformation(data: RequestData): WxParam {
    const wxParam: WxParam = {
        url: data.baseURL + buildParams(data.url, data.params),
        data: data.data,
        method: data.method,
        header: data.headers,
    }
    if (data.responseType === 'arraybuffer') {
        wxParam.responseType = 'arraybuffer';
    } else if (data.responseType === 'json') {
        wxParam.dataType = 'json';
    }
    return wxParam;
}

/**
 * 处理返回数据
 * @param res 
 * @param config 
 */
export function defaultResponseTransformation<T>(res: wx.RequestSuccessCallbackResult, config: RequestOptions): T {
    return res.data as any as T;
}

