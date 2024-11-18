import { REQUEST, Http, transformRequestSendDefault, transformRequestResponseOkData } from '../src/index';

//每次请求全部可配置参数
//已设置的参数会覆盖默认参数
//仅对此次请求生效
REQUEST.request({
    url: 'items',
    method: 'POST',
    data: {},
    /**
     * 取消操作的 CancelToken 
     */
    cancelToken: undefined,
    /**
     * 请求的根目录
     * Base URL for request
     */
    baseURL: 'https://qq.com/',

    /**
    * 自定义头 
    * user defined headers
    */
    headers: {},

    /**
     * URL Path
     * the path parameters to be replace in path
     * Must be a plain object
     */
    params: {},

    /**
    * 重试次数 
    * retry times when fail
    */
    retry: 3,

    /**
     * response data type
     */
    responseType: "json",

    /**
     * 修改数据或者头;返回 wx.request参数
     * 异步返回promise
     * You may modify the data or headers object before it is sent.
     */
    transformSend: transformRequestSendDefault,
    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse: transformRequestResponseOkData
})

// 快速请求配置参数
REQUEST.post('items', {}, {
    //除了method,url和 data 不能设置其他均可设置
    cancelToken: undefined,
    baseURL: 'https://qq.com/',
    headers: {},
    params: undefined,
    retry: 3,
    responseType: "json",
    transformSend: transformRequestSendDefault,
    transformResponse: transformRequestResponseOkData,
})


// 重新创建一个Http
const http = new Http({
    //除了method,url，data 和cancelToken不能设置其他均可设置
    baseURL: 'https://qq.com/',
    headers: {},
    params: undefined,
    retry: 3,
    responseType: "json",
    transformSend(options) {
        return transformRequestSendDefault(options);
    },
    transformResponse: transformRequestResponseOkData
})

http.get('test');//将采用默认配置