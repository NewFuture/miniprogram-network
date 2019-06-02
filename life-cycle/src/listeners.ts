import { GeneralCallbackResult } from './configuration';

/**
 * 监听事件列表
 */
export class Listeners<TFullOptions, TResult> {
    /**
     * 发送之前事件监听列表
     * 回调函数参数为`完整配置`(只读,不应修改)
     */
    public onSend: OnSendListener<TFullOptions>[] = [];
    /**
     * 收到数据响应后事件监听列表
     * 回调函数参数为`返回结果`和`完整配置`(只读,不应修改)
     */
    public onResponse: OnResponseListener<TResult, TFullOptions>[] = [];
    /**
     * 请求完成时事件监听列表
     * 回调函数参数为`操作结果`和`完整配置`(只读,不应修改)
     */
    public onComplete: OnCompleteListener<TResult, TFullOptions>[] = [];
    /**
     * 处理失败事件监听列表
     * 回调函数参数为`失败原因`和`完整配置`(只读,不应修改)
     */
    public onRejected: OnRejectListener<TFullOptions>[] = [];
    /**
     * 请求取消事件监听列表
     * 回调函数参数为`取消原因`和`完整配置`(只读,不应修改)
     */
    public onAbort: OnAbortListener<TFullOptions>[] = [];
}

/**
 * 发送前监听
 */
type OnSendListener<TFullOptions> = (options: Readonly<TFullOptions>) => any;
/**
 * 发送时监听
 */
type OnResponseListener<TResult, TFullOptions> = (res: Readonly<TResult>, options: Readonly<TFullOptions>) => any;
/**
 * 操作完成时
 */
type OnCompleteListener<TResult, TFullOptions> = (
    res: Readonly<Partial<TResult> & CommonCompleteResult>,
    options: Readonly<TFullOptions>
) => any;
/**
 * 失败
 */
type OnRejectListener<TFullOptions> = (res: Readonly<{ errMsg: string } | any>, options: Readonly<TFullOptions>) => any;
/**
 * 操作取消时
 */
type OnAbortListener<TFullOptions> = (reason: Readonly<any>, options: Readonly<TFullOptions>) => any;

interface CommonCompleteResult extends GeneralCallbackResult {
    /**
     * 时间戳记录, 通过发送并且timestamp设置为true
     */
    time?: {
        /**
         *  发送时间戳
         */
        send: number;
        /**
         * 结束时间戳
         */
        response: number;
    };
}
