import { DOWNLOAD, DownloadInit } from 'miniprogram-downloader';
import { Omit } from 'miniprogram-network-utils';
import { REQUEST, RequestInit } from 'miniprogram-request';
import { UPLOAD, UploadInit } from 'miniprogram-uploader';

/**
 * 公共配置
 */
type CommonConfig = Partial<Omit<(RequestInit | DownloadInit | UploadInit), 'transformSend' | 'transformResponse'>>;

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
function setConfig<T extends keyof CommonConfig>(key: T, value: CommonConfig[T]): void;
function setConfig(): void {
    if (arguments.length === 2) {
        const key: keyof CommonConfig = arguments[0] as keyof CommonConfig;
        const value = arguments[1] as CommonConfig[keyof CommonConfig];
        REQUEST.Defaults[key] = value;
        DOWNLOAD.Defaults[key] = value;
        UPLOAD.Defaults[key] = value;
    } else if (typeof arguments[0] === 'object') {
        const config: CommonConfig = arguments[0] as CommonConfig;
        Object.keys(config)
            .forEach(function (key) {
                REQUEST.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig];
                DOWNLOAD.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig];
                UPLOAD.Defaults[key as keyof CommonConfig] = config[key as keyof CommonConfig];
            });
    }
}

export {
    setConfig
};
