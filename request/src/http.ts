import { LifeCircle } from 'miniprogram-network-life-circle';
import { WxQueue } from 'miniprogram-queue';
import { RequestInit, RequestOption, RequestConfig } from './configuration';
import { defaultTransformSend } from './transform';

/**
 * 请求队列
 */
const requestQueue = new WxQueue<wx.RequestOption, wx.RequestTask>(wx.request);


/**
 * 小程序HTTP请求生命周期封装
 * @example 
 *    `const http = new Http({ baseURL: 'https://api.newfuture.cc/', retry: 3 });`
 */
export class Http extends LifeCircle<wx.RequestOption, wx.RequestTask, RequestInit, RequestOption> {

    /**
     * 默认请求发送数据转换函数
     */
    public readonly TransformSend = defaultTransformSend;

    // /**
    //  * 默认响应数据转换函数
    //  */
    // public readonly TransformResponse = requestTransformResponseDefault;

    /**
     * 新建 Http实列
     * @param config 全局默认配置
     * @param request 请求处理方法，默认使用请求队列处理
     */
    public constructor(config?: RequestInit, request?: (o: wx.RequestOption) => wx.RequestTask) {
        super(request || requestQueue.push, config);
    }

    /**
     * Object 参数发起请求
     * @param options 每个请求的全部配置信息，未设置内容使用默认全局配置
     */
    public request<T=ReturnType<Http['TransformResponse']>>(options: RequestOption): Promise<T>;
    /**
     * 发送一个 request请求
     * @param method 操作方法，和小程序一致
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转未query string
     * @param config 可覆盖默认配置
     */
    public request<T=ReturnType<Http['TransformResponse']>>(method: string, action: string, data?: any, config?: RequestConfig): Promise<T>;
    public request<T=ReturnType<Http['TransformResponse']>>(): Promise<T> {
        const arg_num = arguments.length;
        const options: RequestOption = arg_num == 1 ? arguments[0] : (arguments[3] || {});
        if (arg_num > 1) {
            options.method = arguments[0];
            options.url = arguments[1];
            if (arg_num > 2) {
                options.data = arguments[2];
            }
        }
        return this.process(options);
    }

    /**
     * GET 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转为query string
     * @param config 可覆盖默认配置
     */
    public get<T>(action: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>('GET', action, data, config);
    }

    /**
     * POST 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     */
    public post<T>(action: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>('POST', action, data, config);
    }

    /**
     * PUT 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     */
    public put<T>(action: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>('PUT', action, data, config);
    }

    /**
     * DELETE 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转未query string
     * @param config 可覆盖默认配置
     */
    public delete<T>(action: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>('DELETE', action, data, config);
    }

    public head<T>(action: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>('HEAD', action, data, config);
    }

    /**
     * Patch 操作
     * 由于小程序不支持PATCH 方法
     * 采用X-HTTP-Method-Override兼容处理，需要服务器端支持
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     */
    public patch<T>(action: string, data?: any, config?: RequestConfig): Promise<T> {
        if (!config) {
            config = {
                headers: { 'X-HTTP-Method-Override': 'PATCH' },
            };
        } else if (!config.headers) {
            config.headers = { 'X-HTTP-Method-Override': 'PATCH' };
        } else {
            config.headers['X-HTTP-Method-Override'] = 'PATCH';
        }
        return this.request<T>('POST', action, data, config);
    }
};