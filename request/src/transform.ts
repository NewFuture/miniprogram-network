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
export function transformRequestSendDefault(data: RequestOption): RequestParams {
    const wxParam: RequestParams = {
        url: buildParams(data.url, data.params, data.baseURL),
        data: data.data,
        method: data.method,
        header: data.headers,
        onHeadersReceived: data.onHeadersReceived,
        // onProgressUpdate:data.onProgressUpdate,
        jump: data.jump,
    } as RequestParams;
    if (data.responseType === 'arraybuffer') {
        wxParam.responseType = 'arraybuffer';
    } else if (data.responseType === 'json') {
        wxParam.dataType = 'json';
    }
    return wxParam;
}


/**
 * 返回请求成功的响应数据data部分
 * statusCode 2xx 操作成功仅返回data数据
 * 否则抛出错误(rejected)
 * @param res 
 * @param config 
 */
export function transformRequestResponseOkData<T=any>(res: wx.RequestSuccessCallbackResult, config: RequestOption): T {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        throw res;
    }
    return res.data as any as T;
}

