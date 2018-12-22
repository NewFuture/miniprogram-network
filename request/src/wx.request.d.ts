declare namespace wx {
    function request(option: RequestOption): RequestTask;
    interface RequestOption {
        /** 开发者服务器接口地址 */
        url: string;
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: { errMsg: string }) => void;
        /** 接口调用失败的回调函数 */
        fail?: (res: { errMsg: string }) => void;
        /** 接口调用成功的回调函数 */
        success?: (result: RequestSuccessCallbackResult) => void;
        /** 响应的数据类型
         *
         * 可选值：
         * - 'text': 响应的数据为文本;
         * - 'arraybuffer': 响应的数据为 ArrayBuffer;
         *
         * 最低基础库： `1.7.0` */
        responseType?: 'text' | 'arraybuffer';
        /** 返回的数据格式
         *
         * 可选值：
         * - 'json': 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse;
         * - '其他': 不对返回的内容进行 JSON.parse; */
        dataType?: 'json' | '其他';
        /** HTTP 请求方法
         *
         * 可选值：
         * - 'OPTIONS': HTTP 请求 OPTIONS;
         * - 'GET': HTTP 请求 GET;
         * - 'HEAD': HTTP 请求 HEAD;
         * - 'POST': HTTP 请求 POST;
         * - 'PUT': HTTP 请求 PUT;
         * - 'DELETE': HTTP 请求 DELETE;
         * - 'TRACE': HTTP 请求 TRACE;
         * - 'CONNECT': HTTP 请求 CONNECT; */
        method?:
        | 'OPTIONS'
        | 'GET'
        | 'HEAD'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'TRACE'
        | 'CONNECT';
        /** 设置请求的 header，header 中不能设置 Referer。
         *
         * `content-type` 默认为 `application/json` */
        header?: object;
        /** 请求的参数 */
        data?: string | object | ArrayBuffer;
    }
    interface RequestTask {
        /** [RequestTask.abort()](RequestTask.abort.md)
         *
         * 中断请求任务
         *
         * 最低基础库： `1.4.0` */
        abort(): void;
        /** [RequestTask.offHeadersReceived(function callback)](RequestTask.offHeadersReceived.md)
         *
         * 取消监听HTTP Response Header 事件，会比请求完成事件更早
         *
         * 最低基础库： `2.1.0` */
        // offHeadersReceived(
        //   /** HTTP Response Header 事件的回调函数 */
        //   callback: RequestTaskOffHeadersReceivedCallback,
        // ): void;
        /** [RequestTask.onHeadersReceived(function callback)](RequestTask.onHeadersReceived.md)
         *
         * 监听HTTP Response Header 事件，会比请求完成事件更早
         *
         * 最低基础库： `2.1.0` */
        onHeadersReceived(
            /** HTTP Response Header 事件的回调函数 */
            callback: (result?: { header: object }) => void,
        ): void;
    }
    interface RequestSuccessCallbackResult {
        /** 开发者服务器返回的 HTTP Response Header
         *
         * 最低基础库： `1.2.0` */
        header: object;
        /** 开发者服务器返回的 HTTP 状态码 */
        statusCode: number;
        /** 开发者服务器返回的数据 */
        data: string | object | ArrayBuffer;
        /** cookie信息2.4.2以上版本有 */
        cookie?: any[];
    }
}