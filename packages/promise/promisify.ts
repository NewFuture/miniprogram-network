
interface WxAsyncOptions {
    success?: Function,
    fail?: Function,
    complete?: Function,
    [propName: string]: any
}

export function promisify<T>(func: (WxAsyncOptions) => any): ((WxAsyncOptions) => Promise<T>) {
    return (options: WxAsyncOptions) => new Promise((resolve, reject) => {
        options.success = (res: any) => {
            options.success && options.success(res);
            resolve(res);
        }
        options.fail = (err: any) => {
            options.fail && options.fail(err);
            reject(err);
        }

        func(options);
    })
}

interface ICancellablePromise<T> extends Promise<T> {
    cancel?(callback?: () => T): void
}

export function promisifyCancel<T>(func: (options: WxAsyncOptions) => any): ((options: WxAsyncOptions) => ICancellablePromise<T>) {
    return (options: WxAsyncOptions) => {
        const p: ICancellablePromise<T> = new Promise((resolve, reject) => {
            options.success = (res: any) => {
                options.success && options.success(res);
                resolve(res);
            }
            options.fail = (err: any) => {
                options.fail && options.fail(err);
                reject(err);
            }
            const task = func(options);

            p.cancel = () => {
                resolve = null;
                reject = null;
                task.abort();
            }
        })
        return p;
    }
}