import { DOWNLOAD, Downloader } from 'miniprogram-downloader';
import { CacheOperator, Configuration, defaultKeyBuilder, isOkResult } from 'miniprogram-network-cache';
import { Http, REQUEST } from 'miniprogram-request';

/** 缓存配置 */
export const config: Configuration & {
    /** 不缓存方法 */
    excludeMethod: MethodParam['method'][];
} = /*#__PURE__*/ {
    /**
     * 默认缓存时间
     */
    expire: 10 * 60 * 1000,
    /**
     * GET,HEAD,OPTIONS默认缓存
     */
    excludeMethod: ['POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'],
    /**
     * 结果判断条件
     */
    resultCondition: isOkResult,
    /**
     * 缓存的键构建方式,
     * 默认将不存在于`excludeMethod`采用`defaultKeyBuilder`进行构建(请求header不影响缓存)
     * 修改后`excludeMethod`将失效
     */
    keyBuilder: (param) => ((config.excludeMethod.indexOf((param as MethodParam).method) === -1) && defaultKeyBuilder(param))
};

interface CacheOptions {
    /**
     * 缓存时间,单位毫秒
     */
    expire?: number;
}

/**
 * 网络缓存
 */
export const cacheHttp = /*#__PURE__*/ new Http<CacheOptions>(
    REQUEST.Defaults,
    /*#__PURE__*/
    CacheOperator.createHandler(REQUEST.handle, config),
    /*#__PURE__*/
    REQUEST.Listeners
);
/**
 * 下载缓存
 */
export const cacheDownloader = /*#__PURE__*/ new Downloader<CacheOptions>(
    DOWNLOAD.Defaults,
    /*#__PURE__*/
    CacheOperator.createHandler(DOWNLOAD.handle, config),
    /*#__PURE__*/
    DOWNLOAD.Listeners
);

/**
 * request 缓存
 */
export const request: typeof cacheHttp['request'] =
    /*#__PURE__*/
    cacheHttp.request.bind(cacheHttp);
/**
 * GET 缓存
 */
// tslint:disable-next-line: no-reserved-keywords
export const get: typeof cacheHttp['get'] =
    /*#__PURE__*/
    cacheHttp.get.bind(cacheHttp);
/**
 * 下载缓存
 */
export const download: typeof cacheDownloader['download'] =
    /*#__PURE__*/
    cacheDownloader.download.bind(cacheDownloader);

interface MethodParam {
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
}
