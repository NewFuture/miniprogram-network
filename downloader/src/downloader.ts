import { BaseConfiguration, ExtraConfiguration, LifeCycle, SuccessParam } from 'miniprogram-network-life-cycle';
import { Omit } from 'miniprogram-network-utils';
import { WxQueue } from 'miniprogram-queue';
import { transfomDownloadSendDefault } from './transform';

// tslint:disable-next-line: no-use-before-declare
const downloadQueue = new WxQueue<wx.DownloadFileOption, wx.DownloadTask>(wx.downloadFile);

/**
 * 默认配置信息
 */
export type DownloadInit = BaseConfiguration<DownloadOption, wx.DownloadFileOption>;
/**
 * 全部配置信息
 */
export interface DownloadOption extends Partial<DownloadInit>, ExtraConfiguration {
    url: NonNullable<string>;
    filePath?: string;
    onProgressUpdate?: wx.DownloadTaskOnProgressUpdateCallback;
}

/**
 * 下载封装
 */
export class Downloader extends LifeCycle<wx.DownloadFileOption, wx.DownloadTask, DownloadInit, DownloadOption> {
    /**
     * 新建 Http实列
     * @param config 全局默认配置
     */
    public constructor(config?: DownloadInit, downloader?: (o: wx.DownloadFileOption) => wx.DownloadTask) {
        super(downloader || downloadQueue.push.bind(downloadQueue), config || { transformSend: transfomDownloadSendDefault });
    }

    /**
     * 快速下载
     * @param url 下载地址
     * @param filePath 本地文件路径
     * @param options 其他参数
     */
    public download<T= SuccessParam<wx.DownloadFileOption>>
        (url: string, filePath?: string, options?: Omit<DownloadOption, 'url' | 'filePath'>): Promise<T>;
    /**
     * Object 参数自定义下载
     * @param options - 完整下载参数
     */
    public download<T= SuccessParam<wx.DownloadFileOption>>(options: DownloadOption): Promise<T>;
    public download<T>(): Promise<T> {
        const isMultiParam = typeof arguments[0] === 'string';
        const options: DownloadOption = isMultiParam ? (arguments[2] as DownloadOption || {}) : arguments[0] as DownloadOption;
        if (isMultiParam) {
            options.url = arguments[0] as string;
            options.filePath = arguments[1] as string;
        }
        return this.process<T>(options);
    }
}

export declare namespace wx {
    function downloadFile(options: DownloadFileOption): DownloadTask;
    type DownloadTaskOnHeadersReceivedCallback = (result?: { header: object }) => void;
    type DownloadTaskOnProgressUpdateCallback = (
        result: {
            /** 下载进度百分比 */
            progress: number;
            /** 预期需要下载的数据总长度，单位 Bytes */
            totalBytesExpectedToWrite: number;
            /** 已经下载的数据长度，单位 Bytes */
            totalBytesWritten: number;
        }
    ) => void;

    interface DownloadFileOption {
        /** 下载资源的 url */
        url: string;
        /** 指定文件下载后存储的路径
         *
         * 最低基础库： `1.8.0`
         */
        filePath?: string;
        /** HTTP 请求的 Header，Header 中不能设置 Referer */
        header?: object;
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?(res: { errMsg: string }): void;
        /** 接口调用失败的回调函数 */
        fail?(res: { errMsg: string }): void;
        /** 接口调用成功的回调函数 */
        success?(result: {
            /** 开发者服务器返回的 HTTP 状态码 */
            statusCode: number;
            /** 临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件 */
            tempFilePath: string;
        }): void;
    }
    interface DownloadTask {
        /**
         *
         * 中断下载任务
         *
         * 最低基础库： `1.4.0`
         */
        abort(): void;
        // offHeadersReceived(
        //   callback: DownloadTaskOffHeadersReceivedCallback,
        // ): void;
        // offProgressUpdate(
        //   callback: DownloadTaskOffProgressUpdateCallback,
        // ): void;
        onHeadersReceived(
            /** HTTP Response Header 事件的回调函数 */
            callback: DownloadTaskOnHeadersReceivedCallback
        ): void;
        /** [DownloadTask.onProgressUpdate(function callback)](DownloadTask.onProgressUpdate.md)
         *
         * 监听下载进度变化事件
         *
         * 最低基础库： `1.4.0`
         */
        onProgressUpdate(
            /** 下载进度变化事件的回调函数 */
            callback: DownloadTaskOnProgressUpdateCallback
        ): void;
    }
}
