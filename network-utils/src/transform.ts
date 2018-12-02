import { FirstArgument } from "./first-argument";
import { WxOptions } from "./configuration";
// /**
//  * 请求参数预处理,
//  * 输入配置; 返回 WxParam | Promise<WxParam>
//  */
// export type BeforeSendFunc<TConifg, TParam> = (data: TConifg) => TParam | PromiseLike<TParam>;

// /**
//  * 相应数据数据预处理
//  * 输入原始返回信息;返回数据或者包含数据的Promise
//  */
// export type AfterResponseFunc<TResponse, TOptions, T> = (res: TResponse, config: TOptions) => T | Promise<T>


// export interface TransformConfig<TSend, TResponse> {

//     /**
//      * 修改数据或者头;返回 wx.request参数
//      * 异步返回promise
//      * You may modify the data or headers object before it is sent.
//      */
//     transformSend?: TSend;

//     /**
//      * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
//      * 异步返回Promise
//      * allows changes to the response data to be made before it is passed to then/catch
//      *  @example `res=>res.data`
//      */
//     transformResponse?: TResponse;
// }


/**
 * 数据转换配置信息
 */
export interface TransformConfiguration<TFullOptions, TWxOptions extends WxOptions> {

    /**
     * 请求参数预处理
     * 修改数据或者头;返回 wx.request, wx.downloadFile,wx.uploadFile参数 (不包括回调函数)
     * 支持异步返回promise
     * You may modify the data or headers object before it is sent.
     * @param data 不包含转换函数的所有配置内容
     */
    transformSend?: (data: Exclude<TFullOptions, 'transformSend' | 'transformResponse'>) => Exclude<TWxOptions, 'complete' | 'success' | 'fail'>
        | PromiseLike<Exclude<TWxOptions, 'complete' | 'success' | 'fail'>>;


    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: (res: FirstArgument<TWxOptions['success']>, config: TFullOptions) => any | Promise<any>;

}