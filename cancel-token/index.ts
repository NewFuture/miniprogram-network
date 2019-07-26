
/**
 * ICancelTokenSource
 */
export interface ICancelTokenSource<T = string> {
    /**
     * token
     */
    readonly token: CancelToken;
    /**
     * 取消函数
     */
    cancel(reason?: T): void;
}

type CancelResolver = (res: { errMsg: string; cancel?: boolean }) => void;

/**
 * 为异步Promise和async/await 提供取消接口
 * @example `const cts = CancleToken.source(); cts.cancle()`
 */
export class CancelToken {
    /**
     * Promise of CancelToken
     */
    public readonly promise: Promise<{ errMsg: string }>;
    private reason?: string | { errMsg: string };

    /**
     * 生成CancelToken
     * @param executor - callback
     */
    private constructor(executor: (cancel: ICancelTokenSource['cancel']) => void) {
        let resolve: CancelResolver;
        // tslint:disable-next-line:promise-must-complete
        this.promise = new Promise<{ errMsg: string }>((res: CancelResolver) => { resolve = res; });
        executor((reason?: string) => {
            if (this.reason === undefined) { // 防止重复执行
                this.reason = reason === undefined ? 'abort' : reason;
                resolve({ errMsg: this.reason, cancel: true });
            }
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
        return this.reason !== undefined;
    }

    /**
     * 如果已取消，抛出异常
     * 防止二次取消
     * @throws { errMsg: string }
     */
    public throwIfRequested(): void | never {
        if (this.reason !== undefined) {
            throw typeof this.reason === 'string' ? { errMsg: this.reason, cancel: true, source: CancelToken.name } : this.reason;
        }
    }
}
