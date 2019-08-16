import { Cache } from './cache';

/**
 * 删除数组中的元素
 * @param array 数组
 * @param value 值
 */
function arrayRemove<T>(array: T[], value: T): void {
    const index = array.indexOf(value);
    if (index >= 0) {
        array.splice(index, 1);
    }
}

/**
 * 是否为数组中的唯一元素
 * @param array
 * @param value
 */
function isEmptyOrOnly<T>(array: T[], value: T): boolean {
    return array.length === 0 || (array.length === 1 && array[0] === value);
}
/**
 * 默认缓存索引生成函数,
 * 使用 `url`,`method`,`responseType`,`dataType`,`filePath`,`name`参数 + `data`或`formData`构建缓存Key
 * 请求的`header` 默认会被忽略
 * @param opts 请求参数对象
 * @template TOptions 完整请求参数
 * @returns string
 */
export function defaultKeyBuilder<TOptions extends WxOptions = WxOptions>(opts: TOptions): string {
    /**
     * 缓存的请求字段
     * https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html
     */
    const CACHE_FIELDS = [
        'url', // all
        'method', // request
        'responseType', // request
        'dataType', // request
        'filePath', // download
        'name'// upload
        // 'header'
        // 'data'
    ];
    const data = (opts as { data?: any }).data || (opts as { formData?: any }).formData;
    return JSON.stringify(opts, CACHE_FIELDS) + (data ? JSON.stringify(data) : '');
}

/**
 * 是否为2xx数据
 * @param res 完整返回数据
 */
export function isOkResult(res: BaseSuccessRes): boolean {
    return res && res.statusCode >= 200 && res.statusCode < 300;
}

/**
 * 缓存操作,
 * 维护缓存结果,自动合并同样请求的并发操作
 * @template TRes 操作结果回调数据类型
 * @template TOptions 参数数据类型
 * @template TTask 微信任务类型
 */
export class CacheOperator<
    TRes extends BaseSuccessRes = BaseSuccessRes,
    TOptions extends WxOptions = WxOptions, // 微信操作函数
    TTask extends WxTask = WxTask, // 微信操作的任务类型
    > {
    /**
     * 缓存配置
     */
    public readonly config: Configuration<TRes, TOptions>;

    private readonly op: (option: TOptions) => TTask;
    private readonly cache: Cache<TRes & CacheRes> = new Cache();
    /**
     * 正在处理的回调
     */
    private readonly callbackListMap: { [key: string]: { success: Function[]; fail: Function[]; complete: Function[]; task: WxTask } } = {};
    /**
     * 处理完的回调,待删除
     */
    private readonly completeMap: { [key: string]: Function[] } = {};

    /**
     * @param operator 底层操作
     * @param config 默认配置
     */
    constructor(operator: (option: TOptions) => TTask, config?: Configuration<TRes, TOptions>) {
        this.op = operator;
        this.config = config || {
            expire: 15 * 60 * 1000,
            resultCondition: isOkResult
        };
    }

    /**
     * 快速创建一个
     */
    public static createHandler<
        TRes extends BaseSuccessRes = BaseSuccessRes,
        TOptions extends WxOptions = WxOptions, // 微信操作函数
        TTask extends WxTask = WxTask, // 微信操作的任务类型
        >(operator: (option: TOptions) => TTask, config?: Configuration<TRes, TOptions>): CacheOperator<TRes, TOptions, TTask>['handle'] {
        const cacheOperator = new CacheOperator(operator, config);
        return cacheOperator.handle.bind(cacheOperator);
    }

    /**
     * 缓存处理
     * @param options - 参数
     */
    public handle(options: TOptions & Partial<Configuration<TRes, TOptions>>): TTask {
        const keyBuilder = options.keyBuilder || this.config.keyBuilder || defaultKeyBuilder;
        const key = keyBuilder(options);
        if (!key) {
            // 不缓存
            return this.op(options);
        }
        const result = this.cache.get(key);
        if (result) {
            // 缓存命中
            result.cache = (result.cache || 0) + 1;
            try {
                if (options.success) { options.success(result); }
            } catch (error) {
                this.cache.delete(key);
            }
            if (options.complete) { options.complete(result); }
        } else if (this.callbackListMap[key]) {
            // 请求已发送过
            const callback = this.callbackListMap[key];
            if (options.success) { callback.success.push(options.success); }
            if (options.fail) { callback.fail.push(options.fail); }
            if (options.complete) { callback.complete.push(options.complete); }
        } else {
            // 请求未发送过

            const data = {
                ...options,
                success: (res: TRes) => {
                    const expire = options.expire === undefined ? this.config.expire : options.expire;
                    // 过期时间为0不缓存,但是会合并请求
                    if (expire > 0 && (options.resultCondition || this.config.resultCondition)(res)) {
                        // 缓存请求结果
                        this.cache.set(key, res, expire);
                    }
                    this._getMapBeforeComplete(key).success
                        .forEach((v) => { v(res); });
                },
                fail: (res: { errMsg: string }) => {
                    // fail 回调异步化 (微信实现可能是同步调用)
                    // tslint:disable-next-line: no-floating-promises
                    Promise.resolve(this._getMapBeforeComplete(key).fail)
                        .then(f => { f.forEach((v) => { v(res); }); });
                },
                complete: (res: TRes) => {
                    this.completeMap[key].forEach((v) => { v(res); });
                    // tslint:disable-next-line: no-dynamic-delete
                    delete this.completeMap[key];
                }
            };
            this.callbackListMap[key] = {
                success: options.success ? [options.success] : [],
                fail: options.fail ? [options.fail] : [],
                complete: options.complete ? [options.complete] : [],
                task: {} as WxTask,
            };
            // 微信task同步创建异步调用
            // 防止同步执行fail时 this.callbackListMap[key] 还未赋值
            // 先赋值 this.callbackListMap[key] 再 执行  this.op(data))
            return (this.callbackListMap[key].task = this.op(data));
        }
        // tslint:disable-next-line: no-object-literal-type-assertion
        return {
            abort: () => {
                const cbMap = this.callbackListMap[key];
                if (cbMap) {
                    if (
                        isEmptyOrOnly(cbMap.success, options.success)
                        && isEmptyOrOnly(cbMap.fail, options.fail)
                        && isEmptyOrOnly(cbMap.complete, options.complete)
                    ) {
                        cbMap.task.abort();
                    } else {
                        if (options.success) {
                            arrayRemove(cbMap.success, options.success);
                            const callbackList = [];
                            if (options.fail) {
                                arrayRemove(cbMap.fail, options.fail);
                                callbackList.push(options.fail);
                            }
                            if (options.complete) {
                                arrayRemove(cbMap.complete, options.complete);
                                callbackList.push(options.complete);
                            }
                            const res = { errMsg: 'request:fail abort', source: CacheOperator.name };
                            callbackList.forEach(f => { f(res); });
                        }
                    }
                }
            },
            onHeadersReceived: (f) => {
                if (this.callbackListMap[key]) {
                    this.callbackListMap[key].task.onHeadersReceived(f);
                } else {
                    f(this.cache.get(key) || {});
                }
            },
            onProgressUpdate: (f) => {
                if (this.callbackListMap[key]) {
                    const task = this.callbackListMap[key].task;
                    if (task.onProgressUpdate) {
                        task.onProgressUpdate(f);
                    }
                } else {
                    f({ progress: 100 });
                }
            }
        } as TTask;
    }

    /**
     * fixed #10
     * 在回调中再次发起操作前清除任务
     * @param key cacheKey
     */
    private _getMapBeforeComplete(key: string): { success: Function[]; fail: Function[]; complete: Function[] } {
        // remove the MapList from the `callbackMapList`
        const list = this.callbackListMap[key];
        // tslint:disable-next-line: no-dynamic-delete
        delete this.callbackListMap[key];
        this.completeMap[key] = list.complete;
        return list;
    }
}

interface CacheRes {
    /**
     * 缓存命中次数
     */
    cache?: number;
}
export interface Configuration<TRes = BaseSuccessRes, TOptions = WxOptions> {
    /**
     * 缓存时间
     */
    expire: number;
    /**
     * 结果缓存条件
     * @param res 结果
     */
    resultCondition(res: TRes): boolean;
    /**
     * 参数缓存条件,无则全部缓存
     * @param options request/downloadFile参数
     * @returns 返回string键值,无返回值时不进行缓存和请求合并
     */
    keyBuilder?(options: TOptions): string | void | null | false;
}

interface WxTask {
    abort(): void;
    /** HTTP Response Header 事件的回调函数 */
    onHeadersReceived(callback: (result: any) => void): void;
    /** 下载进度变化事件的回调函数 */
    onProgressUpdate?(callback: (res: any) => any): void;
}

interface WxOptions {
    /** 开发者服务器接口地址 */
    url: string;
    /**
     * HTTP 请求 Header
     */
    header?: object;
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?(res: { errMsg: string }): void;
    /** 接口调用失败的回调函数 */
    fail?(res: { errMsg: string }): void;
    /** 接口调用成功的回调函数 */
    success?(res: any): any;
}

interface BaseSuccessRes {
    errMsg: string;
    statusCode: number;
}
