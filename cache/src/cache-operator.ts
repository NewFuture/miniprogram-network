import { Cache } from './cache';

function doNothing(): void { };
export function isOkResult(res: BaseSuccessRes): boolean {
    return res && res.statusCode >= 200 && res.statusCode < 300;
}


/**
 * 缓存操作
 */
export class CacheOperator<
    TRes extends BaseSuccessRes = BaseSuccessRes,
    TOptions extends WxOptions= WxOptions, // 微信操作函数
    TTask extends WxTask=WxTask, // 微信操作的任务类型
    > {
    /**
     * 缓存配置
     */
    public readonly Config: Configuration<TRes, TOptions>;

    private readonly op: (option: TOptions) => TTask;
    private readonly cache: Cache<TRes & CacheRes> = new Cache();
    private readonly callbackMapList: { [key: string]: { success: Function[], fail: Function[], complete: Function[] } } = {};

    constructor(operator: (option: TOptions) => TTask, config?: Configuration<TRes, TOptions>) {
        this.op = operator;
        this.Config = config || {
            expire: 15 * 60 * 1000,
            resultCacheable: isOkResult,
        }
    }

    /**
     * 缓存处理
     * @param options 
     */
    handle(options: TOptions): TTask {
        if (this.Config.paramCacheable && !this.Config.paramCacheable(options)) {
            // 不缓存
            return this.op(options);
        }
        const key = JSON.stringify(options);
        const res = this.cache.get(key);
        if (res) {
            // 缓存命中
            res.cache = (res.cache || 0) + 1;
            try {
                options.success && options.success(res)
            } catch (error) {
                this.cache.delete(key);
            }
            options.complete && options.complete(res);
        } else if (this.callbackMapList[key]) {
            // 请求已发送过
            const callback = this.callbackMapList[key];
            options.success && callback.success.push(options.success);
            options.fail && callback.fail.push(options.fail);
            options.complete && callback.complete.push(options.complete);
        } else {
            // 请求未发送过
            this.callbackMapList[key] = {
                success: options.success ? [options.success] : [],
                fail: options.fail ? [options.fail] : [],
                complete: options.complete ? [options.complete] : [],
            }
            options.success = (res: TRes) => {
                if (this.Config.resultCacheable(res)) {
                    this.cache.set(key, res, this.Config.expire);
                }
                this.callbackMapList[key].success.forEach(function (v) { v(res) });
            }
            options.fail = (res: { errMsg: string }) => {
                this.callbackMapList[key].fail.forEach(function (v) { v(res) });
            }
            options.complete = (res: TRes) => {
                this.callbackMapList[key].complete.forEach(function (v) { v(res) });
                delete this.callbackMapList[key];
            }
            return this.op(options);
        }
        return {
            abort: doNothing,
            onHeadersReceived: doNothing as TTask['onHeadersReceived'],
            onProgressUpdate: doNothing as TTask['onProgressUpdate'],
        } as TTask
    }

    static createHandler<
        TRes extends BaseSuccessRes=BaseSuccessRes,
        TOptions extends WxOptions= WxOptions, // 微信操作函数
        TTask extends WxTask=WxTask, // 微信操作的任务类型
        >(operator: (option: TOptions) => TTask, config?: Configuration<TRes, TOptions>): CacheOperator<TRes, TOptions, TTask>['handle'] {
        const cacheOperator = new CacheOperator(operator, config);
        return cacheOperator.handle.bind(cacheOperator);
    }
}

interface CacheRes {
    cache?: number
}
interface Configuration<TRes, TOptions> {
    expire: number,
    resultCacheable: (res: TRes) => boolean,
    paramCacheable?: (options: TOptions) => boolean,
}

interface WxTask {
    abort(): void;
    /** HTTP Response Header 事件的回调函数 */
    onHeadersReceived(callback: (result: { header: object }) => void, ): void;
    /** 下载进度变化事件的回调函数 */
    onProgressUpdate?(callback: (res: any) => any): void;

};

interface WxOptions {
    /** 开发者服务器接口地址 */
    url: string;
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function;
    /** 接口调用失败的回调函数 */
    fail?: Function;
    /** 接口调用成功的回调函数 */
    success?: (res: any) => any;
};

interface BaseSuccessRes {
    errMsg: string;
    statusCode: number
}