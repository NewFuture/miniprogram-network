import { Cache } from './cache';

// tslint:disable-next-line: no-empty
function doNothing(): void { }
export function isOkResult(res: BaseSuccessRes): boolean {
    return res && res.statusCode >= 200 && res.statusCode < 300;
}

/**
 * 缓存操作
 */
export class CacheOperator<
    TRes extends BaseSuccessRes = BaseSuccessRes,
    TOptions extends WxOptions= WxOptions, // 微信操作函数
    TTask extends WxTask= WxTask, // 微信操作的任务类型
    > {
    /**
     * 缓存配置
     */
    public readonly config: Configuration<TRes, TOptions>;

    private readonly op: (option: TOptions) => TTask;
    private readonly cache: Cache<TRes & CacheRes> = new Cache();
    private readonly callbackMapList: { [key: string]: { success: Function[]; fail: Function[]; complete: Function[] } } = {};

    constructor(operator: (option: TOptions) => TTask, config?: Configuration<TRes, TOptions>) {
        this.op = operator;
        this.config = config || {
            expire: 15 * 60 * 1000,
            resultCondition: isOkResult
        };
    }

    public static createHandler<
        TRes extends BaseSuccessRes= BaseSuccessRes,
        TOptions extends WxOptions= WxOptions, // 微信操作函数
        TTask extends WxTask= WxTask, // 微信操作的任务类型
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
        const key = JSON.stringify(options);
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
        } else if (this.callbackMapList[key]) {
            // 请求已发送过
            const callback = this.callbackMapList[key];
            if (options.success) { callback.success.push(options.success); }
            if (options.fail) { callback.fail.push(options.fail); }
            if (options.complete) { callback.complete.push(options.complete); }
        } else {
            // 请求未发送过
            this.callbackMapList[key] = {
                success: options.success ? [options.success] : [],
                fail: options.fail ? [options.fail] : [],
                complete: options.complete ? [options.complete] : []
            };
            options.success = (res: TRes) => {
                if (this.config.resultCondition(res)) {
                    this.cache.set(key, res, this.config.expire);
                }
                this.callbackMapList[key].success.forEach((v) => { v(res); });
            };
            options.fail = (res: { errMsg: string }) => {
                this.callbackMapList[key].fail.forEach((v) => { v(res); });
            };
            options.complete = (res: TRes) => {
                this.callbackMapList[key].complete.forEach((v) => { v(res); });
                // tslint:disable-next-line: no-dynamic-delete
                delete this.callbackMapList[key];
            };
            return this.op(options);
        }
        // tslint:disable-next-line: no-object-literal-type-assertion
        return {
            abort: doNothing,
            onHeadersReceived: doNothing as TTask['onHeadersReceived'],
            onProgressUpdate: doNothing as TTask['onProgressUpdate']
        } as TTask;
    }
}

interface CacheRes {
    cache?: number;
}
export interface Configuration<TRes= BaseSuccessRes, TOptions= WxOptions> {
    expire: number;
    resultCondition(res: TRes): boolean;
    paramCondition?(options: TOptions): boolean;
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
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function;
    /** 接口调用失败的回调函数 */
    fail?: Function;
    /** 接口调用成功的回调函数 */
    success?(res: any): any;
}

interface BaseSuccessRes {
    errMsg: string;
    statusCode: number;
}
