/**
 * 监听事件列表
 */
export class EventListeners<TFullOptions, TResult>{
    /**
     * 发送之前事件监听
     */
    onSend: OnSendListener<TFullOptions>[] = [];
    /**
     * 收到数据事件监听
     */
    onResponse: OnResponseListener<TResult, TFullOptions>[] = [];
    /**
     * 请求完成事件监听
     */
    onComplete: OnCompleteListener<TFullOptions>[] = [];
    /**
    * 处理失败事件监听
    */
    onRejected: OnRejectListener<TFullOptions>[] = [];
    // onResolved: Function[]
    /**
     * 请求中断事件监听
     */
    onAbort: OnAbortListener<TFullOptions>[] = [];
}

interface GeneralCallbackResult {
    errMsg: string;
}

/**
 * 发送前监听
 */
type OnSendListener<TFullOptions> = (options: TFullOptions) => any;
/**
 * 发送时监听
 */
type OnResponseListener<TResult, TFullOptions> = (res: TResult, options: TFullOptions) => any;
/**
 * 操作完成时
 */
type OnCompleteListener<TFullOptions> = (res: GeneralCallbackResult, options: TFullOptions) => any;
/**
 * 失败
 */
type OnRejectListener<TFullOptions> = (res: GeneralCallbackResult | any, options: TFullOptions) => any;
/**
 * 操作取消时
 */
type OnAbortListener<TFullOptions> = (reason: any, options: TFullOptions) => any;

// type OnResolvedListener = ()=>any;
