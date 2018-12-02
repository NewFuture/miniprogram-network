type CancelFunction = (reason?: any) => void;

export interface CancelTokenSource {
    token: CancelToken;
    cancel: CancelFunction;
}

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
    private constructor(executor: (cancel: CancelFunction) => void) {
        let resolve: CancelFunction;
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
    isCancelled() {
        return this.reason === undefined;
    }

    throwIfRequested() {
        if (this.reason !== undefined) {
            throw this.reason;
        }
    }

    /**
     * Create TokenSoure
     */
    static source(): CancelTokenSource {
        let cancel: CancelFunction = null as any;
        const token = new CancelToken((c) => {
            cancel = c;
        });
        return { token, cancel };
    }
}
