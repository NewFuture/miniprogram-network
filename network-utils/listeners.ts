/**
 * 监听事件列表
 */
export class ListenerEvents<TFullOptions, TResult>{
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
    onRejected: OnRejectListener<TFullOptions>[];
    // onResolved: Function[]
    /**
     * 请求中断事件监听
     */
    onAbort: OnAbortListener<TFullOptions>[];
}

interface GeneralCallbackResult {
    errMsg: string;
}
type OnSendListener<TFullOptions> = (options: TFullOptions) => any;
type OnResponseListener<TResult, TFullOptions> = (res: TResult, options: TFullOptions) => any;
type OnCompleteListener<TFullOptions> = (res: GeneralCallbackResult, options: TFullOptions) => any;
type OnRejectListener<TFullOptions> = (res: GeneralCallbackResult | any, options: TFullOptions) => any;
type OnAbortListener<TFullOptions> = (reason: any, options: TFullOptions) => any;

// type OnResolvedListener = ()=>any;
