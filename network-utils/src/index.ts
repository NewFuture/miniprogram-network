/// <reference lib="es5"/>
/// <reference lib="es2015.core"/>
// tslint:disable-next-line:no-import-side-effect
import './promise.finally';
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
interface ParamObject {
    [key: string]: string | number | boolean | null | undefined;
    [key: number]: string | number | boolean | null | undefined;
}

/**
 * 参数类型
 */
export type ParamsType =
    | ParamObject
    | ((string | number | boolean)[]);

/**
 * 构建url参数
 * /users/{id} ==> /users/123
 * @param url - url 相对地址或者绝对地址
 * @param params - Obejct 键值对 替换的参数列表
 * @param baseUrl - 根目录，当url以https://或者http://开头忽略此参数
 * @returns 完整参数URL
 */
export function buildParams(
    url: string,
    params?: ParamsType,
    baseUrl?: string
): string {
    if (url && params) {
        Object.keys(params)
            .forEach((key) => {
                // tslint:disable-next-line:no-parameter-reassignment prefer-type-cast
                url = url.replace(new RegExp(`{${key}}`, 'g'), (params as ParamObject)[key] as string);
            });
    }
    // tslint:disable-next-line:no-http-string
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        return url;
    } else {
        return (baseUrl || '') + url;
    }
}

/**
 * 合并公共配置
 * @param data - new configuration for wechat operation
 * @param options - default global configuration
 * @param extendKeys - key need copy to data
 */
export function getCommonOptions<T extends { [key: string]: any }>(
    data: T,
    options: { [key: string]: any },
    extendKeys: (keyof T)[]
): T {
    (['expire', ...extendKeys] as (keyof typeof options)[]).forEach((v) => {
        if (options[v] !== undefined) {
            // tslint:disable-next-line: no-unsafe-any
            data[v as keyof T] = options[v];
        }
    });

    return data;
}

export interface GeneralCallbackResult {
    /**
     * 微信回调消息
     */
    errMsg: string;

    /**
     * 网络请求过程中一些调试信息
     */
    profile?: Profile;

    /**
     * 是否触发了自定义超时
     */
    timeout?: boolean;

    /**
     * 是否是主动取消
     */
    cancel?: boolean;

    /**
     * 触发来源
     */
    source?: string;
}

/**
 * https://developers.weixin.qq.com/miniprogram/dev/framework/performance/network.html
 */
export interface Profile {
    /**
     * 	第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0
     */
    redirectStart: number;
    /**
     * 	最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0
     */
    redirectEnd: number;
    /**
     * 	组件准备好使用 HTTP 请求抓取资源的时间，这发生在检查本地缓存之前
     */
    fetchStart: number;
    /**
     * 	DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
     */
    domainLookupStart: number;
    /**
     * 	DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
     */
    domainLookupEnd: number;
    /**
     * 	HTTP（TCP） 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等。注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间
     */
    connectStart: number;
    /**
     * 	HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间。注意这里握手结束，包括安全连接建立完成、SOCKS 授权通过
     */
    connectEnd: number;
    /**
     * 	SSL建立连接的时间,如果不是安全连接,则值为 0
     */
    SSLconnectionStart: number;
    /**
     * 	SSL建立完成的时间,如果不是安全连接,则值为 0
     */
    SSLconnectionEnd: number;
    /**
     * 	HTTP请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。连接错误重连时，这里显示的也是新建立连接的时间
     */
    requestStart: number;
    /**
     * 	HTTP请求读取真实文档结束的时间
     */
    requestEnd: number;
    /**
     * 	HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
     */
    responseStart: number;
    /**
     * 	HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存
     */
    responseEnd: number;
    /**
     * 	当次请求连接过程中实时 rtt
     */
    rtt: number;
    /**
     * 	评估的网络状态 unknown, offline, slow 2g, 2g, 3g, 4g, last/0, 1, 2, 3, 4, 5, 6
     */
    estimate_nettype: number;
    /**
     * 	协议层根据多个请求评估当前网络的 rtt（仅供参考）
     */
    httpRttEstimate: number;
    /**
     * 	传输层根据多个请求评估的当前网络的 rtt（仅供参考）
     */
    transportRttEstimate: number;
    /**
     * 	评估当前网络下载的kbps
     */
    downstreamThroughputKbpsEstimate: number;
    /**
     * 	当前网络的实际下载kbps
     */
    throughputKbps: number;
    /**
     * 	当前请求的IP
     */
    peerIP: string;
    /**
     * 	当前请求的端口
     */
    port: number;
    /**
     * 	是否复用连接
     */
    socketReused: boolean;
    /**
     * 	发送的字节数
     */
    sendBytesCount: number;
    /**
     * 	收到字节数
     */
    receivedBytedCount: number;
    /**
     * 	使用协议类型，有效值:http1.1, h2, quic, unknown
     */
    protocol: string;
}
