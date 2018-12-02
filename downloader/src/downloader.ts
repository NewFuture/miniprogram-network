import { WxQueue } from 'miniprogram-queue';
import { Configuration, DownloadOptions } from "./configuration";
import { defaultBeforeDowanload, defaultDownloadResponseTransformation, DownloadParams } from './transform';
import { EventListeners, mergerConfig, KeyBasicValuePair } from 'miniprogram-network-utils';

const DownloadQueue = new WxQueue<wx.DownloadFileOption, wx.DownloadTask>(wx.downloadFile);

type WxDownload = (o: wx.DownloadFileOption) => wx.DownloadTask;
export class Downloder {

    /**
     * 默认数据转换函数
     */
    public static readonly TransformSend: Configuration['transformSend'] = defaultBeforeDowanload;

    /**
     * 默认输出数据转换函数
     */
    public static readonly TransformResponse: Configuration['transformResponse'] = defaultDownloadResponseTransformation;

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
    public readonly Listeners: EventListeners<Configuration, wx.DownloadFileSuccessCallbackResult> = new EventListeners;


    private readonly req: WxDownload = DownloadQueue.push;

    /**
     * 新建 Http实列
     * @param config 全局默认配置
     */
    public constructor(config?: Configuration, request?: WxDownload) {
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
    public download<T>(options: DownloadOptions): Promise<T>;
    /**
     * 快速下载
     * @param url 
     * @param filePath 
     * @param headers 
     */
    public download<T>(url: string, filePath?: string, headers?: KeyBasicValuePair): Promise<T>;
    public download<T>(): Promise<T> {
        const arg_num = arguments.length;
        const options: DownloadOptions = arg_num == 1 ? arguments[0] : (arg_num === 4 ? arguments[3] : {});
        if (arg_num > 1) {
            options.url = arguments[0];
            options.filePath = arguments[1];
        }
        mergerConfig(options, this.Defaults);
        return this.process(options);
    }

    /**
     * 处理请求
     * @param options 
     */
    private process<T>(options: DownloadOptions): Promise<T> {
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
    private beforeSend(options: DownloadOptions): Promise<DownloadParams> {
        this.Listeners.onSend.forEach(f => f(options));
        const data = options.transformSend ? options.transformSend(options) : Downloder.TransformSend(options);
        return Promise.resolve(data);
    }

    /**
     * 发送请求,并自动重试
     * @param data 
     * @param options 
     */
    private send<T>(data: wx.RequestOption, options: DownloadOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const cancelToken = options.cancelToken;
            cancelToken && cancelToken.throwIfRequested();

            data.success = (res: wx.RequestSuccessCallbackResult) => this.onResponse(res, options).then(resolve);
            // retry
            data.fail = (res: wx.GeneralCallbackResult) =>
                options.retry-- > 0 ? this.send(data, options).then(resolve, reject) : this.onFail(res, options).then(reject);

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
    private onAbort(reason: any, options: DownloadOptions): void {
        this.Listeners.onComplete.forEach(f => f(reason, options));
    }

    /**
     * 处理服务器返回数据
     * @param res 
     * @param options 
     */
    private onResponse<T>(res: wx.RequestSuccessCallbackResult, options: DownloadOptions): Promise<T> {
        this.Listeners.onResponse.forEach(f => f(res, options));
        const result = options.transformResponse ? options.transformResponse(res, options) : Downloder.TransformResponse(res, options);
        return Promise.resolve(result).catch(reason => this.onFail(reason, options));
    }

    /**
     * 请求发送失败
     * @param res 
     * @param options 
     */
    private onFail(res: wx.GeneralCallbackResult, options: DownloadOptions): Promise<wx.GeneralCallbackResult> {
        this.Listeners.onRejected.forEach(f => f(res, options));
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res 
     * @param options 
     */
    private onComplete(res: wx.GeneralCallbackResult, options: DownloadOptions) {
        this.Listeners.onComplete.forEach(f => f(res, options));
    }
};