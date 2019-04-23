import { BaseConfiguration, ExtraConfiguration, mergeConfig, Omit, SuccessParam, WxOptions, WxTask } from './configuration';
import { Listeners } from './listeners';

type GeneralCallbackResult = {
    /**
     * 微信回调消息
     */
    errMsg: string;
    /**
     * 是否自定义超时
     */
    timeout?: boolean;
};

/**
 * 网络请求的完整生命周期
 * @template TWxOptions 微信操作函数参数类型 // 微信操作函数
 * @template TWxTask 微信操作函数返回值类型 // 微信操作的任务类型
 * @template TInitConfig LifeCycle的初始默认配置项(Defaults)类型 //初始化配置项
 * @template TFullOptions 一个操作完整配置项(全部可接收参数)类型
 */
export abstract class LifeCycle<
    TWxOptions extends WxOptions,
    TWxTask extends WxTask,
    TInitConfig extends BaseConfiguration<TFullOptions, TWxOptions>,
    TFullOptions extends TInitConfig & ExtraConfiguration = TInitConfig & ExtraConfiguration, //完整配置项
    > {
    /**
     * 默认全局配置
     */
    // tslint:disable-next-line:variable-name
    public readonly Defaults: TInitConfig;

    /**
     * 全局 Listeners
     */
    // tslint:disable-next-line:variable-name
    public readonly Listeners: Readonly<Listeners<TFullOptions, SuccessParam<TWxOptions>>> = new Listeners();

    /**
     * 微信操作接口
     * @param option 参数
     */
    public readonly handle: (option: TWxOptions) => TWxTask;

    /**
     * 新建实列
     * @param config 全局默认配置
     */
    protected constructor(operator: (option: TWxOptions) => TWxTask, config: TInitConfig) {
        this.handle = operator;
        this.Defaults = config;
        if (config.retry === undefined) {
            this.Defaults.retry = 1;
        }
        if (!config.headers) {
            this.Defaults.headers = {};
        }
    }

    /**
     * 处理请求
     * @param options - 请求参数,不包括默认参数
     */
    protected process<T = SuccessParam<TWxOptions>>(options: TFullOptions): Promise<T> {
        // tslint:disable-next-line: no-parameter-reassignment
        options = mergeConfig(options, this.Defaults);
        return this._onSend(options)
            .then((param) => {
                (param as TWxOptions).complete = (res: GeneralCallbackResult) => { this._onComplete(res as any, options); };
                return this._send<T>(param as TWxOptions, options);
            });
    }

    /**
     * 请求发送之前处理数据
     * @param options - 完整参数
     */
    private _onSend(options: TFullOptions): Promise<Omit<TWxOptions, 'complete' | 'success' | 'fail'>> {
        this.Listeners.onSend.forEach(f => { f(options); });
        return Promise.resolve(options)
            .then(options.transformSend);
    }

    /**
     * 发送网络请求,并自动重试
     * @param data - 发送微信参数
     * @param options - 全部配置
     */
    private _send<T>(data: TWxOptions, options: TFullOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const cancelToken = options.cancelToken;
            if (cancelToken) {
                cancelToken.throwIfRequested();
            }
            data.success = (res: SuccessParam<TWxOptions>) => {
                this._response<T>(res, options)
                    .then(resolve, reject);
            };
            // retry
            data.fail = (res: GeneralCallbackResult) => {
                if (options.retry!-- > 0) {
                    this._send<T>(data, options)
                        .then(resolve, reject);
                } else {
                    this._onFail(res, options)
                        .then(reject, reject);
                }
            };

            const task = this.handle(data);
            if (options.onHeadersReceived) {
                task.onHeadersReceived(options.onHeadersReceived);
            }
            if (options.onProgressUpdate && task.onProgressUpdate) {
                task.onProgressUpdate(options.onProgressUpdate);
            }
            if (cancelToken) {
                cancelToken.promise
                    .then(reason => { task.abort(); this._onAbort(reason, options); }, reject);
            }
        });
    }

    /**
     * 处理服务器返回数据
     * @param res - 返回参数
     * @param options - 全部配置
     */
    private _response<T>(res: SuccessParam<TWxOptions>, options: TFullOptions): Promise<T> {
        this.Listeners.onResponse.forEach(f => { f(res, options); });
        if (options.transformResponse) {
            return Promise
                .resolve(res)
                .then(
                    // tslint:disable-next-line: no-unsafe-any
                    (result) => options.transformResponse!(result, options),
                    (reason: GeneralCallbackResult) => this._onFail(reason, options)
                );
        } else {
            return Promise.resolve(res);
        }
    }

    /**
     * 请求发送失败
     * @param res - 返回参数
     * @param options - 全部配置
     */
    private _onFail(res: GeneralCallbackResult, options: TFullOptions): Promise<GeneralCallbackResult> {
        if (typeof res === 'string') {
            // tslint:disable-next-line: no-parameter-reassignment
            res = { errMsg: res };
        }
        this.Listeners.onRejected.forEach(f => { f(res, options); });
        return Promise.reject(res);
    }

    /**
     * 请求完成
     * @param res - 返回参数
     * @param options - 全部配置
     */
    private _onComplete(res: Partial<SuccessParam<TWxOptions>> & GeneralCallbackResult, options: TFullOptions) {
        if (typeof res === 'string') {
            // tslint:disable-next-line: no-parameter-reassignment
            res = { errMsg: res as string } as any;
        }
        this.Listeners.onComplete.forEach(f => { f(res, options); });
    }

    /**
     * 请求完成
     * @param res - 返回参数
     * @param options - 全部配置
     */
    private _onAbort(reason: any, options: TFullOptions): void {
        if (typeof reason === 'string') {
            // tslint:disable-next-line: no-parameter-reassignment
            reason = { errMsg: reason };
        }
        this.Listeners.onAbort.forEach(f => { f(reason, options); });
    }
}
