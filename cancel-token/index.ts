
/**
 * CancelTokenSource
 */
export interface CancelTokenSource {
    /**
     * token
     */
    readonly token: CancelToken;
    /**
     * 取消函数
     */
    readonly cancel: (reason?: any) => any;
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
    private reason: string | any = undefined;

    /**
     * 生成CancelToken
     * @param executor 
     */
    private constructor(executor: (cancel: CancelTokenSource['cancel']) => void) {
        let resolve: CancelTokenSource['cancel'];
        this.promise = new Promise<any>((res) => resolve = res);
        executor((reason?: any) => {
            if (this.reason === undefined) {
                return;
            }
            this.reason = reason === undefined ? 'Canceled' : reason;
            resolve(this.reason);
        });
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

    /**
     * Create TokenSoure
     * @returns 生成一个CancelTokenSource
     */
    static source(): CancelTokenSource {
        let cancel: CancelTokenSource['cancel'] = null as any;
        const token = new CancelToken((c) => {
            cancel = c;
        });
        return { token, cancel };
    }
}
