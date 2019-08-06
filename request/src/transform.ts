// import { RequestData, RequestOptions } from './configuration';
import { buildParams, getCommonOptions, Omit } from 'miniprogram-network-utils';
import { FullRequestOption, HttpResponse, wx } from './http';

/**
 * 微信请求参数 (不包含回调函数)
 */
export type RequestParams = Omit<wx.RequestOption, 'success' | 'fail' | 'complete'>;

/**
 * 构建请求参数
 * @param data - 完整配置参数
 */
export function transformRequestSendDefault<
    T extends {} = {},
    // TwxParams extends RequestParams = RequestParams
    >(data: FullRequestOption<T>): RequestParams {
    const wxParam: RequestParams = {
        url: buildParams(data.url, data.params, data.baseURL),
        header: data.headers
    };
    if (data.responseType === 'arraybuffer') {
        wxParam.responseType = 'arraybuffer';
    } else if (data.responseType === 'json') {
        wxParam.dataType = 'json';
    }
    return getCommonOptions(wxParam, data, ['data', 'method']);
}

/**
 * 返回请求成功的响应数据data部分
 * statusCode 2xx 操作成功仅返回data数据
 * 否则抛出错误(rejected)
 * @param res - 返回结果
 * @param config - 完整配置参数
 */
export function transformRequestResponseOkData<T = any>(res: HttpResponse, config: FullRequestOption): T {
    if (res.statusCode >= 200 && res.statusCode < 300) {
        return res.data as any as T;
    }
    throw res;
}
