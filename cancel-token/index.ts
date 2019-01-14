
/**
 * ICancelTokenSource
 */
export interface ICancelTokenSource<T= any> {
    /**
     * token
     */
    readonly token: CancelToken;
    /**
     * 取消函数
     */
    cancel(reason?: T): void;
}

/**
 * 为异步Promise和async/await 提供取消接口
 * @example `const cts = CancleToken.source(); cts.cancle()`
 */
export class CancelToken {
    /**
     * Promise of CancelToken
     */
    public readonly promise: Promise<any>;
    private reason: string | any;

    /**
     * 生成CancelToken
     * @param executor - callback
     */
    private constructor(executor: (cancel: ICancelTokenSource['cancel']) => void) {
        let resolve: ICancelTokenSource['cancel'];
        // tslint:disable-next-line:promise-must-complete
        this.promise = new Promise<any>((res: ICancelTokenSource['cancel']) => { resolve = res; });
        executor((reason?: any) => {
            if (this.reason === undefined) {
                return;
            }
            this.reason = reason === undefined ? 'Canceled' : reason;
            resolve(this.reason);
        });
    }

    /**
     * Create TokenSoure
     * @returns 生成一个CancelTokenSource
     */
    public static source(): ICancelTokenSource {
        let cancel: ICancelTokenSource['cancel'];
        const token = new CancelToken((c) => {
            cancel = c;
        });

        ///@ts-ignore
        return { token, cancel };
    }

    /**
     * 是否已取消
     */
    public isCancelled(): boolean {
        return this.reason === undefined;
    }

    /**
     * 如果已取消，抛出异常
     * 防止二次取消
     */
    public throwIfRequested(): void | never {
        if (this.reason !== undefined) {
            throw this.reason;
        }
    }
}
