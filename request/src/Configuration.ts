
/**
 * Request Configuration
 */
export interface BaseConfiguration {
    /**
     * 请求的相对根目录
     * Base URL for request
     */
    baseURL?: string;

    /**
    * 自定义头 
    * user defined headers
    */
    headers?: KeyValuePair;

    /**
     * URL Path
     * the path parameters to be replace in path
     * Must be a plain object
     * @example 
     *  url = "/{ID}/status"
     *  param = {ID: 12345}
     * request url will be /1234/status
     */
    params?: KeyValuePair,

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

    // /**
    //  * allows handling of progress events
    //  */
    // onprogress?: (ProgressParam) => any;

    cancelToken?: Function;
};

export interface Configuration extends BaseConfiguration {
    /**
    * 请求方法
    * HTTP request mthod: GET POST ...
    */
    method?: string;

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
}

/**
 * KeyValuePair
 */
export interface KeyValuePair {
    [key: string]: string | number | boolean;
};

/**
 * 请求参数预处理,
 * 输入配置; 返回 WxParam | Promise<WxParam>
 */
export type TransformRequest = (config: Configuration) => WxParam | Promise<WxParam>;
/**
 * 相应数据数据预处理
 * 输入原始返回信息;返回数据或者包含数据的Promise
 */
export type TransformResponse = (res: WxResponse, config: Configuration) => any | Promise<any>
// interface TransformResponse<T> (res: WxResponse, config: Configuration) => T | Promise<T>

// /**
//  * 认证回调，
//  * 同步返回 string 
//  * 异步返回 Promise<string>，
//  */
// export type AuthFunction = (config: Configuration) => string | Promise<string>;

/**
 * 微信请求参数
 */
interface WxParam {
    /**
     * 开发者服务器接口地址
     */
    url: string
    /**
     * 请求的参数
     */
    data?: any | string | ArrayBuffer
    /**
     * 设置请求的 header，header 中不能设置 Referer。
     */
    header?: KeyValuePair
    /**
     * （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     *
     * @default GET
     */
    method?: string
    /**
     * 如果设为json，会尝试对返回的数据做一次 JSON.parse
     *
     * @default json
     */
    dataType?: string
    /**
     * 设置响应的数据类型。合法值：text、arraybuffer
     *
     * @default text
     * @since 1.7.0
     */
    responseType?: string
}

/**
 * 微信请求返回数据
 */
type WxResponse = {
    /**
     * 开发者服务器返回的数据
     */
    data: any | string | ArrayBuffer
    /**
     * 开发者服务器返回的 HTTP 状态码
     */
    statusCode: number
    /**
     * 开发者服务器返回的 HTTP Response Header
     *
     * @since 1.2.0
     */
    header: KeyValuePair
}

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
