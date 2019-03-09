import { DOWNLOAD, Downloader } from 'miniprogram-downloader';
import { CacheOperator, Configuration, isOkResult } from 'miniprogram-network-cache';
import { Http, REQUEST } from 'miniprogram-request';

/** 缓存配置 */
export const config: Configuration & {
    /** 不缓存方法 */
    excludeMethod: MethodParam['method'][];
} = /*@__PURE__*/ {
    expire: 10 * 60 * 1000,
    /** GET,HEAD,OPTIONS默认缓存 */
    excludeMethod: ['POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'],
    paramCondition: (param) => (config.excludeMethod.indexOf((param as MethodParam).method) < 0),
    resultCondition: isOkResult
};

/**
 * 网络缓存
 */
export const cacheHttp = /*@__PURE__*/ new Http(
    REQUEST.Defaults,
    /*@__PURE__*/
    CacheOperator.createHandler(REQUEST.handle, config)
);
/**
 * 下载缓存
 */
export const cacheDownloader = /*@__PURE__*/ new Downloader(
    DOWNLOAD.Defaults,
    /*@__PURE__*/
    CacheOperator.createHandler(DOWNLOAD.handle, config)
);

/**
 * request 缓存
 */
export const request: Http['request'] = /*@__PURE__*/ cacheHttp.request.bind(cacheHttp);
/**
 * GET 缓存
 */
// tslint:disable-next-line: no-reserved-keywords
export const get: Http['get'] = /*@__PURE__*/ cacheHttp.get.bind(cacheHttp);
/**
 * 下载缓存
 */
export const download: Downloader['download'] = /*@__PURE__*/ cacheDownloader.download.bind(cacheDownloader);

interface MethodParam {
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
}
