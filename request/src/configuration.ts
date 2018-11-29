
import { TransformRequest, TransformResponse } from './transform'
import { CancelToken } from './cancel-token';
export interface RequestConfiguration {
    /**
    * 请求的根目录
    * Base URL for request
    */
    baseURL?: string;

    /**
    * 自定义头 
    * user defined headers
    */
    headers?: KeyRawValuePair;

    /**
     * URL Path
     * the path parameters to be replace in path
     * Must be a plain object
     * @example 
     *  url = "/{ID}/status"
     *  param = {ID: 12345}
     * request url will be /1234/status
     */
    params?: KeyRawValuePair,

    /**
    * 重试次数 
    * retry times when fail
    */
    retry?: number;

    /**
     * response data type
     */
    responseType?: "json" | "text" | "arraybuffer";

    // /**
    //  * auth setting
    //  */
    // auth?: string | AuthFunction;

}

export interface TransformConfiguration {

    /**
     * 修改数据或者头;返回 wx.request参数
     * 异步返回promise
     * You may modify the data or headers object before it is sent.
     */
    transformRequest?: TransformRequest;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: TransformResponse;
}

/**
 * Request Configuration
 */
export interface Configuration extends RequestConfiguration, TransformConfiguration {

};




export interface BaseRequestOptions extends RequestConfiguration {
    /**
    * 请求的相对地址
    * Base URL for request
    */
    url?: string;

    /**
    * 请求方法
    * HTTP request mthod: GET POST ...
    */
    method?:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';

    /**
     * 请求数据
     * reqeust data
     *  * **data 数据说明：**
     *
     * 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
     *
     * *   对于 `GET` 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     * *   对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会对数据进行 JSON 序列化
     * *   对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     */
    data?: any;


    /**
     * 取消操作
     */
    cancelToken?: CancelToken;

    // /**
    //  * allows handling of progress events
    //  */
    // onprogress?: (ProgressParam) => any;
}

export interface RequestOptions extends BaseRequestOptions, TransformConfiguration {

}

/**
 * KeyValuePair
 */
export interface KeyRawValuePair {
    [key: string]: string | number | boolean;
};


// /**
//  * 认证回调，
//  * 同步返回 string 
//  * 异步返回 Promise<string>，
//  */
// export type AuthFunction = (config: Configuration) => string | Promise<string>;


// type ProgressParam = {
//     /**
//      * 进度百分比
//      */
//     progress: number;
//     /**
//      * 无效，只为兼容 upload/download
//      */
//     totalBytesSent?: number;

//     /**
//      * 无效，只为兼容 upload/download
//      */
//     totalBytesExpectedToSend?: number;
// }

/**
 * 合并配置
 * @param customize 自定义配置，未定义的将被默认配置覆盖
 * @param defaults 默认值
 */
export function mergerOptions(customize: RequestOptions, defaults: RequestOptions): RequestOptions {
    Object.keys(defaults).forEach(key => {
        if (!customize.hasOwnProperty(key)) {
            customize[key] = defaults[key]
        }
    })
    return customize;
}