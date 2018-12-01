
/**
 * 请求参数预处理,
 * 输入配置; 返回 WxParam | Promise<WxParam>
 */
export type BeforeSend<TConifg, TParam> = (data: TConifg) => TParam | PromiseLike<TParam>;

/**
 * 相应数据数据预处理
 * 输入原始返回信息;返回数据或者包含数据的Promise
 */
export type AfterResponse<TResponse, TOptions, T> = (res: TResponse, config: TOptions) => T | Promise<T>

