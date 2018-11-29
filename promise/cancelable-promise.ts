const handleCallback = (resolve, reject, callback, r) => {
    try {
        resolve(callback(r));
    } catch (e) {
        reject(e);
    }
};

/**
 * CancelablePromise
 */
export class CancelablePromise<T> implements PromiseLike<T> {
    private readonly promise: Promise<T>;
    private isCancelled: boolean = false;
    private cancelFunction: Function | void = undefined;

    /**
 * Creates a new CancelablePromise.
 * @param executor A callback used to initialize the Cancelable promise. This callback is passed two arguments:
 * a resolve callback used to resolve the promise with a value or the result of another promise,
 * and a reject callback used to reject the promise with a provided reason or error.
 * @param canceller  a cancel handler used to cancel the promise with a provided reason. 
 */
    constructor(executor: (
        resolve: (value?: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
    ) => any, canceller?: undefined | ((result?: any) => any)) {
        this.promise = new Promise<T>((resolve, reject) => {
            const result = executor(resolve, reject);
            if (canceller) {
                this.cancelFunction = () => canceller(result);
            }
        });
    }

    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new CancelablePromise.
     */
    static all(values: Array<any | PromiseLike<any>>): CancelablePromise<any[]> {
        return new CancelablePromise(
            (resolve, reject) => Promise.all(values).then(resolve, reject),
            () => values.forEach(v => v && typeof v.cancel === 'function' && v.cancel())
        );
    }

    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new CancelablePromise.
     */
    static race(values: Array<any | PromiseLike<any>>): CancelablePromise<any[]> {
        return new CancelablePromise(
            (resolve, reject) => Promise.race(values).then(resolve, reject),
            () => () => values.forEach(v => v && typeof v.cancel === 'function' && v.cancel())
        );
    }

    public static reject(reason: any): CancelablePromise<any>;
    /**
     * Creates a new rejected CancelablePromise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected CancelablePromise.
     */
    public static reject<T = never>(reason?: any): CancelablePromise<T | any> {
        return new CancelablePromise(
            (resolve, reject) => reject(reason)
        );
    }

   static resolve(value?:void): CancelablePromise<void>;
    /**
     * Creates a new resolved CancelablePromise for the provided value.
     * @param value A promise.
     * @returns A CancelablePromise whose internal state matches the provided promise.
     */
    static resolve<T>(value: T | PromiseLike<T>): CancelablePromise<T> {
        return new CancelablePromise(
            (resolve, reject) => resolve(value)
        );
    }

    /**
     * Cancel the promise
     */
    public cancel(): void {
        if (!this.isCancelled) {
            this.isCancelled = true;
            this.cancelFunction && this.cancelFunction();
        }
    }

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A CancelablePromise for the completion of which ever callback is executed.
     */
    public then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): CancelablePromise<TResult1 | TResult2> {
        return new CancelablePromise<TResult1 | TResult2>(
            (resolve, reject) => this.promise.then(onfulfilled, onrejected).then(resolve, reject),
            this.cancel
        );
    }


    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A CancelablePromise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): CancelablePromise<T | TResult> {
        return this.then(undefined, onrejected);
    }
}

CancelablePromise.all([]).cancel()