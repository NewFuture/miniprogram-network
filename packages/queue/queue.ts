
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
     * 待完成队列
     */
    private todo: Array<WxOperatorOptions> = [];

    /**
     * 当前队列任务数
     */
    private taskid = 0;

    private TaskMap = new Map<Number,Task>();

    /**
     * Wx的原始操作
     */
    private operator: WxOperator;

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
    public push(param: WxOperatorOptions): void {
        this.todo.push(param);
        return this.next();
    }

    private next() {
        if (this.todo.length > 0 && this.TaskMap.size < this.MAX) {
            const taskOptions = this.todo.shift();
            const oldComplete = taskOptions.complete;
            const taskid = ++this.taskid;
            taskOptions.complete = (...args) => {
                this.TaskMap.delete(taskid);
                oldComplete && oldComplete.apply(taskOptions, args);
                this.next();
            }
            const task = this.operator(taskOptions);
            this.TaskMap.set(taskid,task);
            return task;
        }
        else{

        }
    }

    private delete(taskid:number){
        
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
    complete?: Function;
}

interface Task{
    /** 取消操作 */
    abort?:Function;
}
export default WxQueue;