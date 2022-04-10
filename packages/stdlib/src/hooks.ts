export type HookFn<A extends any[] = any[]> = (...args: A) => void;
export type HookCatchFn = (e: Error) => void;
export type CallbackArgs<A extends any[] = any[]> = {
    async: boolean;
    callback: HookFn<A>;
    catchFn?: HookCatchFn;
    scope?: any;
    once?: boolean;
};

export type HooksMap<T extends string> = {
    [index in T]: Hook<any>;
}

export class Hook<A extends any[] = any[]> {

    private _callbacks: CallbackArgs<A>[];
    private _callCount: number;

    constructor() {
        this._callbacks = [];
        this._callCount = 0;
    }

    public get callCount(): number {
        return this._callCount;
    }

    public get calledOnce(): boolean {
        return this._callCount > 0;
    }

    public pipe(hook: Hook) {
        this.tap(hook.call, null, hook);
    }

    public unpipe(hook: Hook) {
        this.untap(hook.call, hook);
    }

    public tap(callback: HookFn<A>, catchFn?: HookCatchFn, scope?: any) {
        this._callbacks.push({
            async: false,
            callback,
            catchFn,
            scope,
        });
    }

    public tapOnce(callback: HookFn<A>, catchFn?: HookCatchFn, scope?: any) {
        this._callbacks.push({
            async: false,
            once: true,
            callback,
            catchFn,
            scope,
        });
    }

    public tapAsync(callback: HookFn<A>, catchFn?: HookCatchFn, scope?: any) {
        this._callbacks.unshift({
            async: true,
            callback,
            catchFn,
            scope,
        });
    }

    public tapAsyncOnce(callback: HookFn<A>, catchFn?: HookCatchFn, scope?: any) {
        this._callbacks.unshift({
            async: true,
            once: true,
            callback,
            catchFn,
            scope,
        });
    }

    public untap(callbackToRemove: HookFn<A>, callbackScope?: any) {
        this._callbacks = this._callbacks.filter(({callback, scope}) => {
            return !(callbackToRemove === callback && (scope && callbackScope ? scope === callbackScope : true));
        });
    }

    public untapAll() {
        this._callbacks = [];
    }

    public async call(...args: A) {
        const onceCallbacks = [];
        let callbackArgs: CallbackArgs<A>;
        const callbacks = [...this._callbacks];
        for (let i = 0, len = callbacks.length; i < len; i++) {
            callbackArgs = callbacks[i];
            if (!callbackArgs) continue;

            try {
                if (callbackArgs.once) {
                    onceCallbacks.push(callbackArgs.callback);
                }
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

        if (onceCallbacks.length) {
            onceCallbacks.map((callback) => this.untap(callback));
            onceCallbacks.length = 0;
        }

        this._callCount++;
    }
}