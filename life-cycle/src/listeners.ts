import { GeneralCallbackResult } from './configuration';

/**
 * 监听事件列表
 */
export class Listeners<TFullOptions, TResult> {
    /**
     * 发送之前事件监听
     */
    public onSend: OnSendListener<TFullOptions>[] = [];
    /**
     * 收到数据事件监听
     */
    public onResponse: OnResponseListener<TResult, TFullOptions>[] = [];
    /**
     * 请求完成事件监听
     */
    public onComplete: OnCompleteListener<TResult, TFullOptions>[] = [];
    /**
     * 处理失败事件监听
     */
    public onRejected: OnRejectListener<TFullOptions>[] = [];
    /**
     * 请求中断事件监听
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
     * 时间戳记录, 通过miniprogram-queue发送并且timestamp设置为true
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
