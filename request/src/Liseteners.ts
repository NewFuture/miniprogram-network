import { RequestOptions } from "./Configuration";

/**
 * 监听事件列表
 */
export class ListenerEvents {
    /**
     * 发送之前事件监听
     */
    onSend: OnSendListener[] = [];
    /**
     * 收到数据事件监听
     */
    onResponse: OnResponseListener[] = [];
    /**
     * 请求完成事件监听
     */
    onComplete: OnCompleteListener[] = [];
    /**
    * 处理失败事件监听
    */
    onRejected: OnRejectListener[];
    // onResolved: Function[]
    /**
     * 请求中断事件监听
     */
    onAbort: OnAbortListener[];
}

type OnSendListener = (options: RequestOptions) => any;
type OnResponseListener = (res: wx.RequestSuccessCallbackResult, options: RequestOptions) => any;
type OnCompleteListener = (res: wx.GeneralCallbackResult, options: RequestOptions) => any;
type OnRejectListener = (res: any | wx.GeneralCallbackResult, options: RequestOptions) => any;
type OnAbortListener = (reason: any, options: RequestOptions) => any;

// type OnResolvedListener = ()=>any;
