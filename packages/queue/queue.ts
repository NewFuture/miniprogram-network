
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
    private taskNum = 0;

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
        if (this.todo.length > 0 && this.taskNum < this.MAX) {
            const task = this.todo.shift();
            const oldComplete = task.complete;
            task.complete = (...args) => {
                --this.taskNum;
                oldComplete && oldComplete.apply(task, args);
                this.next();
            }
            ++this.taskNum;
            return this.operator(task);
        }
    }
};

/**
 * 小程序操作方法
 */
type WxOperator = (WxOperatorOptions) => void | any;

/**
 * 微信操作参数声明 
 */
interface WxOperatorOptions {
    complete?: Function;
}

export default WxQueue;