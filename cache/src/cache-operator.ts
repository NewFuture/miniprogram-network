import { Cache } from './cache';

// tslint:disable-next-line: no-empty
function doNothing(): void { }

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
 * 生成缓存索引
 * @param opts 请求参数对象
 */
function buildCacheKey<TOptions extends WxOptions = WxOptions>(opts: TOptions): string {
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
 * 缓存操作
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
    private readonly callbackListMap: { [key: string]: { success: Function[]; fail: Function[]; complete: Function[] } } = {};
    /**
     * 处理完的回调,待删除
     */
    private readonly completeMap: { [key: string]: Function[] } = {};

    constructor(operator: (option: TOptions) => TTask, config?: Configuration<TRes, TOptions>) {
        this.op = operator;
        this.config = config || {
            expire: 15 * 60 * 1000,
            resultCondition: isOkResult
        };
    }

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
    public handle(options: TOptions): TTask {
        if (this.config.paramCondition && !this.config.paramCondition(options)) {
            // 不缓存
            return this.op(options);
        }
        const key = (this.config.headerBuilder && options.header ? this.config.headerBuilder(options.header) : '') + buildCacheKey(options);
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
            this.callbackListMap[key] = {
                success: options.success ? [options.success] : [],
                fail: options.fail ? [options.fail] : [],
                complete: options.complete ? [options.complete] : []
            };
            const data = {
                ...options,
                success: (res: TRes) => {
                    if (this.config.resultCondition(res)) {
                        this.cache.set(key, res, this.config.expire);
                    }
                    this._getMapBeforeComplete(key).success
                        .forEach((v) => { v(res); });
                },
                fail: (res: { errMsg: string }) => {
                    this._getMapBeforeComplete(key).fail
                        .forEach((v) => { v(res); });
                },
                complete: (res: TRes) => {
                    this.completeMap[key].forEach((v) => { v(res); });
                    // tslint:disable-next-line: no-dynamic-delete
                    delete this.completeMap[key];
                }
            };
            return this.op(data);
        }
        // tslint:disable-next-line: no-object-literal-type-assertion
        return {
            abort: () => {
                if (this.callbackListMap[key]) {
                    if (options.success) {
                        arrayRemove(this.callbackListMap[key].success, options.success);
                    }
                    const callbackList = [];
                    if (options.fail) {
                        arrayRemove(this.callbackListMap[key].fail, options.fail);
                        callbackList.push(options.fail);
                    }
                    if (options.complete) {
                        arrayRemove(this.callbackListMap[key].complete, options.complete);
                        callbackList.push(options.complete);
                    }
                    const res = { errMsg: 'request:fail abort', cancel: true, source: CacheOperator.name };
                    callbackList.forEach(f => { f(res); });
                }
            },
            onHeadersReceived: doNothing as TTask['onHeadersReceived'],
            onProgressUpdate: doNothing as TTask['onProgressUpdate']
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
     */
    paramCondition?(options: TOptions): boolean;
    /**
     * 请求 header 缓存key构建方法,无则忽略header
     * @param header 请求头
     */
    headerBuilder?(header: object): string;
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
