// import { RequestData, RequestOptions } from './configuration';
import { buildParams } from 'miniprogram-network-utils';
import { RequestOption } from './configuration';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type RequestParams = Exclude<wx.RequestOption, 'success' | 'fail' | 'complete'>

/**
 * 构建请求参数
 * @param data 
 */
export function defaultTransformSend(data: RequestOption): RequestParams {
    const wxParam: RequestParams = {
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

// /**
//  * 默认请求返回数据
//  * @param res 
//  * @param config 
//  */
// export function requestTransformResponseDefault(res: wx.RequestSuccessCallbackResult, config: RequestOption): wx.RequestSuccessCallbackResult {
//     return res;
// }

export function requestTransformResponseOkData<T=any>(res: wx.RequestSuccessCallbackResult, config: RequestOption): T {
    return res.data as any as T;
}

