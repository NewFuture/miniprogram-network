import { CancelToken } from 'miniprogram-cancel-token';

type KeyBasicValuePair = Record<string, string | number | boolean | null | undefined>;
export type ParamsType = Record<string, string | number | boolean> | (string | number | boolean)[];
type PromiseOrValue<T> = T | PromiseLike<T>;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface WxTask {
    abort(): void;
    /** HTTP Response Header 事件的回调函数 */
    onHeadersReceived(callback: ExtraConfiguration['onHeadersReceived']): void;
    /** 下载进度变化事件的回调函数 */
    onProgressUpdate?(callback: ExtraConfiguration['onProgressUpdate']): void;
}

export interface WxOptions {
    /** 开发者服务器接口地址 */
    url: string;
    /** http headers */
    header?: object;
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function;
    /** 接口调用失败的回调函数 */
    fail?: Function;
    /** 接口调用成功的回调函数 */
    success?(res: any): any;
}

export type SuccessParam<T extends WxOptions> = Parameters<NonNullable<T['success']>>[0];
/**
 * 所有网络请求的集成类型,可全局配置
 */
export interface BaseConfiguration<
    TFullOptions extends BaseConfiguration<TFullOptions, TWxOptions>, //完整配置
    TWxOptions extends WxOptions, // 微信请求参数类型
    > {
    /**
     * 请求的根目录
     * The root URL for request
     * 如果URL以`http://`或者`https://`开头将被忽略
     */
    baseURL?: string;

    /**
     * 自定义请求头
     * user defined HTTP headers
     */
    headers?: KeyBasicValuePair;

    /**
     * 路径参数
     * URL Path Params
     * the path parameters to be replace in path
     * Must be a plain `object` or `array`
     * @example
     *  url = "/{ID}/status"
     *  param = {ID: 12345}
     *  request url will be /1234/status
     */
    params?: ParamsType;

    /**
     * 重试次数
     * retry times when fail
     */
    retry?: number;

    /**
     * 是否记录时间戳
     */
    timestamp?: boolean;

    /**
     * 请求参数预处理
     * 修改数据或者头;返回 wx.request, wx.downloadFile,wx.uploadFile参数 (不包括回调函数)
     * 支持异步返回promise
     * You can modify the data or headers object before it is sent.
     * @param options 不包含转换函数的所有配置内容
     * @returns the params to call wechat API without callback functions.
     */
    transformSend(options: TFullOptions):
        PromiseOrValue<Omit<TWxOptions, 'complete' | 'success' | 'fail'>>;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     * @example `res=>res.data`
     * @param res wechat API result
     * @param options full options of the API
     * @return the data to resolve
     */
    transformResponse?(res: SuccessParam<TWxOptions>, options: TFullOptions): PromiseOrValue<any>;
}

/**
 * 每个操包含的额外配置参数
 */
export interface ExtraConfiguration {
    /**
     * 取消操作的 CancelToken
     * `CancelToken.source()`可生成tokenSource
     */
    cancelToken?: CancelToken;

    /**
     * 是否插队
     */
    jump?: boolean;

    /**
     * 自定义超时时间,单位`ms`
     * >0 时有有效
     */
    timeout?: number;

    /**
     * 接收到响应头回调
     */
    onHeadersReceived?(result: { header: object }): void;

    /**
     * 进度回调
     */
    onProgressUpdate?(res: any): any;
}

/**
 * 合并配置
 * @param customize 自定义配置，未定义的将被设置为默认值
 * @param defaults 默认值
 */
export function mergeConfig<T1 extends Partial<T2>, T2 extends { [key: string]: any }>(
    customize: T1,
    defaults: T2
): T1 {
    const config = { ...defaults, ...customize };
    if (defaults.headers && customize.headers) {
        // 合并headers
        config.headers = { ...defaults.headers, ...customize.headers };
    }
    return config;
}
