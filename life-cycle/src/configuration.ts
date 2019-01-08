import { CancelToken } from 'miniprogram-cancel-token'

type KeyBasicValuePair = { [key: string]: string | number | boolean | null };
type PromiseOrValue<T> = T | PromiseLike<T>

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface WxTask {
    abort(): void;
    /** HTTP Response Header 事件的回调函数 */
    onHeadersReceived(callback: ExtraConfiguration['onHeadersReceived'], ): void;
    /** 下载进度变化事件的回调函数 */
    onProgressUpdate?(callback: ExtraConfiguration['onProgressUpdate']): void;

};

export interface WxOptions {
    /** 开发者服务器接口地址 */
    url: string;
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function;
    /** 接口调用失败的回调函数 */
    fail?: Function;
    /** 接口调用成功的回调函数 */
    success?: (res: any) => any;
};

export type SuccessParam<T extends WxOptions> = Parameters<NonNullable<T['success']>>[0]
/**
 * 所有网络请求的集成类型
 */
export interface BaseConfiguration<
    TFullOptions extends BaseConfiguration<TFullOptions, TWxOptions>, //完整配置
    TWxOptions extends WxOptions // 微信请求参数类型
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
     *  request url will be /1234/status
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
    transformSend?: (data: Omit<TFullOptions, 'transformSend' | 'transformResponse'>) => PromiseOrValue<Omit<TWxOptions, 'complete' | 'success' | 'fail'>>;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: (res: SuccessParam<WxOptions>, config: TFullOptions) => PromiseOrValue<any>;

    /**
     * 是否记录时间戳
     */
    timestamp?: boolean;
}

/**
 * 每个操包含的额外配置参数
 */
export interface ExtraConfiguration {
    /**
     * 取消操作的 CancelToken 
     */
    cancelToken?: CancelToken;

    /**
     * 接收到响应头回调
     */
    onHeadersReceived?: (result: { header: object }) => void;

    /**
     * 进度回调
     */
    onProgressUpdate?: (res: any) => any;

    /**
     * 是否插队
     */
    jump?: boolean;
}

/**
 * 合并配置
 * @param customize 自定义配置，未定义的将被设置为默认值
 * @param defaults 默认值
 */
export function mergeConfig<T1 extends T2, T2 extends { [key: string]: any }>(customize: T1, defaults: T2): T1 {
    Object.keys(defaults).forEach(key => {
        if (!customize.hasOwnProperty(key)) {
            customize[key] = defaults[key]
        }
    })
    return customize;
}
