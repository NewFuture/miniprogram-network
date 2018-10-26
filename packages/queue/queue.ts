
/**
 * 微信小程序操作队列封装管理
 * @example var rq = new WxQueue(wx.requst);
 */
export class WxQueue {
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
    private readonly todo: Array<[number, WxOperatorOptions]> = [];


    /**
     * 正在运行的任务
     */
    private readonly TaskMap = new Map<Number, Task>();

    /**
     * Wx的原始操作
     */
    private readonly operator: WxOperator;

    /**
     * 创建Wx操作队列
     * @param wxFunc Wx操作函数
     * @param maxLength 最大队列长度，默认10
     */
    constructor(wxFunc: WxOperator, maxLength: number = 10) {
        this.operator = wxFunc;
        this.MAX = maxLength || 10;
    }

    /**
     * 向队列中添加操作
     * @param param 微信操作
     */
    public push(param: WxOperatorOptions): Task {
        this.todo.push([++this.taskid, param]);
        return this.next() || {
            abort: () => this.abort(this.taskid),
            onProgressUpdate: (callback) => this.progress(this.taskid, callback),
        };
    }

    /**
     * do next task
     * return Undefined and do nothing when queue is full。
     */
    private next(): Task {
        if (this.todo.length > 0 && this.TaskMap.size < this.MAX) {
            const [taskid, taskOptions] = this.todo.shift();
            const oldComplete = taskOptions.complete;
            taskOptions.complete = (...args) => {
                this.TaskMap.delete(taskid);
                oldComplete && oldComplete.apply(taskOptions, args);
                this.next();
            }
            const task = this.operator(taskOptions);
            // task progress polyfill
            if (taskOptions.progress && task.onProgressUpdate) {
                task.onProgressUpdate(taskOptions.progress)
            }
            this.TaskMap.set(taskid, task);
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
            completeCallback && completeCallback();
            this.todo.splice(index, 1);
        } else if (this.TaskMap.has(taskid)) {
            this.TaskMap.get(taskid).abort();
            this.TaskMap.delete(taskid);
        }
    }

    /**
     * progress update callback
     * https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.onProgressUpdate.html
     * @param taskid 
     * @param callback 回调操作
     */
    private progress(taskid, callback: Function) {
        const result = this.todo.find(v => v[0] === taskid);
        if (result) {
            result[1].progress = callback;
        } else if (this.TaskMap.has(taskid)) {
            this.TaskMap.get(taskid).onProgressUpdate(callback);
        }
    }
};

/**
 * 小程序操作方法
 */
type WxOperator = (WxOperatorOptions) => any;

/**
 * 微信操作参数声明 
 */
interface WxOperatorOptions {
    progress?: Function;
    complete?: Function;
}

interface Task {
    /** 取消操作 */
    abort: Function;
    /** 进更新 */
    onProgressUpdate?: Function;
}

export default WxQueue;
