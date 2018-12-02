import { KeyBasicValuePair } from "./build-params";
import { CancelToken } from 'miniprogram-cancel-token'
import { FirstArgument } from "./first-argument";

export type WxOptions = wx.RequestOption | wx.DownloadFileOption | wx.UploadFileOption;
export type WxTask = wx.RequestTask | wx.DownloadTask | wx.UploadTask;

export interface BaseConfiguration<
    TFullOptions extends BaseConfiguration<TFullOptions, TWxOptions>,
    TWxOptions extends WxOptions
    > {

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
     * 请求参数预处理
     * 修改数据或者头;返回 wx.request, wx.downloadFile,wx.uploadFile参数 (不包括回调函数)
     * 支持异步返回promise
     * You may modify the data or headers object before it is sent.
     * @param data 不包含转换函数的所有配置内容
     */
    transformSend?: (data: Exclude<TFullOptions, 'transformSend' | 'transformResponse'>) => Exclude<TWxOptions, 'complete' | 'success' | 'fail'>
        | PromiseLike<Exclude<TWxOptions, 'complete' | 'success' | 'fail'>>;


    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: (res: FirstArgument<TWxOptions['success']>, config: TFullOptions) => any | Promise<any>;

}

export interface ExtraConfiguration<TwxTask extends WxTask> {
    /**
     * 取消操作的 CancelToken 
     */
    cancelToken?: CancelToken;

    /**
     * 进度回调
     */
    onProgress: TwxTask['onProgressUpdate'];

    /**
     * 接受到消息头
     */
    onHeaders: TwxTask['onHeadersReceived'];
}

/**
 * 合并配置
 * @param customize 自定义配置，未定义的将被默认配置覆盖
 * @param defaults 默认值
 */
export function mergerConfig<T1 extends T2, T2 extends { [key: string]: any }>(customize: T1, defaults: T2): T1 {
    Object.keys(defaults).forEach(key => {
        if (!customize.hasOwnProperty(key)) {
            customize[key] = defaults[key]
        }
    })
    return customize;
}