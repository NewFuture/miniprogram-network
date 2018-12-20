
declare namespace wx {
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
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: { errMsg: string }) => void;
        /** 接口调用失败的回调函数 */
        fail?: (res: { errMsg: string }) => void;
        /** 接口调用成功的回调函数 */
        success?: (
            result: {
                /** 开发者服务器返回的 HTTP 状态码 */
                statusCode: number;
                /** 临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件 */
                tempFilePath: string;
            },
        ) => void;
        /** 指定文件下载后存储的路径
         *
         * 最低基础库： `1.8.0` */
        filePath?: string;
        /** HTTP 请求的 Header，Header 中不能设置 Referer */
        header?: object;
    }
    interface DownloadTask {
        /**
         *
         * 中断下载任务
         *
         * 最低基础库： `1.4.0` */
        abort(): void;
        // offHeadersReceived(
        //   callback: DownloadTaskOffHeadersReceivedCallback,
        // ): void;
        // offProgressUpdate(
        //   callback: DownloadTaskOffProgressUpdateCallback,
        // ): void;
        onHeadersReceived(
            /** HTTP Response Header 事件的回调函数 */
            callback: DownloadTaskOnHeadersReceivedCallback,
        ): void;
        /** [DownloadTask.onProgressUpdate(function callback)](DownloadTask.onProgressUpdate.md)
         *
         * 监听下载进度变化事件
         *
         * 最低基础库： `1.4.0` */
        onProgressUpdate(
            /** 下载进度变化事件的回调函数 */
            callback: DownloadTaskOnProgressUpdateCallback,
        ): void;
    }
}