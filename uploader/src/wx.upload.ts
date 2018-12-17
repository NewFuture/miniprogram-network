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
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: GeneralCallbackResult) => void;
        /** 接口调用失败的回调函数 */
        fail?: (res: GeneralCallbackResult) => void;
        /** 接口调用成功的回调函数 */
        success?: (result: UploadFileSuccessCallbackResult) => void;
        /** HTTP 请求中其他额外的 form data */
        formData?: object;
        /** HTTP 请求 Header，Header 中不能设置 Referer */
        header?: object;
    }
    interface UploadTask {
        /** [UploadTask.abort()](UploadTask.abort.md)
         *
         * 中断上传任务
         *
         * 最低基础库： `1.4.0` */
        abort(): void;
        /** [UploadTask.offHeadersReceived(function callback)](UploadTask.offHeadersReceived.md)
         *
         * 取消监听HTTP Response Header 事件，会比请求完成事件更早
         *
         * 最低基础库： `2.1.0` */
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
         * 最低基础库： `2.1.0` */
        // offProgressUpdate(
        //     /** 上传进度变化事件的回调函数 */
        //     callback: (res: GeneralCallbackResult) => void,
        // ): void;
        /** [UploadTask.onHeadersReceived(function callback)](UploadTask.onHeadersReceived.md)
         *
         * 监听HTTP Response Header 事件，会比请求完成事件更早
         *
         * 最低基础库： `2.1.0` */
        onHeadersReceived(
            /** HTTP Response Header 事件的回调函数 */
            callback: (
                result: {
                    /** 开发者服务器返回的 HTTP Response Header */
                    header: object;
                },
            ) => void,
        ): void;
        /** [UploadTask.onProgressUpdate(function callback)](UploadTask.onProgressUpdate.md)
         *
         * 监听上传进度变化事件
         *
         * 最低基础库： `1.4.0` */
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
        }) => void
}