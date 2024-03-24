export type DeferredPromise<T> = {
    promise: Promise<T>
    resolve: (value: T | PromiseLike<T>) => void
    reject: (reason?: any) => void
}

export const makeDeferredPromise = <T>(): DeferredPromise<T> => {
    let promiseResolve: (value: T | PromiseLike<T>) => void = () => undefined
    let promiseReject: (reason?: any) => void = () => undefined

    const promise = new Promise<T>((resolve, reject) => {
        promiseResolve = resolve
        promiseReject = reject
    })

    return {
        promise,
        resolve: promiseResolve,
        reject: promiseReject
    }
}