export const makeDeferredPromise = () => {
    let promiseResolve = () => undefined;
    let promiseReject = () => undefined;

    const promise = new Promise((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    return {
        promise,
        resolve: promiseResolve,
        reject: promiseReject
    };
};
