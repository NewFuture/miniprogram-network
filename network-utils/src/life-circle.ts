import { EventListeners } from "./listeners";
import { BaseConfiguration, WxOptions, CancelConfiguration } from './configuration';
import { TransformConfiguration } from './transform'
import { FirstArgument } from "./first-argument";


export abstract class LifeCircle<
    TWxOptions extends WxOptions,
    TWxTask extends wx.RequestTask | wx.DownloadTask | wx.UploadTask,
    TConfiguration extends BaseConfiguration & TransformConfiguration<TFullOptions, TWxOptions>,
    TFullOptions extends TConfiguration & CancelConfiguration,
    >{

    /**
     * 默认数据转换函数
     */
    public abstract readonly TransformSend: TConfiguration['transformSend'];

    /**
     * 默认输出数据转换函数
     */
    public abstract readonly TransformResponse: TConfiguration['transformResponse'];

    /**
     * 默认全局配置
     */
    public readonly Defaults: TConfiguration;

    /**
     * 全局Listeners
     */
    public readonly Listeners: EventListeners<TConfiguration, FirstArgument<WxOptions['success']>> = new EventListeners;


    /**
     * 微信操作接口
     */
    private readonly op: (option: TWxOptions) => TWxTask;

    /**
     * 新建实列
     * @param config 全局默认配置
     */
    public constructor(config: TConfiguration, operator: (option: TWxOptions) => TWxTask) {
        this.Defaults = config;
        this.op = operator;
    }

    /**
     * 处理请求
     * @param options 
     */
    protected process<T>(options: TFullOptions): Promise<T> {
        return this.prepareSend(options)
            .then((param: TWxOptions) => {
                param.complete = (res: wx.GeneralCallbackResult) => this.onComplete(res, options);
                return this.send<T>(param, options)
            })
    }

    /**
     * 请求发送之前处理数据
     * @param options 
     */
    private prepareSend(options: TFullOptions): Promise<Exclude<TWxOptions, 'complete' | 'success' | 'fail'>> {
        this.Listeners.onSend.forEach(f => f(options));
        const data = options.transformSend ?
            options.transformSend(options as Exclude<TFullOptions, 'transformSend' | 'transformResponse'>) :
            this.TransformSend!(options as Exclude<TFullOptions, 'transformSend' | 'transformResponse'>);
        return Promise.resolve(data);
    }

    /**
     * 发送请求,并自动重试
     * @param data 
     * @param options 
     */
    private send<T>(data: TWxOptions, options: TFullOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const cancelToken = options.cancelToken;
            cancelToken && cancelToken.throwIfRequested();

            data.success = (res: FirstArgument<WxOptions['success']>) => { this.onResponse<T>(res, options).then(resolve) };
            // retry 
            data.fail = (res: wx.GeneralCallbackResult) =>
                options.retry!-- > 0 ? this.send<T>(data, options).then(resolve, reject) : this.onFail(res, options).then(reject);

            const task = this.op(data);
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
    private onResponse<T>(res: FirstArgument<WxOptions['success']>, options: TFullOptions): Promise<T> {
        this.Listeners.onResponse.forEach(f => f(res, options));
        const result = options.transformResponse ? options.transformResponse(res, options) : this.TransformResponse!(res, options);
        return Promise.resolve(result).catch(reason => this.onFail(reason, options));
    }

    /**
     * 请求发送失败
     * @param res 
     * @param options 
     */
    private onFail(res: wx.GeneralCallbackResult, options: TFullOptions): Promise<wx.GeneralCallbackResult> {
        this.Listeners.onRejected.forEach(f => f(res, options));
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res 
     * @param options 
     */
    private onComplete(res: wx.GeneralCallbackResult, options: TFullOptions) {
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

// type BaseUplaodConfig = BaseConfiguration & TransformConfiguration<FullConfig, wx.UploadFileOption>;
// interface FullConfig extends BaseUplaodConfig, CancelConfiguration {

// }
// class Uploader extends LifeCircle<wx.UploadFileOption, wx.UploadTask, BaseUplaodConfig, FullConfig>
// {
//     /**
//  * 默认数据转换函数
//  */
//     public readonly TransformSend: FullConfig['transformSend'];

//     /**
//      * 默认输出数据转换函数
//      */
//     public readonly TransformResponse: FullConfig['transformResponse'];

//     constructor(config?: BaseUplaodConfig, op?: (op: wx.UploadFileOption) => wx.UploadTask) {
//         super(config || { retry: 1 }, op || wx.uploadFile);
//     }

//     public upload(options:FullConfig) {
//         this.process(options);
//     }

// }