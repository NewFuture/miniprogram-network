/// <reference lib="es6"/>
/**
 * 微信小程序操作队列封装管理
 * @example var rq = new WxQueue(wx.requst);
 */
export class WxQueue<Tparam extends BaseOption, Ttask extends BaseTask>{
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
        if (this.TaskMap.size < this.MAX) {
            // task队列未满
            return this.process(id, param);
        } else if (param.jump) {
            // 插队
            this.todo.unshift([id, param]);
        } else {
            this.todo.push([id, param]);
        }
        return {
            abort: () => this.abort(id),
            onProgressUpdate: (callback: any) => this.onProgress(id, callback),
            onHeadersReceived: (callback: any) => this.onHeaders(id, callback),
        } as any;
    }

    /**
     * check and do next task
     */
    private next(): void {
        if (this.todo.length > 0 && this.TaskMap.size < this.MAX) {
            const [taskid, taskOptions] = this.todo.shift()!;
            this.process(taskid, taskOptions);
        }
    }

    /**
     * process a task
     * @param id task ID
     * @param options  task param
     */
    private process(id: number, options: QueueOption<Tparam>): Ttask {
        const oldComplete = options.complete;
        options.complete = (res: any) => {
            this.TaskMap.delete(id);
            oldComplete && oldComplete.call(options, res);
            this.next();
        }
        const task = this.operator(options);
        // task progress polyfill
        if (options.onProgressUpdate && task.onProgressUpdate) {
            task.onProgressUpdate(options.onProgressUpdate);
        }
        // task onHeadersReceived
        if (options.onHeadersReceived) {
            task.onHeadersReceived(options.onHeadersReceived);
        }
        this.TaskMap.set(id, task);
        return task;
    }

    /**
     * stop and remove a task
     * @param taskid - the id of task to abort
     */
    private abort(taskid: number) {
        const index = this.todo.findIndex(v => v[0] === taskid);
        if (index >= 0) {
            const completeCallback = this.todo[index][1].complete;
            this.todo.splice(index, 1);
            // call back complete.
            completeCallback && completeCallback({ errMsg: "request:fail abort" });
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
            this.TaskMap.get(taskid)!.onProgressUpdate!(callback as any);
        }
    }

    private onHeaders(taskid: number, callback: ExtraOptions['onHeadersReceived']) {
        const result = this.todo.find(v => v[0] === taskid);
        if (result) {
            result[1].onHeadersReceived = callback;
        } else if (this.TaskMap.has(taskid)) {
            this.TaskMap.get(taskid)!.onHeadersReceived(callback);
        }
    }
};

export type QueueOption<T> = T & ExtraOptions;

/**
 * 微信操作参数声明 
 */
interface ExtraOptions {
    /**
     * progress 回调
     */
    onProgressUpdate?: wx.UploadTaskOnProgressUpdateCallback | wx.DownloadTaskOnProgressUpdateCallback;
    /** 
     * 开发者服务器返回的 HTTP Response Header 回调
     */
    onHeadersReceived?(result: { header: object }): void;
    jump?: boolean;
}

interface BaseOption {
    /** 开发者服务器接口地址 */
    url: string;
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function;
    /** 接口调用失败的回调函数 */
    fail?: Function;
    /** 接口调用成功的回调函数 */
    success?: Function;
}

interface BaseTask {
    abort(): void;
    /** HTTP Response Header 事件的回调函数 */
    onHeadersReceived(callback: ExtraOptions['onHeadersReceived'], ): void;
    /** 下载进度变化事件的回调函数 */
    onProgressUpdate?(callback: ExtraOptions['onProgressUpdate']): void;
}

declare namespace wx {
    type UploadTaskOnProgressUpdateCallback = (res: {
        /**
         * 上传进度百分比
         */
        progress: number
        /**
         * 已经上传的数据长度，单位 Bytes
         */
        totalBytesSent: number
        /**
         * 预期需要上传的数据总长度，单位 Bytes
         */
        totalBytesExpectedToSend: number
    }) => void;

    type DownloadTaskOnProgressUpdateCallback = (res: {
        /**
         * 下载进度百分比
         */
        progress: number
        /**
         * 已经下载的数据长度，单位 Bytes
         */
        totalBytesWritten: number
        /**
         * 预期需要下载的数据总长度，单位 Bytes
         */
        totalBytesExpectedToWrite: number
    }) => void;
}
