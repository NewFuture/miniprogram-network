import { WxQueue } from 'miniprogram-queue';
import { promisify } from 'miniprogram-promise';

import { Configuration, RequestOptions, mergerOptions } from "./Configuration";
import { ListenerEvents } from "./Liseteners";
import { TransformRequest, defaultRequestTransformation, TransformResponse, defaultResponseTransformation, WxParam } from './Transform';
const RequestQueue = new WxQueue(wx.request);
const WxRequest = promisify(RequestQueue.push);

export class Http {

    /**
     * 默认数据转换函数
     */
    public static readonly RequestTransformation: TransformRequest = defaultRequestTransformation;
    /**
     * 默认输出数据转换函数
     */
    public static readonly ResponseTransformation: TransformResponse = defaultResponseTransformation;

    /**
     * 默认全局配置
     */
    public readonly defaults: Configuration = {
        /**
        * 重试一次
        */
        retry: 1,
    };

    /**
     * 全局Listeners
     */
    public readonly listeners: ListenerEvents = new ListenerEvents;


    /**
     * 
     * @param config 
     */
    public constructor(config?: Configuration) {
        if (config) {
            this.defaults = config;
        }
    }

    public request<T>(method: string, action: string, data?: any, config?: Configuration): Promise<T>;
    public request<T>(options: RequestOptions): Promise<T>;
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
        mergerOptions(options, this.defaults);
        return this.doRequest(options);
    }

    public get<T>(action: string, data?: any, config?: Configuration): Promise<T> {
        return this.request<T>('GET', action, data, config);
    }

    public post<T>(action: string, data?: any, config?: Configuration): Promise<T> {
        return this.request<T>('POST', action, data, config);
    }

    public put<T>(action: string, data?: any, config?: Configuration): Promise<T> {
        return this.request<T>('PUT', action, data, config);
    }

    public delete<T>(action: string, data?: any, config?: Configuration): Promise<T> {
        return this.request<T>('DELETE', action, data, config);
    }

    public head<T>(action: string, data?: any, config?: Configuration): Promise<T> {
        return this.request<T>('HEAD', action, data, config);
    }

    private doRequest<T>(config: RequestOptions): Promise<T> {
        return this.beforeSend(config)
            .then(param => this.send<T>(param, config))
    }

    /**
     * 请求发送之前处理数据
     * @param config 
     */
    private beforeSend(config: RequestOptions): Promise<WxParam> {
        this.listeners.onSend.forEach(f => f(config));
        const data = config.transformRequest ? config.transformRequest(config) : Http.RequestTransformation(config);
        return Promise.resolve(data);
    }

    /**
     * 发送请求,并自动重试
     * @param requestOption 
     * @param requestConfig 
     */
    private send<T>(requestOption: wx.RequestOption, requestConfig: RequestOptions): Promise<T> {
        requestOption.complete = (res: wx.GeneralCallbackResult) => {
            this.onComplete(res, requestConfig);
        }
        return WxRequest(requestOption)
            .then((res: wx.RequestSuccessCallbackResult) => this.onResponse(res, requestConfig))
            .catch((res: wx.GeneralCallbackResult) => {
                // retry
                if (requestConfig.retry > 0) {
                    --requestConfig.retry;
                    return this.send(requestOption, requestConfig);
                } else {
                    return this.onFail(res, requestConfig);
                }
            })
    }

    /**
     * 处理服务器返回数据
     * @param res 
     * @param config 
     */
    private onResponse<T>(res: wx.RequestSuccessCallbackResult, config: RequestOptions): Promise<T> {
        this.listeners.onResponse.forEach(f => f(res, config));
        const result = config.transformResponse ? config.transformResponse(res, config) : Http.ResponseTransformation(res, config);
        return Promise.resolve(result).catch(reason => this.onFail(reason, config));
    }

    /**
     * 请求发送失败
     * @param res 
     * @param config 
     */
    private onFail(res: wx.GeneralCallbackResult, config: RequestOptions): Promise<wx.GeneralCallbackResult> {
        this.listeners.onRejected.forEach(f => f(res, config));
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res 
     * @param config 
     */
    private onComplete(res: wx.GeneralCallbackResult, config: RequestOptions) {
        this.listeners.onComplete.forEach(f => f(res, config));
    }

};