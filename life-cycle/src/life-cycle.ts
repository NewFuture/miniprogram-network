import { BaseConfiguration, WxOptions, ExtraConfiguration, WxTask, mergeConfig, SuccessParam, Omit } from './configuration';
import { EventListeners } from "./listeners";

type GeneralCallbackResult = {
    errMsg: string;
}

/**
 * 网络请求的完整生命周期
 * 
 */
export abstract class LifeCycle<
    TWxOptions extends WxOptions, // 微信操作函数
    TWxTask extends WxTask, // 微信操作的任务类型
    TInitConfig extends BaseConfiguration<TFullOptions, TWxOptions>, //初始化配置项
    TFullOptions extends TInitConfig & ExtraConfiguration, //完整配置项
    >{
    /**
     * 默认全局配置
     */
    public readonly Defaults: TInitConfig = { retry: 1, headers: {} } as TInitConfig;

    /**
     * 全局Listeners
     */
    public readonly Listeners: EventListeners<TFullOptions, SuccessParam<TWxOptions>> = new EventListeners;

    /**
     * 默认数据转换函数
     */
    protected abstract readonly TransformSendDefault: NonNullable<TInitConfig['transformSend']>;

    /**
     * 微信操作接口
     */
    public readonly handle: (option: TWxOptions) => TWxTask;

    /**
     * 新建实列
     * @param config 全局默认配置
     */
    protected constructor(operator: (option: TWxOptions) => TWxTask, config?: TInitConfig) {
        this.handle = operator;
        if (config) { this.Defaults = config; }
    }

    // /**
    //  * 默认输出数据转换函数
    //  * 直接返回结果,不做任何处理
    //  */
    // protected TransformResponseDefault(res: SuccessParam<TWxOptions>, o: TFullOptions): SuccessParam<TWxOptions> {
    //     return res;
    // }


    /**
     * 处理请求
     * @param options 
     */
    protected process<T=SuccessParam<TWxOptions>>(options: TFullOptions): Promise<T> {
        mergeConfig(options, this.Defaults);
        return this.onSend(options)
            .then((param) => {
                (param as TWxOptions).complete = (res: any) => this.onComplete(res, options);
                return this.send<T>(param as TWxOptions, options)
            })
    }

    /**
     * 请求发送之前处理数据
     * @param options 
     */
    private onSend(options: TFullOptions): Promise<Omit<TWxOptions, 'complete' | 'success' | 'fail'>> {
        const data = options.transformSend ?
            options.transformSend(options as Omit<TFullOptions, 'transformSend' | 'transformResponse'>) :
            this.TransformSendDefault(options as Omit<TFullOptions, 'transformSend' | 'transformResponse'>);
        this.Listeners.onSend.forEach(f => f(options));
        return Promise.resolve(data);
    }

    /**
     * 发送网络请求,并自动重试
     * @param data 
     * @param options 
     */
    private send<T>(data: TWxOptions, options: TFullOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const cancelToken = options.cancelToken;
            cancelToken && cancelToken.throwIfRequested();

            data.success = (res: SuccessParam<TWxOptions>) => { this.onResponse<T>(res, options).then(resolve) };
            // retry 
            data.fail = (res: GeneralCallbackResult) =>
                options.retry!-- > 0 ? this.send<T>(data, options).then(resolve, reject) : this.onFail(res, options).then(reject);

            const task = this.handle(data);
            if (options.onHeadersReceived) {
                task.onHeadersReceived(options.onHeadersReceived);
            }
            if (options.onProgressUpdate && task.onProgressUpdate) {
                task.onProgressUpdate(options.onProgressUpdate);
            }
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    task.abort();
                    this.onAbort(reason, options);
                });
            }
        });
    }

    /**
     * 处理服务器返回数据
     * @param res 
     * @param options 
     */
    private onResponse<T>(res: SuccessParam<TWxOptions>, options: TFullOptions): Promise<T> {
        this.Listeners.onResponse.forEach(f => f(res, options));
        const result = options.transformResponse ? options.transformResponse(res, options) : res;
        return Promise.resolve(result).catch(reason => this.onFail(reason, options));
    }

    /**
     * 请求发送失败
     * @param res 
     * @param options 
     */
    private onFail(res: GeneralCallbackResult, options: TFullOptions): Promise<GeneralCallbackResult> {
        this.Listeners.onRejected.forEach(f => f(res, options));
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res 
     * @param options 
     */
    private onComplete(res: Partial<SuccessParam<TWxOptions>> & GeneralCallbackResult, options: TFullOptions) {
        this.Listeners.onComplete.forEach(f => f(res, options));
    }

    /**
     * 请求完成
     * @param res 
     * @param options 
     */
    private onAbort(reason: any, options: TFullOptions): void {
        this.Listeners.onAbort.forEach(f => f(reason, options));
    }
};