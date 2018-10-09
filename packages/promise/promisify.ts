
export function promisify<T>(func: (...args: any[]) => any, context?: any, callbackIndex = 0): ((...args: any[]) => Promise<T>) {
    return (...args: any[]) => new Promise((resolve, reject) => {
        let { success, fail, complete, ...arg } = (args[callbackIndex] || {}) as any

        args[callbackIndex] = {
            ...arg,
            success: (res: any) => {
                resolve(res)
                if (success) success(res)
            },
            fail: (err: any) => {
                reject(err)
                if (fail) fail(err)
            },
            complete
        }

        func.call(context, ...args)
    })
}

interface ICancellablePromise<T> extends Promise<T> {
    cancel?(callback?: () => T): void
}

export function promisifyCancel<T>(func: (...args: any[]) => any, context?: any, callbackIndex = 0): ((...args: any[]) => ICancellablePromise<T>) {
    return (...args: any[]) => {
        const p: ICancellablePromise<T> = new Promise((resolve, reject) => {
            let { success, fail, complete, ...arg } = (args[callbackIndex] || {}) as any

            args[callbackIndex] = {
                ...arg,
                success: (res: any) => {
                    resolve(res)
                    if (success) success(res)
                },
                fail: (err: any) => {
                    reject(err)
                    if (fail) fail(err)
                },
                complete
            }

            const task = func.call(context, ...args);

            p.cancel = () => {
                reject = null;
                fail = null;
                task.abort();
            }
        })
        return p;
    }
}