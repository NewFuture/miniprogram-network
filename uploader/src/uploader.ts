
import { BaseConfiguration, ExtraConfiguration, LifeCycle, SuccessParam } from 'miniprogram-network-life-cycle';
import { ParamsType } from 'miniprogram-network-utils';
import { transformUploadSendDefault } from './transform';

/**
 * 默认配置信息
 */
export interface UploadInit extends BaseConfiguration<FullUploadOption, wx.UploadFileOption> {
    /**
     * 上传API
     */
    url?: string;
    /**
     * 上传文件名字段
     */
    name?: string;
}
/**
 * 下载的全部配置项
 * @template TData patch data参数格式类型,默认 any
 */
interface BaseUploadOption<
    TData extends object = NonNullable<wx.UploadFileOption['formData']>
    > {

    /**
     * 本地文件路径
     */
    filePath: string;

    /**
     * 上传服务器API地址
     * 如果URL以`http://`或者`https://`开头将忽略 baseURL
     */
    url?: NonNullable<string>;

    /**
     * 上传文件名字段
     */
    name?: string;

    /**
     * 请求附加的 form Data
     */
    data?: TData;
}

/**
 * 上传的全部配置信息
 */
export interface FullUploadOption extends UploadInit, ExtraConfiguration, BaseUploadOption {
    /**
     * 下载进度回调函数
     */
    onProgressUpdate?: wx.UploadTaskOnProgressUpdateCallback;
}

/**
 * 每个传的额外配置
 * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
 */
type UploadConfig<
    TParams = ParamsType,
    > = Partial<UploadInit & ExtraConfiguration> & {
        /**
         * 路径参数
         * URL Path Params
         * the path parameters to be replace in path
         * Must be a plain `object` or `array`
         * @example
         *  url = "/{ID}/status"
         *  param = {ID: 12345}
         *  request url will be /1234/status
         */
        params?: TParams;

        /**
         * 下载进度回调函数
         */
        onProgressUpdate?: wx.UploadTaskOnProgressUpdateCallback;
    };

/**
 * 单个上传的全部参数
 * @template TData patch data参数格式类型,默认 any
 * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
 */
export type UploadOption<
    TData extends object = object,
    TParams = ParamsType,
    > = UploadConfig<TParams> & BaseUploadOption<TData>;

/**
 * 上传管理
 */
export class Uploader extends LifeCycle<
    wx.UploadFileOption,
    wx.UploadTask,
    UploadInit,
    FullUploadOption
    > {
    /**
     * 默认上传请求参数转换函数
     */
    // protected readonly TransformSendDefault = transformUploadSendDefault;

    /**
     * 创建Upload管理
     * @param config 全局配置
     * @param uploader 操作函数,默认使用上传队列
     * @param listeners 上传事件监听通知
     */
    constructor(
        config?: UploadInit,
        uploader?: (op: wx.UploadFileOption) => wx.UploadTask,
        listeners?: Uploader['Listeners']
    ) {
        super(
            // tslint:disable-next-line: no-use-before-declare
            uploader || wx.uploadFile,
            config || { transformSend: transformUploadSendDefault },
            listeners
        );
    }

    /**
     * 自定义上传
     * @param options 全部配置信息:filePath,name,为必填字段
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData 上传 query data参数格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    public upload<
        TReturn = SuccessParam<wx.UploadFileOption>,
        TData extends object = object,
        TParams = ParamsType,
        >(options: UploadOption<TData, TParams>): Promise<TReturn>;
    /**
     * 快速上传文件
     * @param filePath 本地文件路径
     * @param name 文件名
     * @param url 上传地址可选
     * @param data 附加formData数据，可选
     * @param options 其他参数
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData 上传 query data参数格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    public upload<
        TReturn = SuccessParam<wx.UploadFileOption>,
        TData = object,
        TParams = ParamsType,
        >(
            filePath: string,
            name: string,
            url?: string,
            data?: TData,
            config?: UploadConfig<TParams>
        ): Promise<TReturn>;

    public upload<T>(): Promise<T> {
        const argNum: number = arguments.length;
        const options: FullUploadOption = argNum === 1 ? arguments[0] as FullUploadOption : (arguments[4] as FullUploadOption || {});
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
