export type HookFn<A extends any[] = any[]> = (...args: A) => void;
export type HookCatchFn = (e: Error) => void;
export type CallbackArgs<A extends any[] = any[]> = {
    async: boolean;
    callback: HookFn<A>;
    catchFn?: HookCatchFn;
    scope?: any;
};

export type HooksMap<T extends string> = {
    [index in T]: Hook<any>;
}

export class Hook<A extends any[] = any[]> {

    private _callbacks: CallbackArgs<A>[];

    constructor() {
        this._callbacks = [];
    }

    public pipe(hook: Hook) {
        this.tap(hook.call, null, hook);
    }

    public unpipe(hook: Hook) {
        this.untap(hook.call);
    }

    public tap(callback: HookFn<A>, catchFn?: HookCatchFn, scope?: any) {
        this._callbacks.push({
            async: false,
            callback,
            catchFn,
            scope,
        });
    }

    public tapAsync(callback: HookFn<A>, catchFn?: HookCatchFn, scope?: any) {
        this._callbacks.push({
            async: true,
            callback,
            catchFn,
            scope,
        });
    }

    public untap(callbackToRemove: HookFn<A>) {
        this._callbacks = this._callbacks.filter(({ callback }) => {
            return callbackToRemove !== callback;
        });
    }

    public async call(...args: A) {
        let callbackArgs: CallbackArgs<A>;
        for (let i = 0, len = this._callbacks.length; i < len; i++) {
            callbackArgs = this._callbacks[i];

            try {
                if (callbackArgs.async) {
                    await callbackArgs.callback.apply(callbackArgs.scope, args);
                } else {
                    callbackArgs.callback.apply(callbackArgs.scope, args);
                }
            } catch (e) {
                if (callbackArgs.catchFn) {
                    callbackArgs.catchFn(e);
                } else {
                    throw e;
                }
            }
        }
    }
}