import { Cache } from './cache';

function doNothing(): void { };

/**
 * 缓存操作
 */
export class CacheOperator<
    TRes extends { errMsg: string }={ errMsg: string },
    TOptions extends WxOptions<TRes>= WxOptions<TRes>, // 微信操作函数
    TTask extends WxTask=WxTask, // 微信操作的任务类型
    > {
    /**
     * 缓存配置
     */
    public readonly Config: Configuration;

    private readonly op: (option: TOptions) => TTask;
    private readonly cache: Cache<TRes & CacheRes> = new Cache();

    constructor(operator: (option: TOptions) => TTask, config?: Configuration) {
        this.op = operator;
        this.Config = config || {
            expire: 15 * 60 * 1000,
            cacheable: (res) => true,
        }
    }

    /**
     * 缓存处理
     * @param options 
     */
    handle(options: TOptions): TTask {
        const key = JSON.stringify(options);
        const res = this.cache.get(key);
        if (res === undefined) {
            options.success = (res) => {
                if (this.Config.cacheable(res, options)) {
                    (res as CacheRes).cache = 0;
                    this.cache.set(key, res, this.Config.expire);
                }
                options.success(res);
            }
            return this.op(options);
        } else {
            if (options.success) {
                ++res.cache;
                try {
                    options.success(res)
                } catch (error) {
                    this.cache.delete(key);
                }
                if (options.complete) {
                    options.complete(res);
                }
            }
            return {
                abort: doNothing,
                onHeadersReceived: doNothing as TTask['onHeadersReceived'],
                onProgressUpdate: doNothing as TTask['onProgressUpdate'],
            } as TTask
        }
    }

    static createHandler<TOptions extends WxOptions<any>= WxOptions<any>, // 微信操作函数
        TTask extends WxTask=WxTask, // 微信操作的任务类型
        >(operator: (option: TOptions) => TTask, config?: Configuration): CacheOperator['handle'] {
        const cacheOperator = new CacheOperator(operator, config);
        return cacheOperator.handle.bind(cacheOperator);
    }
}

interface CacheRes {
    cache?: number
}
interface Configuration {
    expire: number,
    cacheable: (res, param) => boolean,
}

interface WxTask {
    abort(): void;
    /** HTTP Response Header 事件的回调函数 */
    onHeadersReceived(callback: (result: { header: object }) => void, ): void;
    /** 下载进度变化事件的回调函数 */
    onProgressUpdate?(callback: (res: any) => any): void;

};

interface WxOptions<TRes> {
    /** 开发者服务器接口地址 */
    url: string;
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function;
    /** 接口调用失败的回调函数 */
    fail?: Function;
    /** 接口调用成功的回调函数 */
    success?: (res: TRes) => any;
};