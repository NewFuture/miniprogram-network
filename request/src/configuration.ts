
import { BeforeSendFunc, AfterResponseFunc, KeyBasicValuePair } from 'miniprogram-network-utils'
import { CancelToken } from 'miniprogram-cancel-token';
import { WxParam } from './transform';
/**
 * 基本全局配置信息
 */
interface BaseRequestConfig {
    /**
    * 请求的根目录
    * Base URL for request
    */
    baseURL?: string;

    /**
    * 自定义头 
    * user defined headers
    */
    headers?: KeyBasicValuePair;

    /**
     * URL Path
     * the path parameters to be replace in path
     * Must be a plain object
     * @example 
     *  url = "/{ID}/status"
     *  param = {ID: 12345}
     * request url will be /1234/status
     */
    params?: KeyBasicValuePair,

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

/**
 * 数据转换配置信息
 */
interface TransformConfig {

    /**
     * 修改数据或者头;返回 wx.request参数
     * 异步返回promise
     * You may modify the data or headers object before it is sent.
     */
    transformSend?: BeforeSendFunc<RequestData, WxParam>;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: AfterResponseFunc<wx.RequestSuccessCallbackResult, RequestOptions, any>;
}

/**
 * 每个请求额外设置项
 */
interface ExtraRequestConfig extends BaseRequestConfig {

    /**
     * 取消操作的 CancelToken 
     */
    cancelToken?: CancelToken;

    // /**
    //  * allows handling of progress events
    //  */
    // onprogress?: (ProgressParam) => any;
}


/**
 * 全局配置参数
 * Global Request Configuration
 */
export type Configuration = BaseRequestConfig & TransformConfig;

/**
 * 每个请求的额外配置参数
 */
export type ExtraConfig = ExtraRequestConfig & TransformConfig;

/**
 * 每次请求包含的全部信息(不包括 转换函数)
 */
export interface RequestData extends ExtraRequestConfig {
    /**
    * 请求的相对地址
    */
    url: string;

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
}

/**
 * 单个请求的全部可配置参数
 */
export type RequestOptions = RequestData & TransformConfig;

// /**
//  * 认证回调，
//  * 同步返回 string 
//  * 异步返回 Promise<string>，
//  */
// export type AuthFunction = (config: Configuration) => string | Promise<string>;