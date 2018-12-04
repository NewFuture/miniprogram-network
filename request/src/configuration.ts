import { BaseConfiguration, ExtraConfiguration } from "miniprogram-network-life-circle";

/**
 * 默认配置信息
 * (创建Request的配置信息)
 */
export interface RequestInit extends BaseConfiguration<RequestOption, wx.RequestOption> {
    /**
     * response data type
     */
    responseType?: "json" | "text" | "arraybuffer";
}

/**
 * 单个请求的额外配置信息
 */
export type RequestConfig = RequestInit & ExtraConfiguration<wx.RequestTask>;

/**
 * 每个请求的全部配置信息
 */
export interface RequestOption extends RequestInit, ExtraConfiguration<wx.RequestTask> {
    /**
    * 请求的地址
    */
    url: string,

    /**
    * 请求方法
    * HTTP request mthod: GET POST ...
    */
    method?: wx.RequestOption['method'],

    /**
     * 请求数据
     * reqeust data
     *  * **data 数据说明：**
     *
     * 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
     *
     * *   对于 `GET` 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     * *   对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会对数据进行 JSON 序列化
     * *   对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     */
    data?: any,
    // onProgress?: wx.DownloadTask['offProgressUpdate']
}