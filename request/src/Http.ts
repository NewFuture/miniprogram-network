import { WxQueue } from 'miniprogram-queue';
import { promisify } from 'miniprogram-promise';

import { initConfiguration, FullConfiguration, RequestData, TransformConfiguration, RequestConfiguration, WxParam } from "./Configuration";
import { ListenerEvents } from "./Liseteners";
const RequestQueue = new WxQueue(wx.request);
const WxRequest = promisify(RequestQueue.push);

export class Http {

    /**
     * 默认全局配置
     */
    public defaults: initConfiguration = {
        /**
        * 重试一次
        */
        retry: 1,
    };

    /**
     * 全局Listeners
     */
    public listeners: ListenerEvents = new ListenerEvents;

    public static defaultRequestTransformation;
    public static defaultResponseTransformation;


    /**
     * 
     * @param config 
     */
    public constructor(config?: initConfiguration) {
        if (config) {
            this.defaults = config;
        }
    }
    

    public create(config?: initConfiguration): Http {
        return new Http(config);
    }

    public request<T>(method: string, action: string, data?: any, config?: initConfiguration): Promise<T>;
    public request<T>(config: FullConfiguration): Promise<T>;
    public request<T>(): Promise<T> {
        const config: FullConfiguration = {};
        return this.doRequest(config);
    }

    public get<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('GET', action, data, config);
    }

    public post<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('POST', action, data, config);
    }

    public put<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('PUT', action, data, config);
    }

    public delete<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('DELETE', action, data, config);
    }

    public head<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('HEAD', action, data, config);
    }

    public options<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('OPTIONS', action, data, config);
    }

    private doRequest<T>(config: FullConfiguration): Promise<T> {
        return this.beforeSend(config)
            .then(param => this.send<T>(param, config))
    }

    /**
     * 请求发送之前处理数据
     * @param config 
     */
    private beforeSend(config: FullConfiguration): Promise<WxParam> {
        this.listeners.onSend.forEach(f => f(config));
        const data = config.transformRequest ? config.transformRequest(config) : Http.defaultRequestTransformation(config);
        return Promise.resolve(data);
    }

    /**
     * 发送请求,并自动重试
     * @param requestOption 
     * @param requestConfig 
     */
    private send<T>(requestOption: wx.RequestOption, requestConfig: FullConfiguration): Promise<T> {
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
    private onResponse<T>(res: wx.RequestSuccessCallbackResult, config: FullConfiguration): Promise<T> {
        this.listeners.onResponse.forEach(f => f(res, config));
        const result = config.transformResponse ? config.transformResponse(res, config) : Http.defaultResponseTransformation(res,config);
        return Promise.resolve(result).catch(reason => this.onFail(reason, config));
    }

    /**
     * 请求发送失败
     * @param res 
     * @param config 
     */
    private onFail(res: wx.GeneralCallbackResult, config: FullConfiguration): Promise<wx.GeneralCallbackResult> {
        this.listeners.onRejected.forEach(f => f(res, config));
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res 
     * @param config 
     */
    private onComplete(res: wx.GeneralCallbackResult, config: FullConfiguration) {
        this.listeners.onComplete.forEach(f => f(res, config));
    }

};