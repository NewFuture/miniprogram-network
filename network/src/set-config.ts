import { DOWNLOAD, DownloadInit } from 'miniprogram-downloader';
import { GeneralCallbackResult, Omit } from 'miniprogram-network-utils';
import { REQUEST, RequestInit } from 'miniprogram-request';
import { UPLOAD, UploadInit } from 'miniprogram-uploader';

/**
 * 公共配置
 */
type CommonConfig = Partial<Omit<(RequestInit | DownloadInit | UploadInit<any>), 'transformSend' | 'transformResponse' | 'retry'>>;

/**
 * 设置所有网络请求基本配置
 * @param config 公共配置项
 */
function setConfig(config: CommonConfig): void;
/**
 * 设置所有网络请求公共配置
 * @example setConfig<'retry'>('retry',3);
 * @param key - 配置字段
 * @param value - 配置值
 */
function setConfig<T extends (keyof CommonConfig) | 'retry'>(
    key: T,
    value: (CommonConfig & { 'retry'?: number | ((data: object, reason?: GeneralCallbackResult) => Promise<object>) })[T]
): void;
function setConfig(): void {
    if (arguments.length === 2) {
        const key: keyof CommonConfig = arguments[0] as keyof CommonConfig;
        const value = arguments[1];
        REQUEST.Defaults[key] = value;
        DOWNLOAD.Defaults[key] = value;
        UPLOAD.Defaults[key] = value;
    } else if (typeof arguments[0] === 'object') {
        const config: CommonConfig = arguments[0] as CommonConfig;
        Object.keys(config)
            .forEach((key) => {
                REQUEST.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig] as any;
                DOWNLOAD.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig] as any;
                UPLOAD.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig] as any;
            });
    }
}

/**
 * 延迟重试
 * 会在 options.__failure 记录失败的次数
 * @param delay 延时时间 单位ms
 * @param retryTimes 重试次数
 */
function delayRetry<TWxOptions>(delay: number, retryTimes: number = 1):
    (data: TWxOptions, reason?: GeneralCallbackResult) => Promise<TWxOptions> {
    return function (this: { __failure: number }, data, reason) {
        this.__failure = (this.__failure || 0) + 1;
        return new Promise<TWxOptions>((resolve, reject) => {
            if (this.__failure > retryTimes) {
                reject(reason);
            } else {
                setTimeout(resolve, delay, data); // tslint:disable-line: no-string-based-set-timeout
            }
        });
    };
}

export {
    setConfig,
    delayRetry
};

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
