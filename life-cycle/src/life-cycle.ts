import { GeneralCallbackResult, Omit } from 'miniprogram-network-utils';
import {
    BaseConfiguration,
    ExtraConfiguration,
    mergeConfig,
    SuccessParam,
    WxOptions,
    WxTask
} from './configuration';
import { Listeners } from './listeners';

/**
 * 在结果中主人timeout 标记
 * @param res 原始结果
 */
function timeoutMsg(res: GeneralCallbackResult, time?: number) {
    res.errMsg = res.errMsg ? res.errMsg.replace(':fail abort', `:fail timeout ${time}`) : `network::fail timeout ${time}`;
    res.timeout = true;
    return res;
}

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
     * 对此实例的每个请求生效,优先级低于每个请求的自定义配置
     * 除`header`属性会将请求自定义配置和默认配置进行合并
     * 其余设置会直接覆盖
     */
    // tslint:disable-next-line:variable-name
    public readonly Defaults: TInitConfig;

    /**
     * 全局事件监听列表 Listeners
     * 每次触发特定类型事件会通知对应的全部listeners
     * 包括 `onResponse`,`onResponse`,`onComplete`,`onRejected`,`onAbort`
     * 原则上不应该在事件回调中修改数据
     */
    // tslint:disable-next-line:variable-name
    public readonly Listeners: Readonly<Listeners<TFullOptions, SuccessParam<TWxOptions>>>;

    /**
     * 微信操作接口
     * @param option 参数
     */
    public readonly handle: (option: TWxOptions) => TWxTask;

    /**
     * 新建实列
     * @param operator 操作
     * @param config 全局默认配置
     * @param listeners 事件监听
     */
    protected constructor(
        operator: (option: TWxOptions) => TWxTask,
        config: TInitConfig,
        listeners: Readonly<Listeners<TFullOptions, SuccessParam<TWxOptions>>> = new Listeners()
    ) {
        this.handle = operator;
        this.Defaults = config;
        this.Listeners = listeners;
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
                // 记录发送时间戳
                if (options.timestamp) {
                    if (typeof options.timestamp === 'object') {
                        // 记录于传入的参数中
                        options.timestamp.send = Date.now();
                    } else {
                        (options as any).__sendTime = Date.now();
                    }
                }
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
            /**
             * 是否结束
             */
            let completed = false;
            /**
             * 超时定时器
             * * undefined 表示未启用
             * * 0 表示已经触发超时
             * * 正数 表示真在计时中(未超时)
             */
            let timeoutHandle: number | undefined;

            const cancelToken = options.cancelToken;
            if (cancelToken) {
                cancelToken.throwIfRequested();
            }
            data.success = (res: SuccessParam<TWxOptions>) => {
                completed = true;
                this._response<T>(res, options)
                    .then(resolve, reject);
            };
            // retry on fail
            data.fail = (res: GeneralCallbackResult): void => {
                if (timeoutHandle === 0) {
                    timeoutMsg(res, options.timeout); // 触发自定义超时,注入timeout
                }

                if (cancelToken && cancelToken.isCancelled()) {
                    // 用户主动取消,直接结束不再重试
                    res.cancel = true;
                } else if (typeof options.retry === 'function') {
                    // 自定义retry 函数
                    Promise.resolve()
                        .then(() => (options.retry! as Function)(data, res))
                        .then(
                            // 继续重试
                            (retryData: TWxOptions) => {
                                this._send<T>(retryData, options)
                                    .then(resolve, reject);
                            },
                            // 放弃重试
                            (reason: GeneralCallbackResult) => {
                                this._onFail(reason, options)
                                    .then(reject, reject);
                                this._complete(reason, options);
                            }
                        );
                    return;
                } else if ((options.retry as number)-- > 0) {
                    // 还有重试次数
                    this._send<T>(data, options)
                        .then(resolve, reject);
                    return;
                }
                // 结束请求
                completed = true;
                this._onFail(res, options)
                    .then(reject, reject);
            };
            data.complete = (res: GeneralCallbackResult & ExtraCompleteRes) => {
                if (timeoutHandle) {
                    // 清理计时器
                    clearTimeout(timeoutHandle);
                    timeoutHandle = undefined; // 置空
                } else if (timeoutHandle === 0 && !res.timeout) {
                    // 触发过自定义超时,并且尚未注入timeout
                    timeoutMsg(res, options.timeout);
                }
                if (completed) {
                    // 结束
                    this._complete(res, options);
                }
            };

            const task = this.handle(data);
            if (options.timeout! > 0) {
                // 计时器 自定义超时
                // 超时触发 计时器标志置0, 终止操作
                timeoutHandle = setTimeout(() => { timeoutHandle = 0; task.abort(); }, options.timeout!);
            }
            if (options.onHeadersReceived) {
                task.onHeadersReceived(options.onHeadersReceived); // 响应头回调
            }
            if (options.onProgressUpdate && task.onProgressUpdate) {
                task.onProgressUpdate(options.onProgressUpdate); // 进度回调
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
     * complete 结束操作 按需注入时间
     * @param res - result
     * @param options - all options
     */
    private _complete(res: GeneralCallbackResult & ExtraCompleteRes, options: TFullOptions): void {
        if (options.timestamp) {
            //记录时间戳
            if (typeof options.timestamp === 'object') {
                options.timestamp.response = Date.now();
                res.time = options.timestamp;
            } else {
                res.time = {
                    send: (options as any).__sendTime as number,
                    response: Date.now()
                };
            }
        }
        this._onComplete(res as any, options);

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
    private _onComplete(res: Partial<SuccessParam<TWxOptions>> & GeneralCallbackResult & ExtraCompleteRes, options: TFullOptions) {
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
            reason = {
                errMsg: reason
            };
        }
        // tslint:disable-next-line: no-unsafe-any
        this.Listeners.onAbort.forEach(f => { f(reason, options); });
    }
}

interface TimeRecorder {
    send?: number;
    response?: number;
}

interface ExtraCompleteRes {
    /**
     * 请求时间戳
     */
    time?: TimeRecorder;
}

/**
 * 取消由 setTimeout 设置的定时器。
 * @param timeoutID - 要取消的定时器的
 */
declare function clearTimeout(
    timeoutID: number
): void;

/**
 * 设定一个定时器。在定时到期以后执行注册的回调函数
 * @param callback - 回调操作
 * @param delay - 延迟的时间，函数的调用会在该延迟之后发生，单位 ms。
 * @param rest - param1, param2, ..., paramN 等附加参数，它们会作为参数传递给回调函数。
 */
declare function setTimeout(
    callback: Function,
    delay?: number,
    rest?: any
): number;
