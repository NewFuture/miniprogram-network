import { WxQueue } from 'miniprogram-queue';
import { mergerConfig, EventListeners } from 'miniprogram-network-utils';
import { Configuration, RequestOptions, ExtraConfig } from "./configuration";
import { defaultSendTransformation, defaultResponseTransformation, WxParam } from './transform';
const RequestQueue = new WxQueue<wx.RequestOption, wx.RequestTask>(wx.request);

type WxRequest = (o: wx.RequestOption) => wx.RequestTask;
export class Http {

    /**
     * 默认数据转换函数
     */
    public static readonly SendTransformation: Configuration['transformSend'] = defaultSendTransformation;

    /**
     * 默认输出数据转换函数
     */
    public static readonly ResponseTransformation: Configuration['transformResponse'] = defaultResponseTransformation;

    /**
     * 默认全局配置
     */
    public readonly Defaults: Configuration = {
        /**
        * 重试一次
        */
        retry: 1,
    };

    /**
     * 全局Listeners
     */
    public readonly Listeners: EventListeners<RequestOptions, wx.RequestSuccessCallbackResult> = new EventListeners;


    private readonly req: WxRequest = RequestQueue.push;

    /**
     * 新建 Http实列
     * @param config 全局默认配置
     */
    public constructor(config?: Configuration, request?: WxRequest) {
        if (config) {
            this.Defaults = config;
        }
        if (request) {
            this.req = request;
        }
    }

    /**
     * Object 参数发起请求
     * @param options 
     */
    public request<T>(options: RequestOptions): Promise<T>;
    /**
     * 发送一个 request请求
     * @param method 操作方法，和小程序一致
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转未query string
     * @param config 可覆盖默认配置
     */
    public request<T>(method: string, action: string, data?: any, config?: ExtraConfig): Promise<T>;
    public request<T>(): Promise<T> {
        const arg_num = arguments.length;
        const options: RequestOptions = arg_num == 1 ? arguments[0] : (arg_num === 4 ? arguments[3] : {});
        if (arg_num > 1) {
            options.method = arguments[0];
            options.url = arguments[1];
            if (arg_num > 2) {
                options.data = arguments[2];
            }
        }
        mergerConfig(options, this.Defaults);
        return this.process(options);
    }

    /**
     * GET 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转未query string
     * @param config 可覆盖默认配置
     */
    public get<T>(action: string, data?: any, config?: ExtraConfig): Promise<T> {
        return this.request<T>('GET', action, data, config);
    }

    /**
     * POST 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     */
    public post<T>(action: string, data?: any, config?: ExtraConfig): Promise<T> {
        return this.request<T>('POST', action, data, config);
    }

    /**
     * PUT 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     */
    public put<T>(action: string, data?: any, config?: ExtraConfig): Promise<T> {
        return this.request<T>('PUT', action, data, config);
    }

    /**
     * DELETE 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转未query string
     * @param config 可覆盖默认配置
     */
    public delete<T>(action: string, data?: any, config?: ExtraConfig): Promise<T> {
        return this.request<T>('DELETE', action, data, config);
    }

    public head<T>(action: string, data?: any, config?: ExtraConfig): Promise<T> {
        return this.request<T>('HEAD', action, data, config);
    }

    /**
     * Patch 操作，由于小程序不支持PATCH 方法
     * 采用X-HTTP-Method-Override兼容处理，需要服务器端支持
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     */
    public patch<T>(action: string, data?: any, config?: Configuration): Promise<T> {
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

    /**
     * 处理请求
     * @param options 
     */
    private process<T>(options: RequestOptions): Promise<T> {
        return this.beforeSend(options)
            .then((param: wx.RequestOption) => {
                param.complete = (res: wx.GeneralCallbackResult) => this.onComplete(res, options);
                return this.send<T>(param, options)
            })
    }

    /**
     * 请求发送之前处理数据
     * @param options 
     */
    private beforeSend(options: RequestOptions): Promise<WxParam> {
        this.Listeners.onSend.forEach(f => f(options));
        const data = options.transformSend ? options.transformSend(options) : Http.SendTransformation!(options);
        return Promise.resolve(data);
    }

    /**
     * 发送请求,并自动重试
     * @param data 
     * @param options 
     */
    private send<T>(data: wx.RequestOption, options: RequestOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const cancelToken = options.cancelToken;
            cancelToken && cancelToken.throwIfRequested();

            data.success = (res: wx.RequestSuccessCallbackResult): any => this.onResponse<T>(res, options).then(resolve);
            // retry
            data.fail = (res: wx.GeneralCallbackResult): any =>
                options.retry!-- > 0 ? this.send<T>(data, options).then(resolve, reject) : this.onFail(res, options).then(reject);

            const task = this.req(data);
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    task.abort();
                    this.onAbort(reason, options);
                });
            }
        });
    }

    /**
     * 请求完成
     * @param res 
     * @param options 
     */
    private onAbort(reason: any, options: RequestOptions): void {
        this.Listeners.onComplete.forEach(f => f(reason, options));
    }

    /**
     * 处理服务器返回数据
     * @param res 
     * @param options 
     */
    private onResponse<T>(res: wx.RequestSuccessCallbackResult, options: RequestOptions): Promise<T> {
        this.Listeners.onResponse.forEach(f => f(res, options));
        const result = options.transformResponse ? options.transformResponse(res, options) : Http.ResponseTransformation!(res, options);
        return Promise.resolve(result).catch(reason => this.onFail(reason, options));
    }

    /**
     * 请求发送失败
     * @param res 
     * @param options 
     */
    private onFail(res: wx.GeneralCallbackResult, options: RequestOptions): Promise<wx.GeneralCallbackResult> {
        this.Listeners.onRejected.forEach(f => f(res, options));
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res 
     * @param options 
     */
    private onComplete(res: wx.GeneralCallbackResult, options: RequestOptions) {
        this.Listeners.onComplete.forEach(f => f(res, options));
    }
};