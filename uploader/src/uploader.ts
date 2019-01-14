
import { BaseConfiguration, ExtraConfiguration, LifeCycle, SuccessParam } from 'miniprogram-network-life-cycle';
import { Omit } from 'miniprogram-network-utils';
import { WxQueue } from 'miniprogram-queue';
import { transformUploadSendDefault } from './transform';

// tslint:disable-next-line: no-use-before-declare
const uploadQueue = new WxQueue<wx.UploadFileOption, wx.UploadTask>(wx.uploadFile);
/**
 * 默认配置信息
 */
export interface UploadInit extends BaseConfiguration<UploadOption, wx.UploadFileOption> {
    url?: string;
}
/**
 * 全部配置信息
 */
export interface UploadOption<T extends object = NonNullable<wx.UploadFileOption['formData']>>
    extends Partial<UploadInit>, ExtraConfiguration {
    filePath: NonNullable<string>;
    name: NonNullable<string>;
    data?: T;
    onProgressUpdate?: wx.UploadTaskOnProgressUpdateCallback;
}

/**
 * 上传管理
 */
export class Uploader extends LifeCycle<wx.UploadFileOption, wx.UploadTask, UploadInit, UploadOption> {
    /**
     * 默认上传请求参数转换函数
     */
    // protected readonly TransformSendDefault = transformUploadSendDefault;

    /**
     * 创建Upload管理
     * @param config 全局配置
     * @param uploader 操作函数,默认使用上传队列
     */
    constructor(config?: UploadInit, uploader?: (op: wx.UploadFileOption) => wx.UploadTask) {
        super(uploader || uploadQueue.push.bind(uploadQueue), config || { transformSend: transformUploadSendDefault });
    }

    /**
     * 快速上传文件
     * @param filePath 本地文件路径
     * @param name 文件名
     * @param url 上传地址可选
     * @param data 附加formData数据，可选
     * @param options 其他参数
     */
    public upload<TReturn= SuccessParam<wx.UploadFileOption>, TData= object>(
        filePath: string,
        name: string,
        url?: string,
        data?: TData,
        config?: Omit<UploadOption, 'filePath' | 'name' | 'url' | 'data'>): Promise<TReturn>;
    /**
     * 自定义上传
     * @param options 全部配置信息:filePath,name,为必填字段
     */
    public upload<TReturn= SuccessParam<wx.UploadFileOption>, TData extends object = object>(
        options: UploadOption<TData>): Promise<TReturn>;
    public upload<T>(): Promise<T> {
        const argNum: number = arguments.length;
        const options: UploadOption = argNum === 1 ? arguments[0] as UploadOption : (arguments[4] as UploadOption || {});
        if (argNum > 1) {
            options.filePath = arguments[0] as string;
            options.name = arguments[1] as string;
            options.url = arguments[2] as string;
            options.data = arguments[3] as object;
        }
        return this.process<T>(options);
    }
}

export declare namespace wx {
    function uploadFile(option: UploadFileOption): UploadTask;
    interface GeneralCallbackResult {
        errMsg: string;
    }
    interface UploadFileOption {
        /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
        name: string;
        /** 要上传文件资源的路径 */
        filePath: string;
        /** 开发者服务器地址 */
        url: string;
        /** HTTP 请求中其他额外的 form data */
        formData?: object;
        /** HTTP 请求 Header，Header 中不能设置 Referer */
        header?: object;
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?(res: GeneralCallbackResult): void;
        /** 接口调用失败的回调函数 */
        fail?(res: GeneralCallbackResult): void;
        /** 接口调用成功的回调函数 */
        success?(result: UploadFileSuccessCallbackResult): void;
    }
    interface UploadTask {
        /** [UploadTask.abort()](UploadTask.abort.md)
         *
         * 中断上传任务
         *
         * 最低基础库： `1.4.0`
         */
        abort(): void;
        /** [UploadTask.offHeadersReceived(function callback)](UploadTask.offHeadersReceived.md)
         *
         * 取消监听HTTP Response Header 事件，会比请求完成事件更早
         *
         * 最低基础库： `2.1.0`
         */
        // offHeadersReceived(
        //   /** HTTP Response Header 事件的回调函数 */
        //   callback:  (
        //     res: GeneralCallbackResult,
        //   ) => void,
        // ): void;
        /** [UploadTask.offProgressUpdate(function callback)](UploadTask.offProgressUpdate.md)
         *
         * 取消监听上传进度变化事件
         *
         * 最低基础库： `2.1.0`
         */
        // offProgressUpdate(
        //     /** 上传进度变化事件的回调函数 */
        //     callback: (res: GeneralCallbackResult) => void,
        // ): void;
        /** [UploadTask.onHeadersReceived(function callback)](UploadTask.onHeadersReceived.md)
         *
         * 监听HTTP Response Header 事件，会比请求完成事件更早
         *
         * 最低基础库： `2.1.0`
         */
        onHeadersReceived(
            /** HTTP Response Header 事件的回调函数 */
            callback: (
                result: {
                    /** 开发者服务器返回的 HTTP Response Header */
                    header: object;
                }
            ) => void
        ): void;
        /** [UploadTask.onProgressUpdate(function callback)](UploadTask.onProgressUpdate.md)
         *
         * 监听上传进度变化事件
         *
         * 最低基础库： `1.4.0`
         */
        onProgressUpdate(
            callback: UploadTaskOnProgressUpdateCallback): void;
    }
    interface UploadFileSuccessCallbackResult {
        /** 开发者服务器返回的 HTTP 状态码 */
        statusCode: number;
        /** 开发者服务器返回的数据 */
        data: string;
    }

    /** 上传进度变化事件的回调函数 */
    type UploadTaskOnProgressUpdateCallback = (
        result: {
            /** 上传进度百分比 */
            progress: number;
            /** 预期需要上传的数据总长度，单位 Bytes */
            totalBytesExpectedToSend: number;
            /** 已经上传的数据长度，单位 Bytes */
            totalBytesSent: number;
        }) => void;
}
