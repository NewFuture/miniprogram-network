
/// <reference no-default-lib="true"/>
/// <reference lib="es2015.promise"/>
/// <reference lib="es2018.promise"/>
interface Promise<T> {
    // tslint:disable-next-line: no-reserved-keywords
    readonly constructor: PromiseConstructor;
}

if (!Promise.prototype.finally) {
    Promise.prototype.finally = function <T>(this: Promise<T>, onfinally?: (() => void) | undefined | null): Promise<T> {
        if (onfinally) {
            const P = this.constructor;
            // tslint:disable
            return this.then(
                value => P.resolve(onfinally()).then(() => value),
                reason => P.resolve(onfinally()).then(() => { throw reason; })
            );
        } else {
            return this;
        }
    };
}
