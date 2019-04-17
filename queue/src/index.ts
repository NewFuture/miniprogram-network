/// <reference lib="es6"/>
import Timeout = NodeJS.Timeout;

/**
 * 微信小程序操作队列封装管理
 * @example var rq = new WxQueue(wx.requst);
 */
export class WxQueue<Tparam extends BaseOption, Ttask extends BaseTask> {
  /**
   *  队列最大长度
   */
  public readonly MAX: number;

  /**
   * 任务ID计数器
   */
  private taskid = 0;

  /**
   * 待完成队列
   */
  private readonly todo: [number, Tparam & ExtraOptions][] = [];

  /**
   * 正在运行的任务
   */
  private readonly taskMap = new Map<number, [Ttask, TimeRecorder?]>();
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
    if (this.taskMap.size < this.MAX) {
      // task队列未满
      return this._process(id, param);
    } else if (param.jump) {
      // 插队
      this.todo.unshift([id, param]);
    } else {
      this.todo.push([id, param]);
    }

    return {
      abort: (): void => { this._abort(id); },
      onProgressUpdate: (callback: ExtraOptions['onProgressUpdate']) => { this._onProgress(id, callback); },
      onHeadersReceived: (callback: ExtraOptions['onHeadersReceived']) => { this._onHeaders(id, callback); }
    } as any;
  }

  /**
   * check and do next task
   */
  private _next(): void {
    if (this.todo.length > 0 && this.taskMap.size < this.MAX) {
      const [taskid, taskOptions] = this.todo.shift()!;
      this._process(taskid, taskOptions);
    }
  }

  /**
   * process a task
   * @param id task ID
   * @param options  task param
   */
  private _process(id: number, options: QueueOption<Tparam>): Ttask {
    const oldComplete = options.complete;
    let timeoutFailHandle: Timeout;
    let taskTimeoutCancelled = false;
    options.complete = (res: { time?: TimeRecorder; timeout?: boolean }) => {
      if (timeoutFailHandle) {
          clearTimeout(timeoutFailHandle);
      }
      if (options.timestamp && this.taskMap.has(id)) {
        res.time = this.taskMap.get(id)![1] || {};
        res.time.response = Date.now();
      }
      res.timeout = taskTimeoutCancelled;

      this.taskMap.delete(id);
      if (oldComplete) {
        oldComplete.call(options, res);
      }
      this._next();
    };

    const oldFail = options.fail;
    options.fail = (res: { errMsg: string; timeout?: boolean }) => {
      if (taskTimeoutCancelled) {
          res.errMsg = 'request failed: timeout';
      }
      res.timeout = taskTimeoutCancelled;
      if (oldFail) {
          oldFail.call(options, res);
      }
    };
    const task = this.operator(options);

    if (options.timeout && options.timeout > 0) {
        timeoutFailHandle = setTimeout(
            () => {
                taskTimeoutCancelled = true;
                task.abort();
                },
            options.timeout);
    }

    // task progress polyfill
    if (options.onProgressUpdate && task.onProgressUpdate) {
      task.onProgressUpdate(options.onProgressUpdate);
    }
    // task onHeadersReceived
    if (options.onHeadersReceived) {
      task.onHeadersReceived(options.onHeadersReceived);
    }
    this.taskMap.set(id, [
      task,
      options.timestamp ? { send: Date.now() } : undefined
    ]);

    return task;
  }

  /**
   * stop and remove a task
   * @param taskid - the id of task to abort
   */
  private _abort(taskid: number) {
    const index = this.todo.findIndex(v => v[0] === taskid);
    if (index >= 0) {
      const completeCallback = this.todo[index][1].complete;
      this.todo.splice(index, 1);
      // call back complete.
      if (completeCallback) {
        completeCallback({ errMsg: 'request:fail abort', cancel: true, source: WxQueue.name });
      }
    } else if (this.taskMap.has(taskid)) {
      this.taskMap.get(taskid)![0].abort();
      this.taskMap.delete(taskid);
    }
  }

  /**
   * progress update callback
   * https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.onProgressUpdate.html
   * @param taskid - task id
   * @param callback 回调操作
   */
  private _onProgress(
    taskid: number,
    callback: ExtraOptions['onProgressUpdate']
  ): void {
    const result = this.todo.find(v => v[0] === taskid);
    if (result) {
      result[1].onProgressUpdate = callback;
    } else if (this.taskMap.has(taskid)) {
      this.taskMap.get(taskid)![0].onProgressUpdate!(callback as any);
    }
  }

  private _onHeaders(
    taskid: number,
    callback: ExtraOptions['onHeadersReceived']
  ) {
    const result = this.todo.find(v => v[0] === taskid);
    if (result) {
      result[1].onHeadersReceived = callback;
    } else if (this.taskMap.has(taskid)) {
      this.taskMap.get(taskid)![0].onHeadersReceived(callback);
    }
  }
}

export type QueueOption<T> = T & ExtraOptions;

/**
 * 微信操作参数声明
 */
interface ExtraOptions {
  /**
   * progress 回调
   */
  onProgressUpdate?:
  | wx.UploadTaskOnProgressUpdateCallback
  | wx.DownloadTaskOnProgressUpdateCallback;
  /**
   * 是否插队
   */
  jump?: boolean;

  /**
   * 自定义超时时间
   */
  timeout?: number;

  /**
   * 记录时间戳
   */
  timestamp?: boolean | object;

  /**
   * 开发者服务器返回的 HTTP Response Header 回调
   */
  onHeadersReceived?(result: { header: object }): void;
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
  onHeadersReceived(callback: ExtraOptions['onHeadersReceived']): void;
  /** 下载进度变化事件的回调函数 */
  onProgressUpdate?(callback: ExtraOptions['onProgressUpdate']): void;
}

declare namespace wx {
  type UploadTaskOnProgressUpdateCallback = (
    res: {
      /**
       * 上传进度百分比
       */
      progress: number;
      /**
       * 已经上传的数据长度，单位 Bytes
       */
      totalBytesSent: number;
      /**
       * 预期需要上传的数据总长度，单位 Bytes
       */
      totalBytesExpectedToSend: number;
    }
  ) => void;

  type DownloadTaskOnProgressUpdateCallback = (
    res: {
      /**
       * 下载进度百分比
       */
      progress: number;
      /**
       * 已经下载的数据长度，单位 Bytes
       */
      totalBytesWritten: number;
      /**
       * 预期需要下载的数据总长度，单位 Bytes
       */
      totalBytesExpectedToWrite: number;
    }
  ) => void;
}

export interface TimeRecorder {
  send?: number;
  response?: number;
}
