import { RequestData, RequestOptions, KeyRawValuePair } from './configuration';

/**
 * 请求参数预处理,
 * 输入配置; 返回 WxParam | Promise<WxParam>
 */
export type TransformRequest = (data: RequestData) => WxParam | PromiseLike<WxParam>;

/**
 * 相应数据数据预处理
 * 输入原始返回信息;返回数据或者包含数据的Promise
 */
export type TransformResponse = (res: wx.RequestSuccessCallbackResult, config: RequestOptions) => any | Promise<any>

/**
 * 微信请求参数 (不包含回调函数)
 */
export type WxParam = Pick<wx.RequestOption, 'url' | 'data' | 'dataType' | 'header' | 'method' | 'responseType'>


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
export function defaultRequestTransformation(data: RequestData): WxParam {
    const wxParam: WxParam = {
        url: data.baseURL + replaceParams(data.url, data.params),
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

