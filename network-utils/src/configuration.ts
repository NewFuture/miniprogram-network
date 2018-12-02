import { KeyBasicValuePair } from "./build-params";
import { CancelToken } from 'miniprogram-cancel-token'

export type WxOptions = wx.RequestOption | wx.DownloadFileOption | wx.UploadFileOption;

export interface BaseConfiguration {

    /**
   * 请求的根目录
   * Base URL for request
   */
    baseURL?: string;

    /**
    * 自定义头 
    * user defined headers
    */
    headers?: KeyBasicValuePair;

    /**
     * URL Path
     * the path parameters to be replace in path
     * Must be a plain object
     * @example 
     *  url = "/{ID}/status"
     *  param = {ID: 12345}
     * request url will be /1234/status
     */
    params?: KeyBasicValuePair,

    /**
    * 重试次数 
    * retry times when fail
    */
    retry?: number;
}



export interface CancelConfiguration {
    /**
     * 取消操作的 CancelToken 
     */
    cancelToken?: CancelToken;
}