import { CacheOperator, Configuration, isOkResult } from 'miniprogram-network-cache';
import { Request, Http } from 'miniprogram-request';
import { Download, Downloader } from 'miniprogram-downloader';

/** 缓存配置 */
export const config: Configuration & { 
    /** 不缓存方法 */
    excludeMethod: Array<MethodParam['method']> 
} = {
    expire: 10 * 60 * 1000,
    /**GET,HEAD,OPTIONS默认缓存 */
    excludeMethod: ['POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'],
    paramCondition: function (param) {
        return config.excludeMethod.indexOf((param as MethodParam).method) < 0;
    },
    resultCondition: isOkResult,
}

/**
 * 网络缓存
 */
export const CacheHttp = new Http(Request.Defaults, CacheOperator.createHandler(Request.handle, config));
/**
 * 下载缓存
 */
export const CacheDownloader = new Downloader(Download.Defaults, CacheOperator.createHandler(Download.handle, config));

/**
 * request 缓存
 */
export const request: Http['request'] = CacheHttp.request.bind(CacheHttp) as Http['request'];
/**
 * GET 缓存
 */
export const get: Http['get'] = CacheHttp.get.bind(CacheHttp) as Http['get'];
/**
 * 下载缓存
 */
export const download: Downloader['download'] = CacheDownloader.download.bind(CacheDownloader) as Downloader['download'];

interface MethodParam {
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
}
