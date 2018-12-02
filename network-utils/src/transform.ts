
/**
 * 请求参数预处理,
 * 输入配置; 返回 WxParam | Promise<WxParam>
 */
export type BeforeSendFunc<TConifg, TParam> = (data: TConifg) => TParam | PromiseLike<TParam>;

/**
 * 相应数据数据预处理
 * 输入原始返回信息;返回数据或者包含数据的Promise
 */
export type AfterResponseFunc<TResponse, TOptions, T> = (res: TResponse, config: TOptions) => T | Promise<T>


export interface TransformConfig<TSend, TResponse> {

    /**
     * 修改数据或者头;返回 wx.request参数
     * 异步返回promise
     * You may modify the data or headers object before it is sent.
     */
    transformSend?: TSend;

    /**
     * 返回数据修改，返回值作为then的输入, throw exception 抛给catch
     * 异步返回Promise
     * allows changes to the response data to be made before it is passed to then/catch
     *  @example `res=>res.data`
     */
    transformResponse?: TResponse;
}