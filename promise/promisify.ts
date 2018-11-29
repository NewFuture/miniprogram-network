import { CancelablePromise } from "./cancelable-promise";

interface WxAsyncOptions {
    success?: Function,
    fail?: Function,
    complete?: Function,
    [propName: string]: any
}

/**
 * Promisify wx function
 * @param func wx.function
 */
export function promisify<T>(func: (o: WxAsyncOptions) => any): ((o: WxAsyncOptions) => Promise<T>) {
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

/**
 * Promisify wx function as CancelablePromisify
 * @param func wx.function
 */
export function cancelablePromisify<T>(func: (o: WxAsyncOptions) => any): ((o: WxAsyncOptions) => CancelablePromise<T>) {
    return (options: WxAsyncOptions) => new CancelablePromise<T>((resolve, reject) => {
        options.success = (res: any) => {
            options.success && options.success(res);
            resolve(res);
        }
        options.fail = (err: any) => {
            options.fail && options.fail(err);
            reject(err);
        }
        return func(options)
    }, (task) => task.abort());
}

export {CancelablePromise}