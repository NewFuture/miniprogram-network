/// <reference lib="es6"/>
/**
 * 微信小程序操作队列封装管理
 * @example var rq = new WxQueue(wx.requst);
 */
export class WxQueue<Tparam extends wx.RequestOption | wx.DownloadFileOption | wx.UploadFileOption,
    Ttask extends wx.RequestTask | wx.DownloadTask | wx.UploadTask>{
    /**
     *  队列最大长度
     */
    readonly MAX: number;

    /**
     * 任务ID计数器
     */
    private taskid = 0;

    /**
     * 待完成队列
     */
    private readonly todo: Array<[number, Tparam & ExtraOptions]> = [];


    /**
     * 正在运行的任务
     */
    private readonly TaskMap = new Map<number, Ttask>();
    // { [key: number]: Ttask } = {};

    /**
     * 小程序的原始操作
     * 
     */
    private readonly operator: (params: Tparam) => Ttask;

    /**
     * 创建Wx操作队列
     * @param wxFunc Wx操作函数
     * @param maxLength 最大队列长度，默认10
     */
    constructor(wxFunc: (params: Tparam) => Ttask, maxLength: number = 10) {
        this.operator = wxFunc;
        this.MAX = maxLength || 10;
    }

    /**
     * 向队列中添加操作
     * @param param 微信操作
     */
    public push(param: QueueOption<Tparam>): Ttask {
        const id = ++this.taskid;
        if (param.jump) {
            //插队
            this.todo.unshift([id, param]);
        } else {
            this.todo.push([id, param]);
        }

        return this.next() || {
            abort: () => this.abort(id),
            onProgressUpdate: (callback: any) => this.onProgress(id, callback),
            onHeadersReceived: (callback: any) => this.onHeaders(id, callback),
        } as any;
    }

    /**
     * do next task
     * return Undefined and do nothing when queue is full。
     */
    private next(): Ttask | void {
        const map = this.TaskMap;
        if (this.todo.length > 0 && map.size < this.MAX) {
            const [taskid, taskOptions] = this.todo.shift()!;
            const oldComplete = taskOptions.complete;
            taskOptions.complete = (res) => {
                map.delete(taskid);
                oldComplete && oldComplete.apply(taskOptions, [res]);
                this.next();
            }
            const task = this.operator(taskOptions);
            // task progress polyfill
            if (taskOptions.onProgressUpdate && (<wx.UploadTask>task).onProgressUpdate) {
                (<wx.UploadTask>task).onProgressUpdate(taskOptions.onProgressUpdate as wx.UploadTaskOnProgressUpdateCallback);
            }
            if (taskOptions.onHeadersReceived) {
                (<wx.UploadTask>task).onHeadersReceived(taskOptions.onHeadersReceived);
            }
            map.set(taskid, task);
            return task;
        }
    }

    /**
     * stop and remove a task
     * @param taskid - the id of task to abort
     */
    private abort(taskid: number) {
        const index = this.todo.findIndex(v => v[0] === taskid);
        if (index >= 0) {
            const completeCallback = this.todo[index][1].complete;
            // call back complete.
            completeCallback && completeCallback({ errMsg: "request:fail abort" });
            this.todo.splice(index, 1);
        } else if (this.TaskMap.has(taskid)) {
            this.TaskMap.get(taskid)!.abort();
            this.TaskMap.delete(taskid);
        }
    }

    /**
     * progress update callback
     * https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.onProgressUpdate.html
     * @param taskid 
     * @param callback 回调操作
     */
    private onProgress(taskid: number, callback: ExtraOptions['onProgressUpdate']): void {
        const result = this.todo.find(v => v[0] === taskid);
        if (result) {
            result[1].onProgressUpdate = callback;
        } else if (this.TaskMap.has(taskid)) {
            (this.TaskMap.get(taskid) as wx.UploadTask).onProgressUpdate(callback as wx.UploadTaskOnProgressUpdateCallback);
        }
    }

    private onHeaders(taskid: number, callback: wx.RequestTaskOnHeadersReceivedCallback) {
        const result = this.todo.find(v => v[0] === taskid);
        if (result) {
            result[1].onHeadersReceived = callback;
        } else if (this.TaskMap.has(taskid)) {
            this.TaskMap.get(taskid)!.onHeadersReceived(callback);
        }
    }
};

/**
 * 微信操作参数声明 
 */
interface ExtraOptions {
    /**
     * progress 回调
     */
    onProgressUpdate?: wx.UploadTaskOnProgressUpdateCallback | wx.DownloadTaskOnProgressUpdateCallback;
    onHeadersReceived?: wx.RequestTaskOnHeadersReceivedCallback | wx.RequestTaskOnHeadersReceivedCallback | wx.RequestTaskOnHeadersReceivedCallback;
    jump?: boolean;
}

export type QueueOption<T> = T & ExtraOptions;
// type Task = Partial<(wx.RequestTask & wx.DownloadTask & wx.UploadTask)>;