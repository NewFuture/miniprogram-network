
import { BeforeDownload, afterDownload } from './transform'
// import { CancelToken } from './cancel-token';

/**
 * KeyValuePair
 */
export interface KeyRawValuePair {
    [key: string]: string | number | boolean;
};

/**
 * 基本全局配置信息
 */
interface BaseConfig {
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
    transformRequest?: BeforeDownload;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: afterDownload;
}

/**
 * 全局配置参数
 * Global Request Configuration
 */
export type Configuration = BaseConfig & TransformConfig;

/**
 * 每个请求的额外配置参数
 */
// export type ExtraConfig = ExtraRequestConfig & TransformConfig;

/**
 * 每次请求包含的全部信息(不包括 转换函数)
 */
export interface DownloadConfig extends BaseConfig {
    /**
    * 请求的相对地址
    */
    url: string;

    /**
     * 临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件
     */
    filePath?: string;

    /**
     * 进度回调
     */
    onProgress: wx.DownloadTaskOnProgressUpdateCallback;
}

/**
 * 单个请求的全部可配置参数
 */
export type DownloadOptions = DownloadConfig & TransformConfig;

// /**
//  * 认证回调，
//  * 同步返回 string 
//  * 异步返回 Promise<string>，
//  */
// export type AuthFunction = (config: Configuration) => string | Promise<string>;
