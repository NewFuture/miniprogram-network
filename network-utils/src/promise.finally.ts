
// add Finally interface
interface IFinallyPromise<T> {
    finally(callback: Function): Promise<T>;
}
interface Promise<T> extends IFinallyPromise<T> { }

if (!Promise.prototype.finally) {
    Promise.prototype.finally = function <T>(callback: Function): Promise<T> {
        const P = this.constructor as PromiseConstructor;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => { throw reason; })
        );
    };
}
